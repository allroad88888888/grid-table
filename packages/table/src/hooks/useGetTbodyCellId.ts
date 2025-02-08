import type { Position } from '@grid-table/core'
import { useCallback } from 'react'
import { useAtomValue, useStore } from '@einfach/state'
import { columnIdShowListAtom, rowIdShowListAtom } from '@grid-table/basic'
import { mergeCellBodyMapAtom } from '../components'
import { getCellId, getRowIdAndColIdByCellId } from '../utils'

export function useGetTbodyCellId() {
  const store = useStore()

  const mergeCellMap = useAtomValue(mergeCellBodyMapAtom)

  const columnList = useAtomValue(columnIdShowListAtom, { store })
  const rowList = useAtomValue(rowIdShowListAtom, { store })

  const getCellIdByPosition = useCallback(
    (position: Position) => {
      const cellId = getCellId({
        rowId: rowList[position.rowIndex],
        columnId: columnList[position.columnIndex],
      })

      if (mergeCellMap.has(cellId)) {
        const tCellId = mergeCellMap.get(cellId)!
        const [rowId, columnId] = getRowIdAndColIdByCellId(tCellId)
        return {
          cellId: tCellId,
          rowId,
          columnId,
        }
      }
      return {
        cellId,
        rowId: rowList[position.rowIndex],
        columnId: columnList[position.columnIndex],
      }
    },
    [columnList, mergeCellMap, rowList],
  )

  return {
    getCellIdByPosition,
  }
}
