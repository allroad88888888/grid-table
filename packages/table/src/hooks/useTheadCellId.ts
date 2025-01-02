import type { Position } from '@grid-table/core'
import { useBasic } from '@grid-table/basic'
import { useStore, useAtomValue } from 'einfach-state'
import { getCellId, getHeaderRowId } from '../utils'

export function useTheadCellId({ rowIndex, columnIndex }: Position) {
  const { columnIdShowListAtom } = useBasic()
  const store = useStore()

  const columnList = useAtomValue(columnIdShowListAtom, { store })
  const columnId: string = columnList[columnIndex]

  return getCellId({
    rowId: getHeaderRowId(rowIndex),
    columnId: columnId,
  })
}
