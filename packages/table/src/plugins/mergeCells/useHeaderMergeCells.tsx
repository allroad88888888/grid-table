import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import {
  columnIdShowListAtom,
  headerRowSizeMaAtom,
  rowIdShowListAtom,
  useBasic,
} from '@grid-table/basic'
import type { CellId } from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { theadMergeCellListAtom } from '../../components'
import { mergeHeaderCellStyleMapAtom } from './state'

export function useHeaderMergeCells({ showBorder = true }: { showBorder?: boolean } = {}) {
  const store = useStore()
  const { columnSizeMapAtom } = useBasic()

  const cellList = useAtomValue(theadMergeCellListAtom)
  const columnSizeMap = useAtomValue(columnSizeMapAtom)
  const rowSizeMap = useAtomValue(headerRowSizeMaAtom)
  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })
  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })

  useEffect(() => {
    if (!showBorder) return
    if (!cellList || cellList.length === 0) return

    // 预构建 Set，避免内层循环重复创建
    const visibleRowSet = new Set(rowIdShowList)
    const visibleColSet = new Set(columnIdShowList)
    const lastVisibleRowId = rowIdShowList[rowIdShowList.length - 1]
    const lastVisibleColId = columnIdShowList[columnIdShowList.length - 1]

    // 收集所有合并 cell 的样式到 Map，一次性 set
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

      // 预计算偏移 Map，替代 O(n²) 的 slice+filter+reduce
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

    store.setter(mergeHeaderCellStyleMapAtom, styleMap)

    return () => {
      store.setter(mergeHeaderCellStyleMapAtom, new Map())
    }
  }, [
    cellList,
    columnSizeMap,
    rowSizeMap,
    store,
    showBorder,
    rowIdShowList,
    columnIdShowList,
  ])
}
