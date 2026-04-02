import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/react'
import type { CSSProperties } from 'react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  columnSizeMapAtom,
  rowSizeMapAtom,
  basicAtom,
} from '@grid-table/basic'
import type { CellId } from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../../utils/getCellId'
import type { MergeCellIdItem } from '../types'
import { mergeCellStyleMapAtom } from '../state'

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
  store.setter(rowSizeMapAtom, new Map(rows.map((id) => [id, 36])))
  store.setter(columnSizeMapAtom, new Map(cols.map((id) => [id, 100])))
  const basic = store.getter(basicAtom)
  return { store, basic, rows, cols }
}

/**
 * 生成合并配置：从 startRow 开始，跨 mergeRows 行 × mergeCols 列
 */
function createMergeItem(
  startRow: number,
  startCol: number,
  mergeRows: number,
  mergeCols: number,
  rows: string[],
  cols: string[],
): MergeCellIdItem {
  return {
    cellId: getCellId({ rowId: rows[startRow], columnId: cols[startCol] }),
    rowIdList: rows.slice(startRow + 1, startRow + mergeRows),
    colIdList: cols.slice(startCol + 1, startCol + mergeCols),
  }
}

/**
 * 新方案：计算 Map 后一次 store.setter(mergeCellStyleMapAtom)
 */
function computeAndSetMap(
  store: ReturnType<typeof createStore>,
  cellList: MergeCellIdItem[],
  rows: string[],
  cols: string[],
  columnSizeMap: Map<string, number>,
  rowSizeMap: Map<string, number>,
) {
  const visibleRowSet = new Set(rows)
  const visibleColSet = new Set(cols)
  const styleMap = new Map<CellId, CSSProperties>()

  cellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
    const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)
    const mergedRowIds = [curRowId, ...rowIdList].filter((id) => visibleRowSet.has(id))
    const mergedColIds = [curColId, ...colIdList].filter((id) => visibleColSet.has(id))
    if (mergedRowIds.length === 0 || mergedColIds.length === 0) return

    const calculatedWidth = mergedColIds.reduce<number>(
      (prev, colId) => prev + (columnSizeMap.get(colId) || 0), 0,
    )
    const calculatedHeight = mergedRowIds.reduce<number>(
      (prev, rowId) => prev + (rowSizeMap.get(rowId) || 0), 0,
    )

    mergedRowIds.forEach((rowId) => {
      mergedColIds.forEach((colId) => {
        styleMap.set(
          getCellId({ rowId, columnId: colId }) as CellId,
          { width: calculatedWidth, height: calculatedHeight },
        )
      })
    })
  })

  store.setter(mergeCellStyleMapAtom, styleMap)
  return styleMap.size
}

/**
 * 旧方案：逐 cell store.setter(getCellStateAtomById)
 */
function setPerCell(
  store: ReturnType<typeof createStore>,
  getCellStateAtomById: (id: string) => any,
  cellList: MergeCellIdItem[],
  rows: string[],
  cols: string[],
  columnSizeMap: Map<string, number>,
  rowSizeMap: Map<string, number>,
) {
  const visibleRowSet = new Set(rows)
  const visibleColSet = new Set(cols)
  const clearList: (() => void)[] = []

  cellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
    const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)
    const mergedRowIds = [curRowId, ...rowIdList].filter((id) => visibleRowSet.has(id))
    const mergedColIds = [curColId, ...colIdList].filter((id) => visibleColSet.has(id))
    if (mergedRowIds.length === 0 || mergedColIds.length === 0) return

    const calculatedWidth = mergedColIds.reduce<number>(
      (prev, colId) => prev + (columnSizeMap.get(colId) || 0), 0,
    )
    const calculatedHeight = mergedRowIds.reduce<number>(
      (prev, rowId) => prev + (rowSizeMap.get(rowId) || 0), 0,
    )

    mergedRowIds.forEach((rowId) => {
      mergedColIds.forEach((colId) => {
        const tCellId = getCellId({ rowId, columnId: colId })
        clearList.push(
          store.setter(getCellStateAtomById(tCellId), (_getter: any, prev: any) => ({
            ...prev,
            style: { ...prev.style, width: calculatedWidth, height: calculatedHeight },
          }))!,
        )
      })
    })
  })

  return clearList
}

