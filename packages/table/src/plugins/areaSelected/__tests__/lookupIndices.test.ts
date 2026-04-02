import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  columnSizeMapAtom,
  rowSizeMapAtom,
  headerRowIndexListAtom,
} from '@grid-table/basic'
import { getCellId } from '../../../utils/getCellId'
import {
  areaStartAtom,
  areaEndAtom,
  areaCellIdsAtom,
  areaColumnIdsAtom,
  areaStartTypeAtom,
  areaEndTypeAtom,
} from '../state'

function generateIds(prefix: string, count: number) {
  return Array.from({ length: count }, (_, i) => `${prefix}_${i}`)
}

function setupStore(rowCount: number, colCount: number, theadCount = 1) {
  const store = createStore()
  const rows = generateIds('r', rowCount)
  const cols = generateIds('c', colCount)
  const theadRows = generateIds('h', theadCount)

  store.setter(rowIndexListAtom, rows)
  store.setter(columnIndexListAtom, cols)
  store.setter(headerRowIndexListAtom, theadRows)
  store.setter(rowSizeMapAtom, new Map(rows.map((id) => [id, 36])))
  store.setter(columnSizeMapAtom, new Map(cols.map((id) => [id, 100])))

  return { store, rows, cols, theadRows }
}

function setSelection(
  store: ReturnType<typeof createStore>,
  startRowId: string,
  startColId: string,
  endRowId: string,
  endColId: string,
  startType: 'thead' | 'tbody' = 'tbody',
  endType?: 'thead' | 'tbody',
) {
  store.setter(areaStartAtom, {
    rowId: startRowId,
    columnId: startColId,
    cellId: getCellId({ rowId: startRowId, columnId: startColId }),
  })
  store.setter(areaEndAtom, {
    rowId: endRowId,
    columnId: endColId,
    cellId: getCellId({ rowId: endRowId, columnId: endColId }),
  })
  store.setter(areaStartTypeAtom, startType)
  store.setter(areaEndTypeAtom, endType || startType)
}

// ─── areaCellIdsAtom 正确性（使用新的 lookupIndices）────
describe('areaCellIdsAtom — correctness with lookupIndices', () => {
  test('单 cell 选中', () => {
    const { store, rows, cols } = setupStore(100, 20)
    setSelection(store, rows[5], cols[3], rows[5], cols[3])

    const result = store.getter(areaCellIdsAtom)
    expect(result.cellTbodyList.length).toBe(1)
    expect(result.cellTbodyList[0].length).toBe(1)
    expect(result.cellTbodyList[0][0]).toBe(getCellId({ rowId: rows[5], columnId: cols[3] }))
  })

  test('矩形区域选中 3×4', () => {
    const { store, rows, cols } = setupStore(100, 20)
    setSelection(store, rows[10], cols[2], rows[12], cols[5])

    const result = store.getter(areaCellIdsAtom)
    expect(result.cellTbodyList.length).toBe(3) // row 10,11,12
    expect(result.cellTbodyList[0].length).toBe(4) // col 2,3,4,5
    // 验证角点
    expect(result.cellTbodyList[0][0]).toBe(getCellId({ rowId: rows[10], columnId: cols[2] }))
    expect(result.cellTbodyList[2][3]).toBe(getCellId({ rowId: rows[12], columnId: cols[5] }))
  })

  test('反向选择（end 在 start 前面）', () => {
    const { store, rows, cols } = setupStore(100, 20)
    // 从右下角拖到左上角
    setSelection(store, rows[15], cols[8], rows[10], cols[3])

    const result = store.getter(areaCellIdsAtom)
    expect(result.cellTbodyList.length).toBe(6) // row 10-15
    expect(result.cellTbodyList[0].length).toBe(6) // col 3-8
  })

  test('选中尾部区域（大列表末尾）', () => {
    const { store, rows, cols } = setupStore(10000, 200)
    setSelection(store, rows[9990], cols[195], rows[9999], cols[199])

    const result = store.getter(areaCellIdsAtom)
    expect(result.cellTbodyList.length).toBe(10)
    expect(result.cellTbodyList[0].length).toBe(5)
  })

  test('无选区返回空', () => {
    const { store } = setupStore(100, 20)
    const result = store.getter(areaCellIdsAtom)
    expect(result.cellTbodyList).toEqual([])
    expect(result.cellTheadList).toEqual([])
  })

  test('thead 区域选中', () => {
    const { store, cols, theadRows } = setupStore(100, 20, 3)
    setSelection(store, theadRows[0], cols[2], theadRows[2], cols[5], 'thead', 'thead')

    const result = store.getter(areaCellIdsAtom)
    expect(result.cellTheadList.length).toBe(3)
    expect(result.cellTheadList[0].length).toBe(4)
    expect(result.cellTbodyList).toEqual([])
  })

  test('跨 thead + tbody 选中', () => {
    const { store, rows, cols, theadRows } = setupStore(100, 20, 2)
    // 从 thead 第一行选到 tbody 第二行
    setSelection(store, theadRows[0], cols[0], rows[1], cols[3], 'thead', 'tbody')

    const result = store.getter(areaCellIdsAtom)
    expect(result.cellTheadList.length).toBe(2) // thead 0,1
    expect(result.cellTbodyList.length).toBe(2) // tbody 0,1
    expect(result.cellTheadList[0].length).toBe(4)
    expect(result.cellTbodyList[0].length).toBe(4)
  })
})

