import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useAtomValue, useStore } from 'einfach-state'

import { columnIdShowListAtom, rowIdShowListAtom, useBasic } from '@grid-table/basic'
import { getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { getAffectedCellSet } from './utils'
import { tbodyMergeCellListAtom } from '../../components'

export function useMergeCells() {
  const store = useStore()
  const { getCellStateAtomById, columnSizeMapAtom, rowSizeMapAtom } = useBasic()

  const cellList = useAtomValue(tbodyMergeCellListAtom)
  const columnSizeMap = useAtomValue(columnSizeMapAtom)
  const rowSizeMap = useAtomValue(rowSizeMapAtom)

  // useEffect(() => {
  //   store.setter(mergeCellListAtom, [
  //     {
  //       colIdList: ['10004', '10005'],
  //       rowIdList: ['3'],
  //       cellId: getCellId({
  //         rowId: '2',
  //         columnId: '10003',
  //       }),
  //     },
  //   ])
  // }, [])

  useEffect(() => {
    if (!cellList || cellList.length === 0) {
      return
    }

    const clearList: (() => void)[] = []

    const affectedCellSet = getAffectedCellSet(cellList)

    cellList?.map(({ cellId, rowIdList = [], colIdList = [] }) => {
      clearList.push(
        store.setter(getCellStateAtomById(cellId), (getter, prev) => {
          const [curRowId, curColId] = getRowIdAndColIdByCellId(cellId)

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
                  return prev + columnSizeMap.get(colId)!
                }, 0),
              height: [curRowId, ...rowIdList]
                .filter((rowId) => {
                  return rowIdSet.has(rowId)
                })
                .reduce<number>((prev, rowId) => {
                  return prev + rowSizeMap.get(rowId)!
                }, 0),
              zIndex: 1,
            }
          }

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

    affectedCellSet.forEach((cellId) => {
      clearList.push(
        store.setter(getCellStateAtomById(cellId), (getter, prev) => {
          return {
            ...prev,
            style: {
              ...prev.style,
              display: 'none',
            },
          }
        })!,
      )
    })

    return () => {
      clearList.forEach((clear) => {
        clear()
      })
    }
  }, [cellList, columnSizeMap, getCellStateAtomById, rowSizeMap, store])
}

export default ''
