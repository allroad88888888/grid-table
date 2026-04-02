import { describe, test, expect } from '@jest/globals'
import { createStore, Store } from '@einfach/react'
import type { CSSProperties } from 'react'
import {
  columnIndexListAtom,
  headerRowIndexListAtom,
  columnSizeMapAtom,
  headerRowSizeMaAtom,
} from '@grid-table/basic'
import type { CellId } from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../../utils/getCellId'
import type { MergeCellIdItem } from '../types'

/**
 * 模拟 useHeaderMergeCells 的核心计算逻辑（与实际实现一致）
 * 直接测试算法正确性，不依赖 React 渲染
 */
function computeHeaderMergeStyles(
  store: Store,
  cellList: MergeCellIdItem[],
) {
  const rowIdShowList = store.getter(headerRowIndexListAtom) as string[]
  const columnIdShowList = store.getter(columnIndexListAtom) as string[]
  const columnSizeMap = store.getter(columnSizeMapAtom)
  const rowSizeMap = store.getter(headerRowSizeMaAtom)

  const visibleRowSet = new Set(rowIdShowList)
  const visibleColSet = new Set(columnIdShowList)
  const lastVisibleRowId = rowIdShowList[rowIdShowList.length - 1]
  const lastVisibleColId = columnIdShowList[columnIdShowList.length - 1]

  const styleMap = new Map<CellId, CSSProperties>()

  cellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
    const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)

    const mergedRowIds = [curRowId, ...rowIdList].filter((id) => visibleRowSet.has(id))
    const mergedColIds = [curColId, ...colIdList].filter((id) => visibleColSet.has(id))
    if (mergedRowIds.length === 0 || mergedColIds.length === 0) return

    const calculatedWidth = mergedColIds.reduce<number>(
      (prev, colId) => prev + (columnSizeMap.get(colId) || 0),
      0,
    )
    const calculatedHeight = mergedRowIds.reduce<number>(
      (prev, rowId) => prev + (rowSizeMap.get(rowId) || 0),
      0,
    )

    const hadColLast = lastVisibleRowId ? rowIdList.includes(lastVisibleRowId) : false
    const hadRowLast = lastVisibleColId ? colIdList.includes(lastVisibleColId) : false

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

        let next: CSSProperties
        if (rowIdList.length === 0 && colIdList.length === 0) {
          next = { display: 'none' }
        } else {
          next = {
            width: calculatedWidth,
            height: calculatedHeight,
          }

          if (hadColLast) next.borderBottomWidth = 0
          if (hadRowLast) next.borderRightWidth = 0

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
        }

        styleMap.set(tCellId as CellId, next)
      })
    })
  })

  return styleMap
}

function setupStore(opts: {
  rows: string[]
  columns: string[]
  rowHeight?: number
  colWidth?: number
}) {
  const { rows, columns, rowHeight = 40, colWidth = 100 } = opts
  const store = createStore()

  store.setter(headerRowIndexListAtom, rows)
  store.setter(columnIndexListAtom, columns)
  store.setter(
    headerRowSizeMaAtom,
    new Map(rows.map((id) => [id, rowHeight])),
  )
  store.setter(
    columnSizeMapAtom,
    new Map(columns.map((id) => [id, colWidth])),
  )

  return store
}

