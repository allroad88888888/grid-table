import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/react'
import { format } from '../core/format'
import { dataInitAtom } from '../state'
import { getRowInfoAtomByRowId, rowInfoMapAtom } from '../stateCore'
import { columnInitAtom } from '../stateColumn'
import { headerRowIndexListAtom } from '@grid-table/basic'
import { headerDataInitAtom } from '../stateHeader'
import { distributeByFlexGrow, distributeColumnWidths } from '../plugins/calcSizeByColumn/utils'
import type { UseDataProps, ColumnType } from '../types'

/**
 * 生成扁平数据
 */
function generateFlatData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `row_${i}`,
    name: `name_${i}`,
    value: i,
  }))
}

/**
 * 生成树形数据（每个父节点 childrenPerNode 个子节点，depth 层）
 */
function generateTreeData(childrenPerNode: number, depth: number, parentId = '') {
  const data: Record<string, any>[] = []

  function build(pId: string, level: number) {
    if (level >= depth) return
    for (let i = 0; i < childrenPerNode; i++) {
      const id = pId ? `${pId}_${i}` : `${i}`
      data.push({ id, parentId: pId || undefined, name: `node_${id}`, level })
      build(id, level + 1)
    }
  }

  build(parentId, 0)
  return data
}

function generateColumns(count: number): ColumnType[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `col_${i}`,
    dataIndex: `col_${i}`,
    title: `Column ${i}`,
    width: 100,
  }))
}

function measure(label: string, fn: () => void): number {
  const start = performance.now()
  fn()
  const elapsed = performance.now() - start
  console.log(`  ${label}: ${elapsed.toFixed(2)}ms`)
  return elapsed
}

// ─── format 纯计算 ───────────────────────────────────────
describe('format performance', () => {
  test('flat 1,000 rows', () => {
    const dataSource = generateFlatData(1000)
    const iteratorCalls: string[] = []

    const elapsed = measure('format', () => {
      const result = format(
        { dataSource, rowHeight: 36 } as unknown as UseDataProps,
        { iteratorFn: (rowId) => { iteratorCalls.push(rowId) } },
      )
      expect(result.showPathList.length).toBe(1000)
    })
    expect(iteratorCalls.length).toBe(1000)
    expect(elapsed).toBeLessThan(50)
  })

  test('flat 10,000 rows', () => {
    const dataSource = generateFlatData(10000)
    let callCount = 0

    const elapsed = measure('format', () => {
      const result = format(
        { dataSource, rowHeight: 36 } as unknown as UseDataProps,
        { iteratorFn: () => { callCount++ } },
      )
      expect(result.showPathList.length).toBe(10000)
    })
    expect(callCount).toBe(10000)
    expect(elapsed).toBeLessThan(200)
  })

  test('flat 100,000 rows', () => {
    const dataSource = generateFlatData(100000)
    let callCount = 0

    const elapsed = measure('format', () => {
      const result = format(
        { dataSource, rowHeight: 36 } as unknown as UseDataProps,
        { iteratorFn: () => { callCount++ } },
      )
      expect(result.showPathList.length).toBe(100000)
    })
    expect(callCount).toBe(100000)
    expect(elapsed).toBeLessThan(2000)
  })

  test('tree 10×3 (1,110 nodes)', () => {
    const dataSource = generateTreeData(10, 3)
    const elapsed = measure('format', () => {
      const result = format(
        { dataSource, rowHeight: 36, idProp: 'id', parentProp: 'parentId' } as unknown as UseDataProps,
        { iteratorFn: () => {} },
      )
      expect(result.showPathList.length).toBe(dataSource.length)
      expect(result.isTree).toBe(true)
    })
    expect(elapsed).toBeLessThan(100)
  })

  test('tree 5×5 (3,905 nodes)', () => {
    const dataSource = generateTreeData(5, 5)
    const elapsed = measure('format', () => {
      const result = format(
        { dataSource, rowHeight: 36, idProp: 'id', parentProp: 'parentId' } as unknown as UseDataProps,
        { iteratorFn: () => {} },
      )
      expect(result.showPathList.length).toBe(dataSource.length)
    })
    expect(elapsed).toBeLessThan(200)
  })
})

