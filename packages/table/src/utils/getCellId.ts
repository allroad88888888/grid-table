import type { ColumnId, RowId } from '@grid-table/basic/src'

const connectKey = '||'
export function getCellId({ rowId, columnId }: { rowId: RowId; columnId: ColumnId }) {
  return `${rowId}${connectKey}${columnId}`
}

export function getRowIndexByCellId(cellId: string) {
  return Number(cellId.split(connectKey)[0])
}

export function getColumnIndexByCellId(cellId: string) {
  return Number(cellId.split(connectKey)[1])
}

export function getRowIndexAndColumnIndexByCellId(cellId: string) {
  return cellId.split(connectKey).map(Number)
}