describe('headerMergeCells style computation', () => {
  test('2x2 merge: all cells get correct width/height', () => {
    const store = setupStore({
      rows: ['h0', 'h1', 'h2'],
      columns: ['c0', 'c1', 'c2'],
      rowHeight: 40,
      colWidth: 100,
    })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId,
        rowIdList: ['h1'],
        colIdList: ['c1'],
      },
    ]

    const styleMap = computeHeaderMergeStyles(store, cellList)

    // 4 cells in the 2x2 merge area
    expect(styleMap.size).toBe(4)

    // All cells get merged width (2 cols × 100) and height (2 rows × 40)
    const topLeft = styleMap.get(getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId)!
    expect(topLeft.width).toBe(200)
    expect(topLeft.height).toBe(80)
    expect(topLeft.transform).toBeUndefined() // no offset for top-left

    // Bottom-left: translateY offset
    const bottomLeft = styleMap.get(getCellId({ rowId: 'h1', columnId: 'c0' }) as CellId)!
    expect(bottomLeft.width).toBe(200)
    expect(bottomLeft.height).toBe(80)
    expect(bottomLeft.transform).toBe('translateY(-40px)')

    // Top-right: translateX offset
    const topRight = styleMap.get(getCellId({ rowId: 'h0', columnId: 'c1' }) as CellId)!
    expect(topRight.transform).toBe('translateX(-100px)')

    // Bottom-right: both offsets
    const bottomRight = styleMap.get(getCellId({ rowId: 'h1', columnId: 'c1' }) as CellId)!
    expect(bottomRight.transform).toBe('translateY(-40px) translateX(-100px)')
  })

  test('3x1 column merge: correct width, no row offset', () => {
    const store = setupStore({
      rows: ['h0'],
      columns: ['c0', 'c1', 'c2'],
      colWidth: 80,
    })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId,
        rowIdList: [],
        colIdList: ['c1', 'c2'],
      },
    ]

    const styleMap = computeHeaderMergeStyles(store, cellList)
    expect(styleMap.size).toBe(3)

    const first = styleMap.get(getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId)!
    expect(first.width).toBe(240) // 3 × 80
    expect(first.transform).toBeUndefined()

    const second = styleMap.get(getCellId({ rowId: 'h0', columnId: 'c1' }) as CellId)!
    expect(second.transform).toBe('translateX(-80px)')

    const third = styleMap.get(getCellId({ rowId: 'h0', columnId: 'c2' }) as CellId)!
    expect(third.transform).toBe('translateX(-160px)')
  })

  test('hidden rows/cols are excluded from merge', () => {
    const store = setupStore({
      rows: ['h0', 'h2'], // h1 is hidden (not in visible list)
      columns: ['c0', 'c2'], // c1 is hidden
      rowHeight: 40,
      colWidth: 100,
    })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId,
        rowIdList: ['h1', 'h2'], // h1 not visible
        colIdList: ['c1', 'c2'], // c1 not visible
      },
    ]

    const styleMap = computeHeaderMergeStyles(store, cellList)

    // Only visible cells: h0×c0, h0×c2, h2×c0, h2×c2 = 4 cells
    expect(styleMap.size).toBe(4)

    const topLeft = styleMap.get(getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId)!
    expect(topLeft.width).toBe(200) // 2 visible cols × 100
    expect(topLeft.height).toBe(80) // 2 visible rows × 40
  })

  test('empty cellList produces empty map', () => {
    const store = setupStore({
      rows: ['h0'],
      columns: ['c0'],
    })

    const styleMap = computeHeaderMergeStyles(store, [])
    expect(styleMap.size).toBe(0)
  })

  test('merge spanning last row/col removes borders', () => {
    const store = setupStore({
      rows: ['h0', 'h1'],
      columns: ['c0', 'c1'],
    })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId,
        rowIdList: ['h1'], // includes last visible row
        colIdList: ['c1'], // includes last visible col
      },
    ]

    const styleMap = computeHeaderMergeStyles(store, cellList)
    const topLeft = styleMap.get(getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId)!
    expect(topLeft.borderBottomWidth).toBe(0)
    expect(topLeft.borderRightWidth).toBe(0)
  })

  test('merge NOT spanning last row/col keeps borders', () => {
    const store = setupStore({
      rows: ['h0', 'h1', 'h2'],
      columns: ['c0', 'c1', 'c2'],
    })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId,
        rowIdList: ['h1'], // does NOT include last row h2
        colIdList: ['c1'], // does NOT include last col c2
      },
    ]

    const styleMap = computeHeaderMergeStyles(store, cellList)
    const topLeft = styleMap.get(getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId)!
    expect(topLeft.borderBottomWidth).toBeUndefined()
    expect(topLeft.borderRightWidth).toBeUndefined()
  })

  test('no rowIdList and no colIdList produces display:none', () => {
    const store = setupStore({
      rows: ['h0'],
      columns: ['c0'],
    })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId,
        rowIdList: [],
        colIdList: [],
      },
    ]

    const styleMap = computeHeaderMergeStyles(store, cellList)
    const style = styleMap.get(getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId)!
    expect(style.display).toBe('none')
  })
})

describe('headerMergeCells performance', () => {
  test('many merge groups computed efficiently', () => {
    const rowCount = 20
    const colCount = 50
    const rows = Array.from({ length: rowCount }, (_, i) => `h_${i}`)
    const cols = Array.from({ length: colCount }, (_, i) => `c_${i}`)

    const store = setupStore({ rows, columns: cols, rowHeight: 30, colWidth: 80 })

    // Create merge groups: every 2 rows × 2 cols
    const cellList: MergeCellIdItem[] = []
    for (let r = 0; r < rowCount - 1; r += 2) {
      for (let c = 0; c < colCount - 1; c += 2) {
        cellList.push({
          cellId: getCellId({ rowId: rows[r], columnId: cols[c] }) as CellId,
          rowIdList: [rows[r + 1]],
          colIdList: [cols[c + 1]],
        })
      }
    }

    const start = performance.now()
    const styleMap = computeHeaderMergeStyles(store, cellList)
    const elapsed = performance.now() - start

    console.log(`  headerMerge ${cellList.length} groups (${rowCount}×${colCount}): ${elapsed.toFixed(2)}ms`)

    // Each 2×2 group = 4 cells
    expect(styleMap.size).toBe(cellList.length * 4)
    expect(elapsed).toBeLessThan(200)
  })
})