// ─── dataInitAtom 整体写入 ──────────────────────────────
describe('dataInitAtom with store — write', () => {
  test.each([1000, 10000, 100000])('flat %i rows', (count) => {
    const store = createStore()
    const dataSource = generateFlatData(count)

    measure(`dataInitAtom ${count}`, () => {
      store.setter(dataInitAtom, { dataSource, rowHeight: 36 } as any)
    })

    // 验证 rowInfoMapAtom 被正确 set
    const map = store.getter(rowInfoMapAtom)
    expect(map.size).toBe(count)
    expect(map.get('0')).toEqual({ id: 'row_0', name: 'name_0', value: 0 })
  })

  test('overhead breakdown: format vs atom setters', () => {
    const dataSource = generateFlatData(10000)
    console.log('  --- 10,000 rows overhead breakdown ---')

    const formatTime = measure('format only (no store)', () => {
      format(
        { dataSource, rowHeight: 36 } as unknown as UseDataProps,
        { iteratorFn: () => {} },
      )
    })

    const store = createStore()
    const storeTime = measure('dataInitAtom (full)', () => {
      store.setter(dataInitAtom, { dataSource, rowHeight: 36 } as any)
    })

    const overhead = storeTime - formatTime
    console.log(`  atom setter overhead: ${overhead.toFixed(2)}ms (${(overhead / storeTime * 100).toFixed(0)}%)`)
    expect(storeTime).toBeGreaterThan(0)
  })
})

// ─── selectAtom 读取性能 ─────────────────────────────────
describe('selectAtom read — getRowInfoAtomByRowId', () => {
  function initStore(count: number) {
    const store = createStore()
    const dataSource = generateFlatData(count)
    store.setter(dataInitAtom, { dataSource, rowHeight: 36 } as any)
    return store
  }

  test('首次 getter 10,000 行（含 selectAtom 创建）', () => {
    const store = initStore(10000)

    const elapsed = measure('getter × 10,000', () => {
      for (let i = 0; i < 10000; i++) {
        const info = store.getter(getRowInfoAtomByRowId(`${i}`))
        if (i === 0) expect(info).toEqual({ id: 'row_0', name: 'name_0', value: 0 })
      }
    })
    expect(elapsed).toBeLessThan(1000)
  })

  test('二次 getter 10,000 行（selectAtom 已缓存）', () => {
    const store = initStore(10000)

    // 第一轮：创建缓存
    for (let i = 0; i < 10000; i++) {
      store.getter(getRowInfoAtomByRowId(`${i}`))
    }

    // 第二轮：纯读取
    const elapsed = measure('cached getter × 10,000', () => {
      for (let i = 0; i < 10000; i++) {
        store.getter(getRowInfoAtomByRowId(`${i}`))
      }
    })
    expect(elapsed).toBeLessThan(500)
  })

  test('随机读取 1,000 次（模拟虚拟滚动可见区域读取）', () => {
    const store = initStore(100000)
    const indices = Array.from({ length: 1000 }, () => `${Math.floor(Math.random() * 100000)}`)

    const elapsed = measure('random getter × 1,000', () => {
      indices.forEach((id) => {
        store.getter(getRowInfoAtomByRowId(id))
      })
    })
    expect(elapsed).toBeLessThan(200)
  })
})

// ─── 数据更新（重新 set rowInfoMapAtom）性能 ────────────
describe('rowInfoMapAtom update performance', () => {
  test('全量更新 10,000 行 → 订阅通知开销', () => {
    const store = createStore()
    const dataSource = generateFlatData(10000)
    store.setter(dataInitAtom, { dataSource, rowHeight: 36 } as any)

    // 先订阅一批 selectAtom
    const subCount = 200
    const unsubs: (() => void)[] = []
    let notifyCount = 0
    for (let i = 0; i < subCount; i++) {
      const a = getRowInfoAtomByRowId(`${i}`)
      unsubs.push(store.sub(a, () => { notifyCount++ }))
    }

    // 全量更新（模拟 dataSource 变化）
    const newData = generateFlatData(10000).map((d) => ({ ...d, name: d.name + '_v2' }))
    const elapsed = measure(`full update 10k rows (${subCount} subs)`, () => {
      store.setter(dataInitAtom, { dataSource: newData, rowHeight: 36 } as any)
    })

    console.log(`  notify count: ${notifyCount}`)

    unsubs.forEach((u) => u())
    expect(elapsed).toBeLessThan(2000)
  })

  test('局部更新：只改 1 行，其余不变', () => {
    const store = createStore()
    const dataSource = generateFlatData(10000)
    store.setter(dataInitAtom, { dataSource, rowHeight: 36 } as any)

    // 订阅 200 行
    const subCount = 200
    const unsubs: (() => void)[] = []
    let notifyCount = 0
    for (let i = 0; i < subCount; i++) {
      const a = getRowInfoAtomByRowId(`${i}`)
      unsubs.push(store.sub(a, () => { notifyCount++ }))
    }

    // 只改第 0 行，其余保持同一引用
    const prevMap = store.getter(rowInfoMapAtom)
    const nextMap = new Map(prevMap)
    nextMap.set('0', { id: 'row_0', name: 'CHANGED', value: 0 })

    const elapsed = measure('partial update (1 row changed)', () => {
      store.setter(rowInfoMapAtom, nextMap)
    })

    console.log(`  notify count: ${notifyCount} (expected ~1)`)

    unsubs.forEach((u) => u())
    expect(elapsed).toBeLessThan(500)
    // selectAtom 应该只通知引用变化的那 1 行
    expect(notifyCount).toBe(1)
  })
})

