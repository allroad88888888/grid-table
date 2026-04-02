import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  columnSizeMapAtom,
  rowSizeMapAtom,
  basicAtom,
  headerRowIndexListAtom,
} from '@grid-table/basic'
import { getCellId } from '../utils/getCellId'
import {
  areaStartAtom,
  areaEndAtom,
  areaCellIdsAtom,
  areaStartTypeAtom,
  areaEndTypeAtom,
} from '../plugins/areaSelected/state'

function measure(label: string, fn: () => void): number {
  const start = performance.now()
  fn()
  const elapsed = performance.now() - start
  console.log(`  ${label}: ${elapsed.toFixed(2)}ms`)
  return elapsed
}

function generateIds(prefix: string, count: number) {
  return Array.from({ length: count }, (_, i) => `${prefix}_${i}`)
}

function setupStore(rowCount: number, colCount: number) {
  const store = createStore()
  const rows = generateIds('r', rowCount)
  const cols = generateIds('c', colCount)

  store.setter(rowIndexListAtom, rows)
  store.setter(columnIndexListAtom, cols)
  store.setter(headerRowIndexListAtom, ['h_0'])
  store.setter(rowSizeMapAtom, new Map(rows.map((id) => [id, 36])))
  store.setter(columnSizeMapAtom, new Map(cols.map((id) => [id, 100])))

  // 触发 basicAtom 初始化
  store.getter(basicAtom)

  return { store, rows, cols }
}

// ─── getCellId 字符串生成 ────────────────────────────────
describe('getCellId generation performance', () => {
  test.each([
    [10, 10],
    [50, 50],
    [100, 100],
  ])('%ix%i cells — getCellId string generation', (rowCount, colCount) => {
    const rows = generateIds('r', rowCount)
    const cols = generateIds('c', colCount)
    const total = rowCount * colCount

    const elapsed = measure(`getCellId × ${total}`, () => {
      for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
          getCellId({ rowId: rows[r], columnId: cols[c] })
        }
      }
    })
    expect(elapsed).toBeLessThan(total > 5000 ? 100 : 50)
  })
})

// ─── areaCellIdsAtom 计算 ────────────────────────────────
describe('areaCellIdsAtom computation', () => {
  test('50x50 selection in 10k rows × 200 cols', () => {
    const { store, rows, cols } = setupStore(10_000, 200)

    // 选中第 100-149 行, 第 10-59 列
    store.setter(areaStartAtom, {
      rowId: rows[100],
      columnId: cols[10],
      cellId: getCellId({ rowId: rows[100], columnId: cols[10] }),
    })
    store.setter(areaEndAtom, {
      rowId: rows[149],
      columnId: cols[59],
      cellId: getCellId({ rowId: rows[149], columnId: cols[59] }),
    })
    store.setter(areaStartTypeAtom, 'tbody')
    store.setter(areaEndTypeAtom, 'tbody')

    const elapsed = measure('areaCellIdsAtom compute (50×50)', () => {
      const result = store.getter(areaCellIdsAtom)
      expect(result.cellTbodyList.length).toBe(50)
      expect(result.cellTbodyList[0].length).toBe(50)
    })
    expect(elapsed).toBeLessThan(200)
  })

  test('100x100 selection in 100k rows × 200 cols', () => {
    const { store, rows, cols } = setupStore(100_000, 200)

    store.setter(areaStartAtom, {
      rowId: rows[50_000],
      columnId: cols[50],
      cellId: getCellId({ rowId: rows[50_000], columnId: cols[50] }),
    })
    store.setter(areaEndAtom, {
      rowId: rows[50_099],
      columnId: cols[149],
      cellId: getCellId({ rowId: rows[50_099], columnId: cols[149] }),
    })
    store.setter(areaStartTypeAtom, 'tbody')
    store.setter(areaEndTypeAtom, 'tbody')

    const elapsed = measure('areaCellIdsAtom compute (100×100 in 100k)', () => {
      const result = store.getter(areaCellIdsAtom)
      expect(result.cellTbodyList.length).toBe(100)
      expect(result.cellTbodyList[0].length).toBe(100)
    })
    expect(elapsed).toBeLessThan(1000)
  })

  test('findIndexList 开销：在 100k 行中查找 start/end', () => {
    const { store, rows, cols } = setupStore(100_000, 200)

    // 选中靠近末尾的区域 — findIndexList 需要遍历更多
    store.setter(areaStartAtom, {
      rowId: rows[90_000],
      columnId: cols[0],
      cellId: getCellId({ rowId: rows[90_000], columnId: cols[0] }),
    })
    store.setter(areaEndAtom, {
      rowId: rows[90_010],
      columnId: cols[10],
      cellId: getCellId({ rowId: rows[90_010], columnId: cols[10] }),
    })
    store.setter(areaStartTypeAtom, 'tbody')
    store.setter(areaEndTypeAtom, 'tbody')

    const elapsed = measure('areaCellIdsAtom (tail position, 100k rows)', () => {
      const result = store.getter(areaCellIdsAtom)
      expect(result.cellTbodyList.length).toBe(11)
    })
    expect(elapsed).toBeLessThan(500)
  })
})

