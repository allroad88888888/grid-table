import type { CellProps } from '@grid-table/core'
import { useAtomValue } from 'einfach-state'
import { useTHeadCell } from '../../hooks'
import { ColumnDragItem } from '../drag'
import { useData } from './useData'
import { reactNodeRender } from '../../utils/reactNodeRender'
import clsx from 'clsx'

export function DataCellThead(props: CellProps) {
  const { columnIndex, style, className } = useTHeadCell(props)

  const { getColumnOptionAtomByColId } = useData()

  const columnOption = useAtomValue(getColumnOptionAtomByColId(columnIndex))

  return (
    <div style={style} className={clsx('thead-cell', className)}>
      {reactNodeRender(columnOption.title)}
      <ColumnDragItem columnIndex={columnIndex} />
    </div>
  )
}
