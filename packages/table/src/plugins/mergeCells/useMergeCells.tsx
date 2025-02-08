import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import type { Getter } from '@einfach/state'
import { useAtomValue, useStore } from '@einfach/state'
import { columnIdShowListAtom, rowIdShowListAtom, useBasic } from '@grid-table/basic'
import { getCellId, getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { tbodyMergeCellListAtom } from '../../components'

export function useMergeCells() {
  const store = useStore()
  const { getCellStateAtomById, columnSizeMapAtom, rowSizeMapAtom } = useBasic()

  const cellList = useAtomValue(tbodyMergeCellListAtom, { store })
  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const rowSizeMap = useAtomValue(rowSizeMapAtom, { store })

  useEffect(() => {
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
          next = {
            width: [curColId, ...colIdList]
              .filter((colId) => {
                return columnIdSet.has(colId)
              })
              .reduce<number>((prev, colId) => {
                return prev + (columnSizeMap.get(colId) || 0)
              }, 0),
            height: [curRowId, ...rowIdList]
              .filter((rowId) => {
                return rowIdSet.has(rowId)
              })
              .reduce<number>((prev, rowId) => {
                return prev + (rowSizeMap.get(rowId) || 0)
              }, 0),
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
  }, [cellList, columnSizeMap, getCellStateAtomById, rowSizeMap, store])
}

export default ''
