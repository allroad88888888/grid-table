import type { CustomCellProps } from './type'

export function ColumnIndex({ position }: CustomCellProps) {
  return <>{position.rowId}</>
}