// ─── areaColumnIdsAtom 正确性 ───────────────────────────
describe('areaColumnIdsAtom — correctness with lookupIndices', () => {
  test('返回选中范围内的列 ID', () => {
    const { store, rows, cols } = setupStore(100, 20)
    setSelection(store, rows[0], cols[5], rows[10], cols[8])

    const columnIds = store.getter(areaColumnIdsAtom)
    expect(columnIds).toEqual([cols[5], cols[6], cols[7], cols[8]])
  })

  test('无选区返回空数组', () => {
    const { store } = setupStore(100, 20)
    const columnIds = store.getter(areaColumnIdsAtom)
    expect(columnIds).toEqual([])
  })
})

// ─── perf 对比 ──────────────────────────────────────────
describe('lookupIndices perf — Map vs old linear', () => {
  test('100k rows 尾部查找 — areaCellIdsAtom', () => {
    const { store, rows, cols } = setupStore(100_000, 200)

    setSelection(store, rows[90_000], cols[0], rows[90_010], cols[10])

    const start = performance.now()
    const result = store.getter(areaCellIdsAtom)
    const elapsed = performance.now() - start

    console.log(`  areaCellIdsAtom (100k, tail): ${elapsed.toFixed(2)}ms`)
    expect(result.cellTbodyList.length).toBe(11)
    expect(result.cellTbodyList[0].length).toBe(11)
    // 之前 findIndexList 在 100k 行尾部查找要 7.5ms，现在应该快很多
    expect(elapsed).toBeLessThan(200)
  })

  test('选区变更 100 次（模拟拖拽）', () => {
    const { store, rows, cols } = setupStore(100_000, 200)

    store.setter(areaStartAtom, {
      rowId: rows[50_000],
      columnId: cols[50],
      cellId: getCellId({ rowId: rows[50_000], columnId: cols[50] }),
    })
    store.setter(areaStartTypeAtom, 'tbody')

    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      const endRow = rows[50_000 + i * 100]
      const endCol = cols[50 + (i % 50)]
      store.setter(areaEndAtom, {
        rowId: endRow,
        columnId: endCol,
        cellId: getCellId({ rowId: endRow, columnId: endCol }),
      })
      store.setter(areaEndTypeAtom, 'tbody')
      store.getter(areaCellIdsAtom)
    }
    const elapsed = performance.now() - start
    console.log(`  100 drag updates (100k rows): ${elapsed.toFixed(2)}ms`)
    expect(elapsed).toBeLessThan(5000)
  })
})
