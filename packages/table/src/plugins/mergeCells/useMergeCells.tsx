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
            .filter((colId) => {
              return columnIdSet.has(colId)
            })
            .reduce<number>((prev, colId) => {
              return prev + (columnSizeMap.get(colId) || 0)
            }, 0)

          const calculatedHeight = [curRowId, ...rowIdList]
            .filter((rowId) => {
              return rowIdSet.has(rowId)
            })
            .reduce<number>((prev, rowId) => {
              return prev + (rowSizeMap.get(rowId) || 0)
            }, 0)

          // 限制最大尺寸为容器尺寸
          const maxWidth = containerSize?.width || Infinity
          const maxHeight = containerSize?.height || Infinity
          const finalWidth = Math.min(calculatedWidth, maxWidth)
          const finalHeight = Math.min(calculatedHeight, maxHeight)

          // 判断是否超出容器
          const isWidthOverflow = calculatedWidth > maxWidth
          const isHeightOverflow = calculatedHeight > maxHeight

          next = {
            width: finalWidth,
            height: finalHeight,
          }

          // 超出容器时使用 sticky 定位
          if (isHeightOverflow || isWidthOverflow) {
            next.position = 'sticky'
            if (isHeightOverflow) {
              next.top = 0
              next.borderTop = '1px var(--grid-cell-border-style) var(--grid-border-color)'
            }
            if (isWidthOverflow) {
              next.left = 0
              next.borderLeft = '1px var(--grid-cell-border-style) var(--grid-border-color)'
            }
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
            next = {
              ...next,
              transform: `translateY(${-[curRowId, ...rowIdList]
                .slice(0, rowIndex)
                .filter((rowId) => {
                  return rowIdSet.has(rowId)
                })
                .reduce<number>((prev, rowId) => {
                  return prev + (rowSizeMap.get(rowId) || 0)
                }, 0)}px)`,
            }
          }
          if (colIndex) {
            next = {
              ...next,

              transform: `translateX(${-[curColId, ...colIdList]
                .slice(0, colIndex)
                .filter((colId) => {
                  return columnIdSet.has(colId)
                })
                .reduce<number>((prev, colId) => {
                  return prev + (columnSizeMap.get(colId) || 0)
                }, 0)}px)`,
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
