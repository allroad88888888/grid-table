import { CellProps } from '@grid-table/core'

export function THeadCellBasic({ rowIndex, columnIndex, style }: CellProps) {
  return (
    <div style={style}>
      {rowIndex}
      _
      {columnIndex}
    </div>
  )
}
