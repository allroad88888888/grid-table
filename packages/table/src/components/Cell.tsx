import type { CellProps, Position } from '@grid-table/core'
import { useCell } from '../hooks/useCell'
import { useCellEvents } from '../hooks'

function CellEasy({ rowIndex, columnIndex }: Position) {
  return <>{`${rowIndex}_${columnIndex}`}</>
}

export function Cell(props: CellProps) {
  const { children = CellEasy } = props
  const { rowIndex, columnIndex, style } = useCell(props)
  const events = useCellEvents({
    rowIndex,
    columnIndex,
  })

  const Custom = children

  return (
    <div style={style} className="grid-table-cell" {...events}>
      <Custom rowIndex={rowIndex} columnIndex={columnIndex} />
    </div>
  )
}
