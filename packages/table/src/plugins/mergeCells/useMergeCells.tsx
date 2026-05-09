import { useEffect } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import {
  columnIdShowListAtom,
  headerRowSizeMapAtom,
  rowIdShowListAtom,
  useBasic,
} from '@grid-table/basic'
import type { CellId } from '@grid-table/basic'
import { getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { tbodyMergeCellListAtom } from '../../components'
import { mergeCellStyleMapAtom } from './state'
import type { MergeCellStyleItem } from './state'
import { stickyLeftAtom, stickyRightAtom } from '../sticky/state'

export function useMergeCells({
  showBorder = true,
  containerSize,
  stickyMergeCell = true,
}: { showBorder?: boolean; containerSize?: { width: number; height: number }; stickyMergeCell?: boolean } = {}) {
  const store = useStore()
  const { columnSizeMapAtom, rowSizeMapAtom } = useBasic()

  const cellList = useAtomValue(tbodyMergeCellListAtom, { store })
  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const rowSizeMap = useAtomValue(rowSizeMapAtom, { store })
  const headerRowSizeMap = useAtomValue(headerRowSizeMapAtom, { store })
  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })
  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })
  const stickyLeftIds = useAtomValue(stickyLeftAtom, { store })
  const stickyRightIds = useAtomValue(stickyRightAtom, { store })

  useEffect(() => {
    if (!showBorder) return
    if (!cellList || cellList.length === 0) return

    const headerHeight = Array.from(headerRowSizeMap.values()).reduce(
      (total, current) => total + current,
      0,
    )
    const tbodyViewportHeight =
      containerSize && containerSize.height > headerHeight
        ? containerSize.height - headerHeight
        : 0
    const maxHeight = tbodyViewportHeight > 0 ? tbodyViewportHeight : Infinity

    const visibleRowSet = new Set(rowIdShowList)
    const visibleColSet = new Set(columnIdShowList)
    const lastVisibleRowId = rowIdShowList[rowIdShowList.length - 1]
    const lastVisibleColId = columnIdShowList[columnIdShowList.length - 1]
    const lastVisibleLeftStickyColId = stickyLeftIds.filter((id) => visibleColSet.has(id)).at(-1)
    const firstVisibleRightStickyColId = stickyRightIds.find((id) => visibleColSet.has(id))

    // 每个 merge 只保留一个稳定的 overlay 样式，key 为 anchor cellId
    const styleMap = new Map<CellId, MergeCellStyleItem>()

    cellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
      if (rowIdList.length === 0 && colIdList.length === 0) return

      const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)

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

      if (isHeightOverflow && tbodyViewportHeight > 0) {
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

      const next: MergeCellStyleItem = {
        width: calculatedWidth,
        height: calculatedHeight,
        className: classNames.join(' '),
      }

      if (isHeightOverflow && tbodyViewportHeight > 0) {
        ;(next as Record<string, string>)['--grid-merge-sticky-height'] = `${tbodyViewportHeight}px`
        ;(next as Record<string, string>)['--grid-merge-sticky-top'] = `${headerHeight}px`
      }

      if (hadColLast) next.borderBottomWidth = 0
      if (hadRowLast) next.borderRightWidth = 0

      styleMap.set(cellId, next)
    })

    store.setter(mergeCellStyleMapAtom, styleMap)

    return () => {
      store.setter(mergeCellStyleMapAtom, new Map())
    }
  }, [
    cellList,
    columnSizeMap,
    rowSizeMap,
    headerRowSizeMap,
    store,
    showBorder,
    containerSize,
    stickyMergeCell,
    rowIdShowList,
    columnIdShowList,
    stickyLeftIds,
    stickyRightIds,
  ])
}

export default ''
