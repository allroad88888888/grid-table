import type { CellProps } from '@grid-table/core'
import { useAtomValue } from 'einfach-state'
import { useTHeadCell } from '../../hooks'
import clsx from 'clsx'
import { useData } from '../../core'
import { reactNodeRender } from '../../utils/reactNodeRender'
import { ColumnDragItem } from '../../plugins/drag'

export function DataCellThead(props: CellProps) {
  const { columnId, style, className } = useTHeadCell(props)

  const { getColumnOptionAtomByColumnId, store } = useData()

  const columnOption = useAtomValue(getColumnOptionAtomByColumnId(columnId), { store })

  return (
    <div style={style} className={clsx('thead-cell', 'grid-table-cell-data-item', className)}>
      {reactNodeRender(columnOption.title)}
      <ColumnDragItem columnId={columnId} />
    </div>
  )
}
