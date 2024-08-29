import type { CellProps } from '@grid-table/core'
import { useTHeadCell } from '../hooks/useCell'
import { ColumnDragItem } from '../plugins/drag'

export function THeadCellBasic(props: CellProps) {
  const { rowIndex, columnIndex, style } = useTHeadCell(props)
  return (
    <div style={style} className="thead-cell">
      {rowIndex}_{columnIndex}
      <ColumnDragItem columnIndex={columnIndex} />
    </div>
  )
}
