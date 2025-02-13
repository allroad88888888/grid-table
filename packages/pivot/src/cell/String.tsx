import type { CustomCellProps } from '@grid-table/view'

export function CellString({ text, rowInfo, position }: CustomCellProps) {
  return <>{text}</>
}
