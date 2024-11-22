import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { atom, useAtomValue, useStore } from 'einfach-state'
import type { MergeCellIdItem } from './types'
import { useBasic } from '@grid-table/basic'
import { getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { getAffectedCellSet } from './utils'

export const mergeCellListAtom = atom<MergeCellIdItem[] | undefined>(undefined)

export function useMergeCells() {
  const store = useStore()
  const { getCellStateAtomById, columnSizeMapAtom, rowSizeMapAtom } = useBasic()

  const cellList = useAtomValue(mergeCellListAtom)
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
            next = {
              width: [curColId, ...colIdList].reduce<number>((prev, colId) => {
                return prev + columnSizeMap.get(colId)!
              }, 0),
              height: [curRowId, ...rowIdList].reduce<number>((prev, rowId) => {
                return prev + rowSizeMap.get(rowId)!
              }, 0),
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
