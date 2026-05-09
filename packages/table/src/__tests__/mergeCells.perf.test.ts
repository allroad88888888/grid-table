import { describe, test } from '@jest/globals'
import { createStore } from '@einfach/react'
import type { CSSProperties } from 'react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  columnIdShowListAtom,
  rowIdShowListAtom,
  columnSizeMapAtom,
  rowSizeMapAtom,
  basicAtom,
  headerRowIndexListAtom,
  headerRowSizeMapAtom,
} from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../utils/getCellId'
import type { MergeCellIdItem } from '../components/Cell/type'

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
  store.setter(headerRowIndexListAtom, rows.slice(0, Math.min(5, rowCount)))
  store.setter(rowSizeMapAtom, new Map(rows.map((id) => [id, 36])))
  store.setter(headerRowSizeMapAtom, new Map(rows.map((id) => [id, 40])))
  store.setter(columnSizeMapAtom, new Map(cols.map((id) => [id, 100])))
  const basic = store.getter(basicAtom)
  return { store, basic, rows, cols }
}

/**
 * 生成合并区域配置
 * @param startRow 起始行索引
 * @param startCol 起始列索引
 * @param mergeRows 合并行数
 * @param mergeCols 合并列数
 * @param rows 行 ID 数组
 * @param cols 列 ID 数组
 */
function createMergeItem(
  startRow: number,
  startCol: number,
  mergeRows: number,
  mergeCols: number,
  rows: string[],
  cols: string[],
): MergeCellIdItem {
  const cellId = getCellId({ rowId: rows[startRow], columnId: cols[startCol] })
  return {
    cellId,
    rowIdList: rows.slice(startRow + 1, startRow + mergeRows),
    colIdList: cols.slice(startCol + 1, startCol + mergeCols),
  }
}

// ─── 模拟 headerMergeCells (未优化版本) 的核心逻辑 ───────
function simulateHeaderMerge(
  cellList: MergeCellIdItem[],
  store: ReturnType<typeof createStore>,
  getAtomById: (id: string) => any,
  columnSizeMap: Map<string, number>,
  rowSizeMap: Map<string, number>,
) {
  const clearList: (() => void)[] = []

  cellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
    const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)

    // 未优化: getStyle 每次在 setter 回调里重新计算
    function getStyle(rowIndex: number, colIndex: number) {
      let next: CSSProperties = {}
      if (rowIdList.length === 0 && colIdList.length === 0) {
        next = { display: 'none' }
      } else {
        // 每次调用都创建新 Set — 这是 header 版本的问题
        const rowIdSet = new Set(store.getter(rowIdShowListAtom))
        const columnIdSet = new Set(store.getter(columnIdShowListAtom))

        next = {
          width: [curColId, ...colIdList]
            .filter((colId) => columnIdSet.has(colId))
            .reduce<number>((prev, colId) => prev + (columnSizeMap.get(colId) || 0), 0),
          height: [curRowId, ...rowIdList]
            .filter((rowId) => rowIdSet.has(rowId))
            .reduce<number>((prev, rowId) => prev + (rowSizeMap.get(rowId) || 0), 0),
        }

        // O(n^2) 的 slice/filter/reduce
        if (rowIndex) {
          const offset = [curRowId, ...rowIdList]
            .slice(0, rowIndex)
            .filter((rowId) => rowIdSet.has(rowId))
            .reduce<number>((prev, rowId) => prev + (rowSizeMap.get(rowId) || 0), 0)
          if (offset > 0) next.transform = `translateY(${-offset}px)`
        }
        if (colIndex) {
          const offset = [curColId, ...colIdList]
            .slice(0, colIndex)
            .filter((colId) => columnIdSet.has(colId))
            .reduce<number>((prev, colId) => prev + (columnSizeMap.get(colId) || 0), 0)
          if (offset > 0) next.transform = `translateX(${-offset}px)`
        }
      }
      return next
    }

    ;[curRowId, ...rowIdList].forEach((rowId, rowIndex) => {
      ;[curColId, ...colIdList].forEach((colId, colIndex) => {
        const tCellId = getCellId({ rowId, columnId: colId })
        clearList.push(
          store.setter(getAtomById(tCellId), (_getter: any, prev: any) => {
            const next = getStyle(rowIndex, colIndex)
            return { ...prev, style: { ...prev.style, ...next } }
          })!,
        )
      })
    })
  })

  return clearList
}