// ─── columnInitAtom 性能 ─────────────────────────────────
describe('columnInitAtom performance', () => {
  test.each([20, 50, 200])('%i columns init', (count) => {
    const store = createStore()
    const columns = generateColumns(count)

    const elapsed = measure(`columnInit ${count} cols`, () => {
      store.setter(columnInitAtom, columns)
    })
    expect(elapsed).toBeLessThan(500)
  })
})

// ─── 端到端：dataInit + columnInit + 读取 ────────────────
describe('end-to-end: init + read cycle', () => {
  test('10,000 rows × 20 cols — full init + 可见区域读取', () => {
    const store = createStore()
    const dataSource = generateFlatData(10000)
    const columns = generateColumns(20)
    console.log('  --- e2e 10,000×20 ---')

    const initTime = measure('dataInitAtom', () => {
      store.setter(dataInitAtom, { dataSource, rowHeight: 36, idProp: 'id' } as any)
    })

    const colTime = measure('columnInitAtom', () => {
      store.setter(columnInitAtom, columns)
    })

    // 模拟虚拟滚动：读取可见的 50 行
    const visibleStart = 500
    const visibleCount = 50
    const readTime = measure(`read ${visibleCount} visible rows`, () => {
      for (let i = visibleStart; i < visibleStart + visibleCount; i++) {
        store.getter(getRowInfoAtomByRowId(`${i}`))
      }
    })

    const totalTime = initTime + colTime + readTime
    console.log(`  total: ${totalTime.toFixed(2)}ms`)
  })

  test('100,000 rows × 50 cols — full init + 可见区域读取', () => {
    const store = createStore()
    const dataSource = generateFlatData(100000)
    const columns = generateColumns(50)
    console.log('  --- e2e 100,000×50 ---')

    const initTime = measure('dataInitAtom', () => {
      store.setter(dataInitAtom, { dataSource, rowHeight: 36, idProp: 'id' } as any)
    })

    const colTime = measure('columnInitAtom', () => {
      store.setter(columnInitAtom, columns)
    })

    // 模拟虚拟滚动：读取可见的 50 行
    const readTime = measure('read 50 visible rows', () => {
      for (let i = 0; i < 50; i++) {
        store.getter(getRowInfoAtomByRowId(`${i}`))
      }
    })

    const totalTime = initTime + colTime + readTime
    console.log(`  total: ${totalTime.toFixed(2)}ms`)
  })
})

// ─── 二次 dataInit（模拟数据刷新）─────────────────────────
describe('data refresh (second dataInit)', () => {
  test('10,000 rows: first init vs second init', () => {
    const store = createStore()
    const data1 = generateFlatData(10000)
    const data2 = generateFlatData(10000).map((d) => ({ ...d, name: d.name + '_v2' }))

    const first = measure('1st init', () => {
      store.setter(dataInitAtom, { dataSource: data1, rowHeight: 36 } as any)
    })

    const second = measure('2nd init (refresh)', () => {
      store.setter(dataInitAtom, { dataSource: data2, rowHeight: 36 } as any)
    })

    // 验证数据已更新
    const info = store.getter(getRowInfoAtomByRowId('0')) as Record<string, any> | null
    expect(info?.name).toBe('name_0_v2')

    console.log(`  diff: ${(second - first).toFixed(2)}ms`)
  })
})

// ─── columnInitAtom: 每列 2 次 setter 的开销 ──────────────
describe('columnInitAtom — per-column setter overhead', () => {
  test.each([20, 100, 500])('%i columns: 2 setters per column', (count) => {
    const store = createStore()
    const columns = generateColumns(count)

    const elapsed = measure(`columnInit ${count} cols`, () => {
      store.setter(columnInitAtom, columns)
    })

    // 500 列 = 1000 次 setter 应在合理范围内
    expect(elapsed).toBeLessThan(count > 200 ? 2000 : 500)
  })

  test('overhead breakdown: columnInit format vs atom setters (500 cols)', () => {
    const columns = generateColumns(500)
    console.log('  --- 500 columns overhead breakdown ---')

    // Step 1: 纯 format 计算（不涉及 atom）
    const formatTime = measure('columnInit format only', () => {
      const columnIdList: string[] = []
      const columnMap = new Map()
      columns.forEach((column) => {
        const columnId = column.key || ''
        columnIdList.push(columnId)
        columnMap.set(columnId, { ...column })
      })
    })

    // Step 2: 完整 columnInit（含 atom setter）
    const store = createStore()
    const fullTime = measure('columnInit full (500 cols)', () => {
      store.setter(columnInitAtom, columns)
    })

    const overhead = fullTime - formatTime
    console.log(
      `  atom setter overhead: ${overhead.toFixed(2)}ms (${((overhead / fullTime) * 100).toFixed(0)}%)`,
    )
  })
})

