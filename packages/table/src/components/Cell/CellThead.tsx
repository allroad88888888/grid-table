import type { CellProps } from '@grid-table/core'
import { useAtomValue } from 'einfach-state'
import { easyGet } from 'einfach-utils'
import { useCellThead } from '../../hooks'
import clsx from 'clsx'
import { useData } from '../../core'
import { reactNodeRender } from '../../utils/reactNodeRender'
import { ColumnDragItem } from '../../plugins/drag'
import { useMemo } from 'react'

export function DataCellThead(props: CellProps) {
  const { columnId, style, className } = useCellThead(props)

  const { getColumnOptionAtomByColumnId, getHeaderRowInfoAtomByRowId } = useData()

  const columnOption = useAtomValue(getColumnOptionAtomByColumnId(columnId))

  const rowInfo = useAtomValue(getHeaderRowInfoAtomByRowId(props.rowIndex.toString()))

  const cellVal = useMemo(() => {
    if (!columnOption.dataIndex || !rowInfo) {
      return ''
    }
    return easyGet(rowInfo, columnOption.dataIndex)
  }, [columnOption.dataIndex, rowInfo])

  if (!columnOption.title) {
    return (
      <div style={style} className={clsx('thead-cell', className)}>
        <div className={clsx('grid-table-cell-data-item')}>{cellVal}</div>
        {props.rowIndex === 0 ? <ColumnDragItem columnId={columnId} /> : null}
      </div>
    )
  }

  return (
    <div style={style} className={clsx('thead-cell', className)}>
      <div className={clsx('grid-table-cell-data-item')}>{reactNodeRender(columnOption.title)}</div>
      {props.rowIndex === 0 ? <ColumnDragItem columnId={columnId} /> : null}
    </div>
  )
}
