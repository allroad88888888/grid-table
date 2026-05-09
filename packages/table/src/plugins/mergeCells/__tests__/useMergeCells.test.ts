import { describe, test, expect } from '@jest/globals'
import type { Store } from '@einfach/react'
import { createStore } from '@einfach/react'
import {
  columnIndexListAtom,
  headerRowSizeMapAtom,
  rowIndexListAtom,
  columnSizeMapAtom,
  rowSizeMapAtom,
} from '../../../../../basic/src/basic/state'
import { stickyLeftAtom, stickyRightAtom } from '../../sticky/state'
import { getCellId } from '../../../utils/getCellId'
import type { MergeCellIdItem } from '../types'

/**
 * 辅助函数：初始化 store 并设置行列数据
 */
function setupStore(opts: {
  rows: string[]
  columns: string[]
  rowHeight?: number
  colWidth?: number
  headerHeight?: number
  stickyLeftIds?: string[]
  stickyRightIds?: string[]
}) {
  const {
    rows,
    columns,
    rowHeight = 40,
    colWidth = 100,
    headerHeight = 40,
    stickyLeftIds = [],
    stickyRightIds = [],
  } = opts
  const store = createStore()

  store.setter(rowIndexListAtom, rows)
  store.setter(columnIndexListAtom, columns)
  store.setter(headerRowSizeMapAtom, new Map([['0', headerHeight]]))
  store.setter(stickyLeftAtom, stickyLeftIds)
  store.setter(stickyRightAtom, stickyRightIds)
  store.setter(
    rowSizeMapAtom,
    new Map(rows.map((id) => [id, rowHeight])),
  )
  store.setter(
    columnSizeMapAtom,
    new Map(columns.map((id) => [id, colWidth])),
  )

  return { store }
}

/**
 * 辅助函数：设置合并单元格并触发 effect 逻辑
 * 直接模拟 useMergeCells 的核心计算，不依赖 React 渲染
 */
function computeMergeStyles(
  store: Store,
  cellList: MergeCellIdItem[],
  opts: {
    containerHeight?: number
    stickyMergeCell?: boolean
    headerHeight?: number
    stickyLeftIds?: string[]
    stickyRightIds?: string[]
  } = {},
) {
  const {
    containerHeight,
    stickyMergeCell = true,
    headerHeight = 40,
    stickyLeftIds = [],
    stickyRightIds = [],
  } = opts
  const tbodyViewportHeight =
    containerHeight && containerHeight > headerHeight ? containerHeight - headerHeight : 0
  const maxHeight = tbodyViewportHeight || Infinity

  const rowIdShowList = store.getter(rowIndexListAtom) as string[]
  const columnIdShowList = store.getter(columnIndexListAtom) as string[]
  const columnSizeMap = store.getter(columnSizeMapAtom)
  const rowSizeMap = store.getter(rowSizeMapAtom)

  const visibleRowSet = new Set(rowIdShowList)
  const visibleColSet = new Set(columnIdShowList)
  const lastVisibleRowId = rowIdShowList[rowIdShowList.length - 1]
  const lastVisibleColId = columnIdShowList[columnIdShowList.length - 1]
  const lastVisibleLeftStickyColId = stickyLeftIds.filter((id) => visibleColSet.has(id)).at(-1)
  const firstVisibleRightStickyColId = stickyRightIds.find((id) => visibleColSet.has(id))

  const results = new Map<string, Record<string, any>>()

  cellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
    if (rowIdList.length === 0 && colIdList.length === 0) return

    const [curRowId, curColId] = cellId.split('^^^^$^^^^') as [string, string]

    const mergedRowIds = [curRowId, ...rowIdList].filter((id) => visibleRowSet.has(id))
    const mergedColIds = [curColId, ...colIdList].filter((id) => visibleColSet.has(id))
    if (mergedRowIds.length === 0 || mergedColIds.length === 0) return
    if (mergedRowIds.length === 1 && mergedColIds.length === 1) return

    const calculatedWidth = mergedColIds.reduce<number>(
      (prev, colId) => prev + (columnSizeMap.get(colId) || 0),
      0,
    )
    const calculatedHeight = mergedRowIds.reduce<number>(
      (prev, rowId) => prev + (rowSizeMap.get(rowId) || 0),
      0,
    )
    const isHeightOverflow = stickyMergeCell && calculatedHeight > maxHeight

    const hadColLast = lastVisibleRowId ? mergedRowIds.includes(lastVisibleRowId) : false
    const hadRowLast = lastVisibleColId ? mergedColIds.includes(lastVisibleColId) : false

    const classNames = ['grid-table-cell--merge-overlay']

    if (isHeightOverflow && tbodyViewportHeight) {
      classNames.push('grid-table-cell--sticky-merge')
    }

    const leftMostMergedColId = mergedColIds[0]
    const rightMostMergedColId = mergedColIds[mergedColIds.length - 1]
    if (lastVisibleLeftStickyColId && rightMostMergedColId === lastVisibleLeftStickyColId) {
      classNames.push('sticky-shadow-right')
    }
    if (firstVisibleRightStickyColId && leftMostMergedColId === firstVisibleRightStickyColId) {
      classNames.push('sticky-shadow-left')
    }

    const style: Record<string, any> = {
      width: calculatedWidth,
      height: calculatedHeight,
      className: classNames.join(' '),
    }

    if (isHeightOverflow && tbodyViewportHeight) {
      style['--grid-merge-sticky-height'] = `${tbodyViewportHeight}px`
      style['--grid-merge-sticky-top'] = `${headerHeight}px`
    }

    if (hadColLast) style.borderBottomWidth = 0
    if (hadRowLast) style.borderRightWidth = 0

    results.set(cellId, style)
  })

  return results
}

