import type { CustomCellProps } from '@grid-table/view'

export function ColumnIndex({ param }: CustomCellProps) {
  return param.rowId.toString()
}
