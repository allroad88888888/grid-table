import type { Position } from '@grid-table/core'

const connectKey = '-'
export function getCellId({ rowIndex, columnIndex }: Position) {
  return `${rowIndex}${connectKey}${columnIndex}`
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
