import type { CellProps, Position } from '@grid-table/core'
import { useCell } from '../hooks/useCell'
import { useCellEvents } from '../hooks'
import clsx from 'clsx'

function CellEasy({ rowIndex, columnIndex }: Position) {
  return <>{`${rowIndex}_${columnIndex}`}</>
}

export function Cell(props: CellProps) {
  const { children = CellEasy } = props
  const { rowIndex, columnIndex, style, className } = useCell(props)
  const events = useCellEvents({
    rowIndex: props.rowIndex,
    columnIndex: props.columnIndex,
  })

  const Custom = children

  return (
    <div style={style} className={clsx('grid-table-cell', className)} {...events}>
      <Custom rowIndex={rowIndex} columnIndex={columnIndex} />
    </div>
  )
}
