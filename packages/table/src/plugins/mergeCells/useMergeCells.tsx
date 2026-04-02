import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useAtomValue, useStore } from '@einfach/react'
import { columnIdShowListAtom, rowIdShowListAtom, useBasic } from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { tbodyMergeCellListAtom } from '../../components'

export function useMergeCells({
  showBorder = true,
  containerSize,
  stickyMergeCell = true,
}: { showBorder?: boolean; containerSize?: { width: number; height: number }; stickyMergeCell?: boolean } = {}) {
  const store = useStore()
  const { getCellStateAtomById, columnSizeMapAtom, rowSizeMapAtom } = useBasic()

  const cellList = useAtomValue(tbodyMergeCellListAtom, { store })
  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const rowSizeMap = useAtomValue(rowSizeMapAtom, { store })
  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })
  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })

  useEffect(() => {
    if (!showBorder) return
    if (!cellList || cellList.length === 0) return

    const maxHeight = containerSize?.height || Infinity

    // 预构建 Set，整个 effect 只算一次，避免每个 setter 回调重复创建
    const visibleRowSet = new Set(rowIdShowList)
    const visibleColSet = new Set(columnIdShowList)
    const lastVisibleRowId = rowIdShowList[rowIdShowList.length - 1]
    const lastVisibleColId = columnIdShowList[columnIdShowList.length - 1]

    const clearList: (() => void)[] = []

    cellList.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
      const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)

      // 只保留可见行列，跳过完全不在可视范围的合并区域
      const mergedRowIds = [curRowId, ...rowIdList].filter((id) => visibleRowSet.has(id))
      const mergedColIds = [curColId, ...colIdList].filter((id) => visibleColSet.has(id))
      if (mergedRowIds.length === 0 || mergedColIds.length === 0) return

      // 预计算合并区域宽高（每个合并只算一次）
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

      // 预计算行列偏移量（用于 translateY/X）
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

      // 只遍历可见行列，不再遍历全量
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

            if (isHeightOverflow && containerSize) {
              next.position = 'sticky'
              next.top = 0
              next.height = containerSize.height
              next.zIndex = 0
            }

            if (hadColLast) next.borderBottomWidth = 0
            if (hadRowLast) next.borderRightWidth = 0

            const transforms: string[] = []
            if (rowIndex && !isHeightOverflow) {
              const offset = rowOffsetMap.get(rowId) || 0
              if (offset > 0) transforms.push(`translateY(${-offset}px)`)
            }
            if (colIndex) {
              const offset = colOffsetMap.get(colId) || 0
              if (offset > 0) transforms.push(`translateX(${-offset}px)`)
            }
            if (transforms.length) next.transform = transforms.join(' ')
          }

          clearList.push(
            store.setter(getCellStateAtomById(tCellId), (_getter, prev) => {
              return {
                ...prev,
                style: {
                  ...prev.style,
                  ...next,
                },
              }
            })!,
          )
        })
      })
    })

    return () => {
      clearList.forEach((clear) => clear())
    }
  }, [
    cellList,
    columnSizeMap,
    getCellStateAtomById,
    rowSizeMap,
    store,
    showBorder,
    containerSize,
    stickyMergeCell,
    rowIdShowList,
    columnIdShowList,
  ])
}

export default ''
