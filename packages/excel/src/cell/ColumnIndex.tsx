import type { CustomCellProps } from '@grid-table/view'

export function ColumnIndex({ position: param }: CustomCellProps) {
  return param.rowId.toString()
}
