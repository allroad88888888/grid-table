import type { CellProps } from '@grid-table/core'
import { atom, useAtomValue } from '@einfach/react'
import { easyGet } from '@einfach/utils'
import { useCellThead } from '../../hooks'
import clsx from 'clsx'
import { useData } from '../../core'
import { reactNodeRender } from '../../utils/reactNodeRender'
import { ColumnDragItem } from '../../plugins/drag'
import { useMemo } from 'react'
import { headerRowIndexListAtom } from '@grid-table/basic'
import { useTheadCellEvents } from '../../hooks/useTheadCellEvents'

export function DataCellThead(props: CellProps) {
  const { columnId, style, className, rowId } = useCellThead(props)

  const { getColumnOptionAtomByColumnId, getHeaderRowInfoAtomByRowId } = useData()

  const columnOption = useAtomValue(getColumnOptionAtomByColumnId(columnId))

  const rowInfo = useAtomValue(getHeaderRowInfoAtomByRowId(rowId))

  const events = useTheadCellEvents({
    rowId,
    columnId,
    cellId: props.cellId,
  })

  const headerRowCountAtom = useMemo(() => {
    return atom((getter) => {
      return getter(headerRowIndexListAtom).length
    })
  }, [])

  const headerRowCount = useAtomValue(headerRowCountAtom) - 1

  const cellVal = useMemo(() => {
    if (!columnOption.dataIndex || !rowInfo) {
      return ''
    }
    return easyGet(rowInfo, columnOption.dataIndex)
  }, [columnOption.dataIndex, rowInfo])

  const TitleComponent = columnOption.titleComponent

  if (TitleComponent) {
    return (
      <TitleComponent
        style={style}
        className={clsx('thead-cell', className)}
        position={{
          rowId,
          cellId: props.cellId,
          // rowIndex: props.rowIndex,
          columnId,
          // columnIndex: props.columnIndex,
        }}
        {...events}
      >
        <>{props.rowIndex === headerRowCount ? <ColumnDragItem columnId={columnId} /> : null}</>
      </TitleComponent>
    )
  }

  if (!columnOption.title) {
    return (
      <div style={style} className={clsx('thead-cell', className)} {...events}>
        <div className={clsx('grid-table-cell-data-item')}>{cellVal}</div>
        {props.rowIndex === headerRowCount ? <ColumnDragItem columnId={columnId} /> : null}
      </div>
    )
  }

  return (
    <div style={style} className={clsx('thead-cell', className)} {...events}>
      <div className={clsx('grid-table-cell-data-item')}>{reactNodeRender(columnOption.title)}</div>
      {props.rowIndex === headerRowCount ? <ColumnDragItem columnId={columnId} /> : null}
    </div>
  )
}
