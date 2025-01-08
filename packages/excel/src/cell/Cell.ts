import type { CustomCellProps } from '@grid-table/view'

export function Cell(cellProps: CustomCellProps) {
  const { text } = cellProps

  return text
}