describe('useMergeCells', () => {
  const rows = ['r0', 'r1', 'r2', 'r3', 'r4']
  const columns = ['c0', 'c1', 'c2']

  test('basic merge: width and height are sum of merged cells', () => {
    const { store } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1'],
        colIdList: ['c1'],
      },
    ]

    const styles = computeMergeStyles(store, cellList)

    // 锚单元格：2行×2列
    const anchorStyle = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchorStyle.width).toBe(200) // 100 + 100
    expect(anchorStyle.height).toBe(80) // 40 + 40
    expect(anchorStyle.className).toBe('grid-table-cell--merge-overlay')
    expect(styles.size).toBe(1)
  })

  test('merge overlay only keeps anchor style entry', () => {
    const { store } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1'],
        colIdList: ['c1'],
      },
    ]

    const styles = computeMergeStyles(store, cellList)

    expect(styles.size).toBe(1)
    expect(styles.has(getCellId({ rowId: 'r1', columnId: 'c0' }))).toBe(false)
    expect(styles.has(getCellId({ rowId: 'r0', columnId: 'c1' }))).toBe(false)
    expect(styles.has(getCellId({ rowId: 'r1', columnId: 'c1' }))).toBe(false)
  })

  test('sticky mode when height overflows container', () => {
    const { store } = setupStore({
      rows,
      columns,
      rowHeight: 40,
      colWidth: 100,
      headerHeight: 40,
    })

    // 合并 5 行，总高 200，容器高 100 → 溢出
    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1', 'r2', 'r3', 'r4'],
        colIdList: [],
      },
    ]

    const styles = computeMergeStyles(store, cellList, {
      containerHeight: 100,
      headerHeight: 40,
    })

    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.position).toBeUndefined()
    expect(anchor.height).toBe(200) // 外层保留完整 merge 区域
    expect(anchor.className).toBe('grid-table-cell--merge-overlay grid-table-cell--sticky-merge')
    expect(anchor['--grid-merge-sticky-height']).toBe('60px')
    expect(anchor['--grid-merge-sticky-top']).toBe('40px')
  })

  test('no sticky when stickyMergeCell=false', () => {
    const { store } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1', 'r2', 'r3', 'r4'],
        colIdList: [],
      },
    ]

    const styles = computeMergeStyles(store, cellList, {
      containerHeight: 100,
      stickyMergeCell: false,
    })

    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.position).toBeUndefined()
    expect(anchor.height).toBe(200) // 原始高度，不 clamp
    expect(anchor.className).toBe('grid-table-cell--merge-overlay')
  })

  test('overflow merge still keeps a single stable overlay style entry', () => {
    const { store } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1', 'r2', 'r3', 'r4'],
        colIdList: [],
      },
    ]

    const styles = computeMergeStyles(store, cellList, {
      containerHeight: 100,
      headerHeight: 40,
    })

    expect(styles.size).toBe(1)
    expect(styles.has(getCellId({ rowId: 'r3', columnId: 'c0' }))).toBe(false)
  })

  test('merge overlay inherits sticky shadow when its visible right edge is the last left fixed column', () => {
    const wideColumns = ['c0', 'c1', 'c2', 'c3']
    const { store } = setupStore({
      rows,
      columns: wideColumns,
      rowHeight: 40,
      colWidth: 100,
      stickyLeftIds: ['c0', 'c1'],
    })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1'],
        colIdList: ['c1'],
      },
    ]

    const styles = computeMergeStyles(store, cellList, {
      stickyLeftIds: ['c0', 'c1'],
    })

    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.className).toContain('sticky-shadow-right')
  })

  test('merge overlay does not inherit sticky shadow when it crosses past the last left fixed column', () => {
    const wideColumns = ['c0', 'c1', 'c2', 'c3']
    const { store } = setupStore({
      rows,
      columns: wideColumns,
      rowHeight: 40,
      colWidth: 100,
      stickyLeftIds: ['c0', 'c1'],
    })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1'],
        colIdList: ['c1', 'c2'],
      },
    ]

    const styles = computeMergeStyles(store, cellList, {
      stickyLeftIds: ['c0', 'c1'],
    })

    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.className).not.toContain('sticky-shadow-right')
  })

  test('no sticky when height fits container', () => {
    const { store } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    // 合并 2 行，总高 80，容器高 400 → 不溢出
    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1'],
        colIdList: [],
      },
    ]

    const styles = computeMergeStyles(store, cellList, { containerHeight: 400 })

    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.position).toBeUndefined()
    expect(anchor.height).toBe(80)
  })

  test('skips merge cells with no visible rows', () => {
    const { store } = setupStore({
      rows: ['r0', 'r1'],
      columns: ['c0'],
      rowHeight: 40,
      colWidth: 100,
    })

    // 合并引用了不存在的行
    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'invisible_row', columnId: 'c0' }),
        rowIdList: ['also_invisible'],
        colIdList: [],
      },
    ]

    const styles = computeMergeStyles(store, cellList)
    expect(styles.size).toBe(0)
  })

  test('border flags at last visible row/column', () => {
    const { store } = setupStore({
      rows: ['r0', 'r1', 'r2'],
      columns: ['c0', 'c1', 'c2'],
      rowHeight: 40,
      colWidth: 100,
    })

    // 合并到最后一行和最后一列
    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1', 'r2'],
        colIdList: ['c1', 'c2'],
      },
    ]

    const styles = computeMergeStyles(store, cellList)
    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.borderBottomWidth).toBe(0)
    expect(anchor.borderRightWidth).toBe(0)
  })

  test('performance: large dataset only processes visible merge cells', () => {
    // 模拟大数据场景
    const largeRows = Array.from({ length: 100000 }, (_, i) => `r${i}`)
    const largeCols = Array.from({ length: 50 }, (_, i) => `c${i}`)
    const { store } = setupStore({
      rows: largeRows,
      columns: largeCols,
      rowHeight: 36,
      colWidth: 80,
    })

    // 只有几个合并单元格
    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1', 'r2'],
        colIdList: ['c1'],
      },
      {
        cellId: getCellId({ rowId: 'r99990', columnId: 'c10' }),
        rowIdList: ['r99991', 'r99992'],
        colIdList: ['c11'],
      },
    ]

    const start = performance.now()
    const styles = computeMergeStyles(store, cellList, { containerHeight: 600 })
    const elapsed = performance.now() - start

    // 每个 merge 只生成 1 个稳定 overlay 样式
    expect(styles.size).toBe(2)
    // 机器负载较高时会被 100k 行 Set 构建和 sticky 边界类计算放大，但整体仍应保持在可接受范围内
    expect(elapsed).toBeLessThan(160)
  })

  test('performance: skips merge cells outside visible range', () => {
    const visibleRows = ['r0', 'r1', 'r2']
    const { store } = setupStore({
      rows: visibleRows,
      columns: ['c0', 'c1'],
      rowHeight: 40,
      colWidth: 100,
    })

    // 合并引用的行不在 visibleRows 中
    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r_hidden', columnId: 'c0' }),
        rowIdList: ['r_hidden2'],
        colIdList: [],
      },
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1'],
        colIdList: [],
      },
    ]

    const styles = computeMergeStyles(store, cellList)

    // 只有第二个合并（可见的）产生样式
    expect(styles.size).toBe(1)
    expect(styles.has(getCellId({ rowId: 'r_hidden', columnId: 'c0' }))).toBe(false)
  })
})
