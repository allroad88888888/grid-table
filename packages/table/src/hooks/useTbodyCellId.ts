import type { Position } from '@grid-table/core'
import { useBasic } from '@grid-table/basic'
import { useStore, useAtomValue } from '@einfach/react'
import { getCellId } from '../utils'

export function useTbodyCellId({ rowIndex, columnIndex }: Position) {
  const { columnIdShowListAtom, rowIdShowListAtom } = useBasic()
  const store = useStore()

  const columnList = useAtomValue(columnIdShowListAtom, { store })
  const columnId: string = columnList[columnIndex]

  const rowList = useAtomValue(rowIdShowListAtom, { store })
  const rowId: string = rowList[rowIndex]

  return getCellId({
    rowId: rowId,
    columnId: columnId,
  })
}
