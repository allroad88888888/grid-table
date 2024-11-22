import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useAtomValue, useStore } from 'einfach-state'
import { headerRowSizeMaAtom, useBasic } from '@grid-table/basic'
import { getRowIdAndColIdByCellId } from '../../utils/getCellId'
import { getAffectedCellSet } from './utils'
import { headerMergeCellListAtom } from './stateHeader'

export function useHeaderMergeCells() {
  const store = useStore()
  const { getHeaderCellStateAtomById, columnSizeMapAtom } = useBasic()

  const cellList = useAtomValue(headerMergeCellListAtom)
  const columnSizeMap = useAtomValue(columnSizeMapAtom)
  const rowSizeMap = useAtomValue(headerRowSizeMaAtom)

  useEffect(() => {
    if (!cellList || cellList.length === 0) {
      return
    }

    const clearList: (() => void)[] = []

    const affectedCellSet = getAffectedCellSet(cellList)

    cellList?.map(({ cellId, rowIdList = [], colIdList = [] }) => {
      clearList.push(
        store.setter(getHeaderCellStateAtomById(cellId), (getter, prev) => {
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
        store.setter(getHeaderCellStateAtomById(cellId), (getter, prev) => {
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
  }, [cellList, columnSizeMap, getHeaderCellStateAtomById, rowSizeMap, store])
}

export default ''