// ─── 逐 cell setter 开销 ────────────────────────────────
describe('per-cell store.setter overhead (areaSelected pattern)', () => {
  test.each([
    [10, 10],
    [50, 50],
    [100, 100],
  ])('%ix%i cells — store.setter per cell', (rowCount, colCount) => {
    const { store } = setupStore(rowCount * 2, colCount * 2)
    const basic = store.getter(basicAtom)
    const { getCellStateAtomById } = basic

    const total = rowCount * colCount
    const rows = generateIds('r', rowCount)
    const cols = generateIds('c', colCount)

    // 预生成 cellIds
    const cellIds: string[] = []
    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < colCount; c++) {
        cellIds.push(getCellId({ rowId: rows[r], columnId: cols[c] }))
      }
    }

    const cancelList: (() => void)[] = []
    const elapsed = measure(`setter × ${total} cells`, () => {
      cellIds.forEach((cellId) => {
        cancelList.push(
          store.setter(getCellStateAtomById(cellId), (_getter, prev) => {
            const nextClsx = new Set(prev.className)
            nextClsx.add('select-cell-item')
            return { ...prev, className: nextClsx }
          })!,
        )
      })
    })

    // cleanup
    cancelList.forEach((cancel) => cancel())

    expect(elapsed).toBeLessThan(total > 5000 ? 5000 : 2000)
  })

  test('开销拆解：getCellId 生成 vs setter 调用', () => {
    const rowCount = 50
    const colCount = 50
    const { store } = setupStore(rowCount * 2, colCount * 2)
    const basic = store.getter(basicAtom)
    const { getCellStateAtomById } = basic
    const rows = generateIds('r', rowCount)
    const cols = generateIds('c', colCount)

    console.log('  --- 2500 cells overhead breakdown ---')

    // Step 1: getCellId only
    const cellIds: string[] = []
    const genTime = measure('getCellId × 2500', () => {
      for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
          cellIds.push(getCellId({ rowId: rows[r], columnId: cols[c] }))
        }
      }
    })

    // Step 2: setter only (cellIds already generated)
    const cancelList: (() => void)[] = []
    const setterTime = measure('setter × 2500', () => {
      cellIds.forEach((cellId) => {
        cancelList.push(
          store.setter(getCellStateAtomById(cellId), (_getter, prev) => {
            const nextClsx = new Set(prev.className)
            nextClsx.add('select-cell-item')
            return { ...prev, className: nextClsx }
          })!,
        )
      })
    })

    cancelList.forEach((cancel) => cancel())

    console.log(
      `  getCellId: ${((genTime / (genTime + setterTime)) * 100).toFixed(0)}%, setter: ${((setterTime / (genTime + setterTime)) * 100).toFixed(0)}%`,
    )
  })
})
