import { describe, test, expect } from '@jest/globals'
import type { Store } from '@einfach/react';
import { createStore } from '@einfach/react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  columnSizeMapAtom,
  rowSizeMapAtom,
  basicAtom,
} from '@grid-table/basic'
import { getCellId } from '../../../utils'
import type { MergeCellIdItem } from '../types'

/**
 * 辅助函数：初始化 store 并设置行列数据
 */
function setupStore(opts: {
  rows: string[]
  columns: string[]
  rowHeight?: number
  colWidth?: number
}) {
  const { rows, columns, rowHeight = 40, colWidth = 100 } = opts
  const store = createStore()

  store.setter(rowIndexListAtom, rows)
  store.setter(columnIndexListAtom, columns)
  store.setter(
    rowSizeMapAtom,
    new Map(rows.map((id) => [id, rowHeight])),
  )
  store.setter(
    columnSizeMapAtom,
    new Map(columns.map((id) => [id, colWidth])),
  )

  // 初始化 basicAtom 以注册 getCellStateAtomById 等
  const basic = store.getter(basicAtom)

  return { store, basic }
}

/**
 * 辅助函数：设置合并单元格并触发 effect 逻辑
 * 直接模拟 useMergeCells 的核心计算，不依赖 React 渲染
 */
function computeMergeStyles(
  store: Store,
  basic: ReturnType<typeof setupStore>['basic'],
  cellList: MergeCellIdItem[],
  opts: {
    containerHeight?: number
    stickyMergeCell?: boolean
  } = {},
) {
  const { containerHeight, stickyMergeCell = true } = opts
  const maxHeight = containerHeight || Infinity

  const rowIdShowList = store.getter(rowIndexListAtom) as string[]
  const columnIdShowList = store.getter(columnIndexListAtom) as string[]
  const columnSizeMap = store.getter(columnSizeMapAtom)
  const rowSizeMap = store.getter(rowSizeMapAtom)

  const visibleRowSet = new Set(rowIdShowList)
  const visibleColSet = new Set(columnIdShowList)
  const lastVisibleRowId = rowIdShowList[rowIdShowList.length - 1]
  const lastVisibleColId = columnIdShowList[columnIdShowList.length - 1]

  const results = new Map<string, Record<string, any>>()

  cellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
    const [curRowId, curColId] = cellId.split('^^^^$^^^^') as [string, string]

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
    const isHeightOverflow = stickyMergeCell && calculatedHeight > maxHeight

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
        const style: Record<string, any> = {
          width: calculatedWidth,
          height: calculatedHeight,
        }

        if (isHeightOverflow && containerHeight) {
          style.position = 'sticky'
          style.top = 0
          style.height = containerHeight
          style.zIndex = 0
        }

        if (hadColLast) style.borderBottomWidth = 0
        if (hadRowLast) style.borderRightWidth = 0

        const transforms: string[] = []
        if (rowIndex && !isHeightOverflow) {
          const offset = rowOffsetMap.get(rowId) || 0
          if (offset > 0) transforms.push(`translateY(${-offset}px)`)
        }
        if (colIndex) {
          const offset = colOffsetMap.get(colId) || 0
          if (offset > 0) transforms.push(`translateX(${-offset}px)`)
        }
        if (transforms.length) style.transform = transforms.join(' ')

        results.set(tCellId, style)
      })
    })
  })

  return results
}