// ─── 模拟 body mergeCells (已优化版本) 的核心逻辑 ────────
function simulateBodyMerge(
  cellList: MergeCellIdItem[],
  store: ReturnType<typeof createStore>,
  getAtomById: (id: string) => any,
  columnSizeMap: Map<string, number>,
  rowSizeMap: Map<string, number>,
) {
  const clearList: (() => void)[] = []

  // 已优化: 预构建 Set，整个函数只算一次
  const visibleRowSet = new Set(store.getter(rowIdShowListAtom))
  const visibleColSet = new Set(store.getter(columnIdShowListAtom))

  cellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
    const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)

    const mergedRowIds = [curRowId, ...rowIdList].filter((id) => visibleRowSet.has(id))
    const mergedColIds = [curColId, ...colIdList].filter((id) => visibleColSet.has(id))
    if (mergedRowIds.length === 0 || mergedColIds.length === 0) return

    // 预计算宽高
    const calculatedWidth = mergedColIds.reduce<number>(
      (prev, colId) => prev + (columnSizeMap.get(colId) || 0),
      0,
    )
    const calculatedHeight = mergedRowIds.reduce<number>(
      (prev, rowId) => prev + (rowSizeMap.get(rowId) || 0),
      0,
    )

    // 预计算偏移量 Map
    let rowOffsetAcc = 0
    const rowOffsetMap = new Map<string, number>()
    mergedRowIds.forEach((rowId) => {
      rowOffsetMap.set(rowId, rowOffsetAcc)
      rowOffsetAcc += rowSizeMap.get(rowId) || 0
    })
    let colOffsetAcc = 0
    const colOffsetMap = new Map<string, number>()
    mergedColIds.forEach((colId) => {
      colOffsetMap.set(colId, colOffsetAcc)
      colOffsetAcc += columnSizeMap.get(colId) || 0
    })

    mergedRowIds.forEach((rowId, rowIndex) => {
      mergedColIds.forEach((colId, colIndex) => {
        const tCellId = getCellId({ rowId, columnId: colId })

        const next: CSSProperties = {
          width: calculatedWidth,
          height: calculatedHeight,
        }

        const transforms: string[] = []
        if (rowIndex) {
          const offset = rowOffsetMap.get(rowId) || 0
          if (offset > 0) transforms.push(`translateY(${-offset}px)`)
        }
        if (colIndex) {
          const offset = colOffsetMap.get(colId) || 0
          if (offset > 0) transforms.push(`translateX(${-offset}px)`)
        }
        if (transforms.length) next.transform = transforms.join(' ')

        clearList.push(
          store.setter(getAtomById(tCellId), (_getter: any, prev: any) => {
            return { ...prev, style: { ...prev.style, ...next } }
          })!,
        )
      })
    })
  })

  return clearList
}

// ─── Tests ──────────────────────────────────────────────