// ─── proportionalResizeColumn 计算开销 ────────────────────
describe('proportionalResize — column width computation', () => {
  test.each([50, 200, 500])('distributeByFlexGrow: %i columns', (count) => {
    const widths = Array.from({ length: count }, (_, i) => 80 + (i % 5) * 20)
    const flexGrows = Array.from({ length: count }, (_, i) => (i % 3 === 0 ? 0 : 1))
    const totalWidth = 1920

    const elapsed = measure(`distributeByFlexGrow ${count} cols × 100`, () => {
      for (let i = 0; i < 100; i++) {
        distributeByFlexGrow(widths, flexGrows, totalWidth)
      }
    })
    expect(elapsed).toBeLessThan(200)
  })

  test.each([50, 200, 500])('distributeColumnWidths: %i columns', (count) => {
    const columns = generateColumns(count).map((c, i) => ({
      ...c,
      // 一半有固定宽度，一半没有
      width: i % 2 === 0 ? 100 : undefined,
    }))

    const elapsed = measure(`distributeColumnWidths ${count} cols × 100`, () => {
      for (let i = 0; i < 100; i++) {
        distributeColumnWidths(columns, 1920, 25)
      }
    })
    expect(elapsed).toBeLessThan(200)
  })

  test('proportionalResize 中的多次遍历开销', () => {
    const count = 500
    const columnShowIdList = Array.from({ length: count }, (_, i) => `col_${i}`)
    const prevColumns = new Map(columnShowIdList.map((id) => [id, 100]))
    console.log('  --- 500 cols, 模拟 proportionalResize 内部 4 次遍历 ---')

    // 模拟 proportionalResizeColumnAtom 内部的 4 次遍历
    const elapsed = measure('4 passes × 500 cols × 100 repeats', () => {
      for (let rep = 0; rep < 100; rep++) {
        // pass 1: reduce currentTotalWidth
        columnShowIdList.reduce<number>((prev, tId) => prev + prevColumns.get(tId)!, 0)
        // pass 2: map flexGrowList
        columnShowIdList.map(() => 1)
        // pass 3: map initWidths
        columnShowIdList.map((tId) => prevColumns.get(tId)!)
        // pass 4: map currentWidths
        columnShowIdList.map((tId) => prevColumns.get(tId)!)
      }
    })
    expect(elapsed).toBeLessThan(200)
  })
})

// ─── headerDataInit: 逐行 setter ─────────────────────────
describe('headerDataInitAtom — per-row setter', () => {
  test.each([1, 5, 10, 20])('%i header rows', (count) => {
    const store = createStore()
    const headerData = Array.from({ length: count }, (_, i) => ({
      title: `Header ${i}`,
      key: `h_${i}`,
    }))

    const elapsed = measure(`headerDataInit ${count} rows`, () => {
      store.setter(headerDataInitAtom, headerData, { size: 40 })
    })
    expect(elapsed).toBeLessThan(100)
  })

  test('对比：逐行 setter vs 假设的 Map 批量 set (20 rows)', () => {
    const count = 20
    const headerData = Array.from({ length: count }, (_, i) => ({
      title: `Header ${i}`,
      key: `h_${i}`,
    }))
    console.log('  --- 20 header rows: setter vs Map ---')

    // 当前实现：逐行 setter
    const store1 = createStore()
    const setterTime = measure('per-row setter', () => {
      store1.setter(headerDataInitAtom, headerData, { size: 40 })
    })

    // 假设 Map 方案：收集到 Map 后一次 set
    const store2 = createStore()
    const mapTime = measure('Map batch (simulated)', () => {
      const map = new Map<string, Record<string, any>>()
      headerData.forEach((info, i) => {
        map.set(`head_row_${i}`, info)
      })
      // 模拟单次 atom set (用 headerRowIndexListAtom 代替)
      store2.setter(
        headerRowIndexListAtom,
        headerData.map((_, i) => `head_row_${i}`),
      )
    })

    console.log(
      `  per-row setter: ${setterTime.toFixed(2)}ms, Map batch: ${mapTime.toFixed(2)}ms`,
    )
  })
})