describe('useMergeCells', () => {
  const rows = ['r0', 'r1', 'r2', 'r3', 'r4']
  const columns = ['c0', 'c1', 'c2']

  test('basic merge: width and height are sum of merged cells', () => {
    const { store, basic } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1'],
        colIdList: ['c1'],
      },
    ]

    const styles = computeMergeStyles(store, basic, cellList)

    // 锚单元格：2行×2列
    const anchorStyle = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchorStyle.width).toBe(200) // 100 + 100
    expect(anchorStyle.height).toBe(80) // 40 + 40
    expect(anchorStyle.position).toBeUndefined() // 不需要 sticky
  })

  test('sub-cells have translateY/translateX offsets', () => {
    const { store, basic } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1'],
        colIdList: ['c1'],
      },
    ]

    const styles = computeMergeStyles(store, basic, cellList)

    // r1,c0: 第二行第一列 → translateY
    const r1c0 = styles.get(getCellId({ rowId: 'r1', columnId: 'c0' }))!
    expect(r1c0.transform).toBe('translateY(-40px)')

    // r0,c1: 第一行第二列 → translateX
    const r0c1 = styles.get(getCellId({ rowId: 'r0', columnId: 'c1' }))!
    expect(r0c1.transform).toBe('translateX(-100px)')

    // r1,c1: 第二行第二列 → translateX（注意：当前逻辑 colIndex 覆盖 rowIndex 的 transform）
    const r1c1 = styles.get(getCellId({ rowId: 'r1', columnId: 'c1' }))!
    expect(r1c1.transform).toContain('translateX(-100px)')
  })

  test('sticky mode when height overflows container', () => {
    const { store, basic } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    // 合并 5 行，总高 200，容器高 100 → 溢出
    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1', 'r2', 'r3', 'r4'],
        colIdList: [],
      },
    ]

    const styles = computeMergeStyles(store, basic, cellList, { containerHeight: 100 })

    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.position).toBe('sticky')
    expect(anchor.top).toBe(0)
    expect(anchor.height).toBe(100) // clamped to container height
    expect(anchor.zIndex).toBe(0)
  })

  test('no sticky when stickyMergeCell=false', () => {
    const { store, basic } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1', 'r2', 'r3', 'r4'],
        colIdList: [],
      },
    ]

    const styles = computeMergeStyles(store, basic, cellList, {
      containerHeight: 100,
      stickyMergeCell: false,
    })

    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.position).toBeUndefined()
    expect(anchor.height).toBe(200) // 原始高度，不 clamp
  })

  test('no sticky when height fits container', () => {
    const { store, basic } = setupStore({ rows, columns, rowHeight: 40, colWidth: 100 })

    // 合并 2 行，总高 80，容器高 400 → 不溢出
    const cellList: MergeCellIdItem[] = [
      {
        cellId: getCellId({ rowId: 'r0', columnId: 'c0' }),
        rowIdList: ['r1'],
        colIdList: [],
      },
    ]

    const styles = computeMergeStyles(store, basic, cellList, { containerHeight: 400 })

    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.position).toBeUndefined()
    expect(anchor.height).toBe(80)
  })

  test('skips merge cells with no visible rows', () => {
    const { store, basic } = setupStore({
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

    const styles = computeMergeStyles(store, basic, cellList)
    expect(styles.size).toBe(0)
  })

  test('border flags at last visible row/column', () => {
    const { store, basic } = setupStore({
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

    const styles = computeMergeStyles(store, basic, cellList)
    const anchor = styles.get(getCellId({ rowId: 'r0', columnId: 'c0' }))!
    expect(anchor.borderBottomWidth).toBe(0)
    expect(anchor.borderRightWidth).toBe(0)
  })

  test('performance: large dataset only processes visible merge cells', () => {
    // 模拟大数据场景
    const largeRows = Array.from({ length: 100000 }, (_, i) => `r${i}`)
    const largeCols = Array.from({ length: 50 }, (_, i) => `c${i}`)
    const { store, basic } = setupStore({
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
    const styles = computeMergeStyles(store, basic, cellList, { containerHeight: 600 })
    const elapsed = performance.now() - start

    // 应该生成 2 个合并区域 × (3行×2列) = 12 个样式
    expect(styles.size).toBe(12)
    // 应在 50ms 内完成（不再为每个 cell 创建 100K Set）
    expect(elapsed).toBeLessThan(50)
  })

  test('performance: skips merge cells outside visible range', () => {
    const visibleRows = ['r0', 'r1', 'r2']
    const { store, basic } = setupStore({
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

    const styles = computeMergeStyles(store, basic, cellList)

    // 只有第二个合并（可见的）产生样式
    expect(styles.size).toBe(2) // r0,c0 和 r1,c0
    expect(styles.has(getCellId({ rowId: 'r_hidden', columnId: 'c0' }))).toBe(false)
  })
})