describe('merge cells — header (unoptimized) vs body (optimized)', () => {
  test('5 merge regions, 3×3 each (typical case)', () => {
    const { store, basic, rows, cols } = setupStore(50, 50)
    const { getCellStateAtomById } = basic
    const columnSizeMap = store.getter(columnSizeMapAtom)
    const rowSizeMap = store.getter(rowSizeMapAtom)

    const mergeItems = Array.from({ length: 5 }, (_, i) =>
      createMergeItem(i * 5, i * 5, 3, 3, rows, cols),
    )

    const headerTime = measure('header merge (unoptimized) 5×3×3', () => {
      const clears = simulateHeaderMerge(
        mergeItems,
        store,
        getCellStateAtomById,
        columnSizeMap,
        rowSizeMap,
      )
      clears.forEach((c) => c())
    })

    const bodyTime = measure('body merge   (optimized)   5×3×3', () => {
      const clears = simulateBodyMerge(
        mergeItems,
        store,
        getCellStateAtomById,
        columnSizeMap,
        rowSizeMap,
      )
      clears.forEach((c) => c())
    })

    if (headerTime > 0 && bodyTime > 0) {
      console.log(`  ratio: header/body = ${(headerTime / bodyTime).toFixed(1)}x`)
    }
  })

  test('20 merge regions, 5×5 each (stress)', () => {
    const { store, basic, rows, cols } = setupStore(200, 200)
    const { getCellStateAtomById } = basic
    const columnSizeMap = store.getter(columnSizeMapAtom)
    const rowSizeMap = store.getter(rowSizeMapAtom)

    const mergeItems = Array.from({ length: 20 }, (_, i) =>
      createMergeItem(i * 8, i * 8, 5, 5, rows, cols),
    )

    // 总 cell 数 = 20 × 5 × 5 = 500
    const headerTime = measure('header merge (unoptimized) 20×5×5', () => {
      const clears = simulateHeaderMerge(
        mergeItems,
        store,
        getCellStateAtomById,
        columnSizeMap,
        rowSizeMap,
      )
      clears.forEach((c) => c())
    })

    const bodyTime = measure('body merge   (optimized)   20×5×5', () => {
      const clears = simulateBodyMerge(
        mergeItems,
        store,
        getCellStateAtomById,
        columnSizeMap,
        rowSizeMap,
      )
      clears.forEach((c) => c())
    })

    if (headerTime > 0 && bodyTime > 0) {
      console.log(`  ratio: header/body = ${(headerTime / bodyTime).toFixed(1)}x`)
    }
  })

  test('10 merge regions, 10×10 each (large merge)', () => {
    const { store, basic, rows, cols } = setupStore(200, 200)
    const { getCellStateAtomById } = basic
    const columnSizeMap = store.getter(columnSizeMapAtom)
    const rowSizeMap = store.getter(rowSizeMapAtom)

    const mergeItems = Array.from({ length: 10 }, (_, i) =>
      createMergeItem(i * 15, i * 15, 10, 10, rows, cols),
    )

    // 总 cell 数 = 10 × 10 × 10 = 1000
    const headerTime = measure('header merge (unoptimized) 10×10×10', () => {
      const clears = simulateHeaderMerge(
        mergeItems,
        store,
        getCellStateAtomById,
        columnSizeMap,
        rowSizeMap,
      )
      clears.forEach((c) => c())
    })

    const bodyTime = measure('body merge   (optimized)   10×10×10', () => {
      const clears = simulateBodyMerge(
        mergeItems,
        store,
        getCellStateAtomById,
        columnSizeMap,
        rowSizeMap,
      )
      clears.forEach((c) => c())
    })

    if (headerTime > 0 && bodyTime > 0) {
      console.log(`  ratio: header/body = ${(headerTime / bodyTime).toFixed(1)}x`)
    }
  })
})

describe('header merge — Set creation overhead', () => {
  test('new Set() inside every setter callback vs pre-built', () => {
    const rows = generateIds('r', 10000)
    const cols = generateIds('c', 200)
    console.log('  --- Set creation: 10k rows + 200 cols ---')

    // 模拟 header 版本：每次 setter 回调都创建新 Set
    const insideTime = measure('new Set() × 500 calls (inside callback)', () => {
      for (let i = 0; i < 500; i++) {
        new Set(rows)
        new Set(cols)
      }
    })

    // 模拟 body 版本：预构建一次
    const outsideTime = measure('new Set() × 1 (pre-built) + 500 has()', () => {
      const rowSet = new Set(rows)
      const colSet = new Set(cols)
      for (let i = 0; i < 500; i++) {
        rowSet.has(rows[5000])
        colSet.has(cols[100])
      }
    })

    console.log(`  ratio: inside/outside = ${(insideTime / Math.max(outsideTime, 0.01)).toFixed(1)}x`)
  })
})

describe('header merge — O(n²) slice/filter/reduce', () => {
  test('slice(0, rowIndex).filter().reduce() with increasing index', () => {
    const mergeSize = 20
    const rows = generateIds('r', mergeSize)
    const rowSizeMap = new Map(rows.map((id) => [id, 36]))
    const rowIdSet = new Set(rows)

    console.log('  --- O(n²): slice/filter/reduce per cell row in 20-row merge ---')

    // header 版本: 每个 cell 都 slice/filter/reduce
    const headerTime = measure('header pattern (slice/filter/reduce)', () => {
      for (let rep = 0; rep < 100; rep++) {
        for (let rowIndex = 0; rowIndex < mergeSize; rowIndex++) {
          rows
            .slice(0, rowIndex)
            .filter((rowId) => rowIdSet.has(rowId))
            .reduce<number>((prev, rowId) => prev + (rowSizeMap.get(rowId) || 0), 0)
        }
      }
    })

    // body 版本: 预计算 offset map
    const bodyTime = measure('body pattern   (pre-computed offset)', () => {
      for (let rep = 0; rep < 100; rep++) {
        let acc = 0
        const offsetMap = new Map<string, number>()
        rows.forEach((rowId) => {
          offsetMap.set(rowId, acc)
          acc += rowSizeMap.get(rowId) || 0
        })
        for (let rowIndex = 0; rowIndex < mergeSize; rowIndex++) {
          offsetMap.get(rows[rowIndex])
        }
      }
    })

    console.log(`  ratio: header/body = ${(headerTime / Math.max(bodyTime, 0.01)).toFixed(1)}x`)
  })
})
