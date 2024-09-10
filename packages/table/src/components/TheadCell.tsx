import type { CellProps } from '@grid-table/core'
import { useTHeadCell } from '../hooks/useCell'
import { ColumnDragItem } from '../plugins/drag'
import clsx from 'clsx'

export function THeadCellBasic(props: CellProps) {
  const { rowIndex, columnIndex, style, className } = useTHeadCell(props)
  return (
    <div style={style} className={clsx('thead-cell', className)}>
      {rowIndex}_{columnIndex}
      <ColumnDragItem columnIndex={columnIndex} />
    </div>
  )
}
