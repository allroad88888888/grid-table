import type { CellProps } from '@grid-table/core'
import { useCell } from '../hooks/useCell'

export function CellBasic(props: CellProps) {
  const { rowIndex, columnIndex, style } = useCell(props)
  return (
    <div style={style} className="grid-table-cell">
      {rowIndex}
      _
      {columnIndex}
    </div>
  )
}