// ─── 正确性：mergeCellStyleMapAtom ─────────────────────
describe('mergeCellStyleMapAtom correctness', () => {
  test('单个合并组写入 Map', () => {
    const { store, rows, cols } = setupStore(10, 5)
    const columnSizeMap = store.getter(columnSizeMapAtom)
    const rowSizeMap = store.getter(rowSizeMapAtom)

    const cellList = [createMergeItem(0, 0, 3, 2, rows, cols)]
    const count = computeAndSetMap(store, cellList, rows, cols, columnSizeMap, rowSizeMap)

    expect(count).toBe(6) // 3 rows × 2 cols
    const map = store.getter(mergeCellStyleMapAtom)
    expect(map.size).toBe(6)

    // 锚 cell 样式
    const anchorStyle = map.get(getCellId({ rowId: rows[0], columnId: cols[0] }) as CellId)
    expect(anchorStyle?.width).toBe(200)
    expect(anchorStyle?.height).toBe(108)
  })

  test('cleanup 清空 Map', () => {
    const { store, rows, cols } = setupStore(10, 5)
    const columnSizeMap = store.getter(columnSizeMapAtom)
    const rowSizeMap = store.getter(rowSizeMapAtom)

    const cellList = [createMergeItem(0, 0, 3, 2, rows, cols)]
    computeAndSetMap(store, cellList, rows, cols, columnSizeMap, rowSizeMap)
    expect(store.getter(mergeCellStyleMapAtom).size).toBe(6)

    // cleanup
    store.setter(mergeCellStyleMapAtom, new Map())
    expect(store.getter(mergeCellStyleMapAtom).size).toBe(0)
  })

  test('多个合并组', () => {
    const { store, rows, cols } = setupStore(20, 10)
    const columnSizeMap = store.getter(columnSizeMapAtom)
    const rowSizeMap = store.getter(rowSizeMapAtom)

    const cellList = [
      createMergeItem(0, 0, 3, 2, rows, cols),
      createMergeItem(5, 3, 4, 3, rows, cols),
      createMergeItem(10, 7, 2, 2, rows, cols),
    ]
    const count = computeAndSetMap(store, cellList, rows, cols, columnSizeMap, rowSizeMap)
    expect(count).toBe(6 + 12 + 4) // 22
  })
})

// ─── 性能对比 ──────────────────────────────────────────
describe('performance: Map setter vs per-cell setter', () => {
  test('144 组 × 平均 50 行 × 1 列（模拟 PERF-ISSUE 场景缩小版）', () => {
    const rowCount = 10000
    const colCount = 43
    const { store, rows, cols } = setupStore(rowCount, colCount)
    const columnSizeMap = store.getter(columnSizeMapAtom)
    const rowSizeMap = store.getter(rowSizeMapAtom)

    // 144 个合并组，每个跨 50 行 × 1 列
    const cellList: MergeCellIdItem[] = []
    for (let i = 0; i < 144; i++) {
      const startRow = i * 60
      if (startRow + 50 > rowCount) break
      cellList.push(createMergeItem(startRow, i % colCount, 50, 1, rows, cols))
    }

    console.log(`  --- ${cellList.length} 组, 每组 50 行 × 1 列 ---`)

    // 新方案：Map
    const mapTime = measure('Map setter (1 call)', () => {
      computeAndSetMap(store, cellList, rows, cols, columnSizeMap, rowSizeMap)
    })

    // 旧方案：逐 cell setter
    const store2 = createStore()
    store2.setter(rowIndexListAtom, rows)
    store2.setter(columnIndexListAtom, cols)
    store2.setter(rowSizeMapAtom, new Map(rows.map((id) => [id, 36])))
    store2.setter(columnSizeMapAtom, new Map(cols.map((id) => [id, 100])))
    const basic2 = store2.getter(basicAtom)

    const perCellTime = measure('per-cell setter', () => {
      const clears = setPerCell(
        store2, basic2.getCellStateAtomById, cellList, rows, cols, columnSizeMap, rowSizeMap,
      )
      clears.forEach((c) => c())
    })

    const speedup = perCellTime / Math.max(mapTime, 0.01)
    console.log(`  speedup: ${speedup.toFixed(1)}x`)
    // Map 方案应该明显更快
    expect(mapTime).toBeLessThan(perCellTime)
  })

  test('大规模：100 组 × 8192 行 × 1 列（复现 PERF-ISSUE 实际数据量）', () => {
    const rowCount = 22000
    const colCount = 43
    const rows = generateIds('r', rowCount)
    const cols = generateIds('c', colCount)

    // 只测 Map 方案（旧方案太慢不跑了）
    const store = createStore()
    store.setter(rowIndexListAtom, rows)
    store.setter(columnIndexListAtom, cols)
    store.setter(rowSizeMapAtom, new Map(rows.map((id) => [id, 36])))
    store.setter(columnSizeMapAtom, new Map(cols.map((id) => [id, 100])))
    const columnSizeMap = store.getter(columnSizeMapAtom)
    const rowSizeMap = store.getter(rowSizeMapAtom)

    // 模拟实际场景：少量组但每组超大
    const cellList: MergeCellIdItem[] = []
    for (let i = 0; i < 3; i++) {
      cellList.push({
        cellId: getCellId({ rowId: rows[i * 8192], columnId: cols[0] }),
        rowIdList: rows.slice(i * 8192 + 1, (i + 1) * 8192),
        colIdList: [],
      })
    }
    const totalCells = cellList.reduce((s, c) => s + (c.rowIdList?.length || 0) + 1, 0)
    console.log(`  --- ${cellList.length} 组, 总 ${totalCells} cells ---`)

    const elapsed = measure('Map setter (huge merge groups)', () => {
      computeAndSetMap(store, cellList, rows, cols, columnSizeMap, rowSizeMap)
    })

    const map = store.getter(mergeCellStyleMapAtom)
    expect(map.size).toBe(totalCells)
    // 纯 Map.set 操作应该很快（< 100ms 即使 24k cells）
    expect(elapsed).toBeLessThan(500)
  })
})
