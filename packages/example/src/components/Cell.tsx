import type { CellProps } from '@grid-table/core'

export function CellBasic({ rowIndex, columnIndex, style }: CellProps) {
  return (
    <div style={style}>
      {rowIndex}_{columnIndex}
    </div>
  )
}
