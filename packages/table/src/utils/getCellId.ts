import type { ColumnId, RowId } from '@grid-table/basic'

const connectKey = '||'
export function getCellId({ rowId, columnId }: { rowId: RowId; columnId: ColumnId }) {
  return `${rowId}${connectKey}${columnId}`
}

export function getRowIdByCellId(cellId: string) {
  return cellId.split(connectKey)[0]
}

export function getColIdByCellId(cellId: string) {
  return cellId.split(connectKey)[1]
}

export function getRowIdAndColIdByCellId(cellId: string) {
  return cellId.split(connectKey) as [string, string]
}
