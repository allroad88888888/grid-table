import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import type { Getter } from '@einfach/react'
import { useAtomValue, useStore } from '@einfach/react'
import { columnIdShowListAtom, rowIdShowListAtom, useBasic } from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { tbodyMergeCellListAtom } from '../../components'
import { lastSet } from './utils'

export function useMergeCells({
  showBorder = true,
  containerSize,
}: { showBorder?: boolean; containerSize?: { width: number; height: number } } = {}) {
  const store = useStore()
  const { getCellStateAtomById, columnSizeMapAtom, rowSizeMapAtom } = useBasic()

  const cellList = useAtomValue(tbodyMergeCellListAtom, { store })
  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const rowSizeMap = useAtomValue(rowSizeMapAtom, { store })

  useEffect(() => {
    if (!showBorder) return

    if (!cellList || cellList.length === 0) {
      return
    }

    const maxHeight = containerSize?.height || Infinity
    const theadElement = document.querySelector<HTMLElement>(".grid-table [role='thead']")
    const theadHeight = theadElement?.offsetHeight || 0

    const clearList: (() => void)[] = []

    cellList?.forEach(({ cellId, rowIdList = [], colIdList = [] }) => {
      const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)

      function getStyle(getter: Getter, rowIndex: number, colIndex: number) {
        let next: CSSProperties = {}
        if (rowIdList.length === 0 && colIdList.length === 0) {
          next = {
            display: 'none',
          }
        } else {
          const rowIdSet = new Set(getter(rowIdShowListAtom))
          const columnIdSet = new Set(getter(columnIdShowListAtom))

          const calculatedWidth = [curColId, ...colIdList]
            .filter((colId) => columnIdSet.has(colId))
            .reduce<number>((prev, colId) => prev + (columnSizeMap.get(colId) || 0), 0)
          const calculatedHeight = [curRowId, ...rowIdList]
            .filter((rowId) => rowIdSet.has(rowId))
            .reduce<number>((prev, rowId) => prev + (rowSizeMap.get(rowId) || 0), 0)

          const isHeightOverflow = calculatedHeight > maxHeight

          next = {
            width: calculatedWidth,
            height: calculatedHeight,
          }

          // 合并高度超过容器时，sticky 定位 + z-index 分层
          if (isHeightOverflow && containerSize) {
            next.position = 'sticky'
            next.top = theadHeight
            next.height = containerSize.height - theadHeight
            next.zIndex = 0
          }

          const lastRowId = lastSet(rowIdSet)
          const lastColumnId = lastSet(columnIdSet)

          const hadColLast = lastRowId ? rowIdList.includes(lastRowId) : false
          const hadRowLast = lastColumnId ? colIdList.includes(lastColumnId) : false

          if (hadColLast) {
            next.borderBottomWidth = 0
          }

          if (hadRowLast) {
            next.borderRightWidth = 0
          }

          if (rowIndex) {
            if (!isHeightOverflow) {
              next = {
                ...next,
                transform: `translateY(${-[curRowId, ...rowIdList]
                  .slice(0, rowIndex)
                  .filter((rowId) => rowIdSet.has(rowId))
                  .reduce<number>((prev, rowId) => prev + (rowSizeMap.get(rowId) || 0), 0)}px)`,
              }
            }
          }
          if (colIndex) {
            next = {
              ...next,
              transform: `translateX(${-[curColId, ...colIdList]
                .slice(0, colIndex)
                .filter((colId) => columnIdSet.has(colId))
                .reduce<number>((prev, colId) => prev + (columnSizeMap.get(colId) || 0), 0)}px)`,
            }
          }
        }

        return next
      }

      ;[curRowId, ...rowIdList].forEach((rowId, rowIndex) => {
        ;[curColId, ...colIdList].forEach((colId, columnIndex) => {
          const tCellId = getCellId({
            rowId,
            columnId: colId,
          })

          clearList.push(
            store.setter(getCellStateAtomById(tCellId), (getter, prev) => {
              const next = getStyle(getter, rowIndex, columnIndex)

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
      clearList.forEach((clear) => {
        clear()
      })
    }
  }, [cellList, columnSizeMap, getCellStateAtomById, rowSizeMap, store, showBorder, containerSize])
}

export default ''
