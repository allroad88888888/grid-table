import type { CellProps } from '@grid-table/core'
import { useCell, useCellEvents } from '../../hooks'
import { useMemo } from 'react'
import clsx from 'clsx'
import { easyGet } from 'einfach-utils'
import { useExpandItem } from '../../Tree'
import { useColumnOption } from '../../hooks/useColumnOption'
import { useRowInfo } from '../../hooks/useRowInfo'
import './Cell.css'

export function DataCell(props: CellProps) {
  const { rowId, columnId, style, className } = useCell(props)
  const events = useCellEvents({
    rowId,
    columnId,
    columnIndex: props.columnIndex,
    rowIndex: props.rowIndex,
  })

  const { rowInfo } = useRowInfo({ rowIndex: props.rowIndex })

  const columnOption = useColumnOption(columnId)

  const { expendDom } = useExpandItem({
    rowId,
    columnId,
    rowIndex: props.rowIndex,
    columnIndex: props.columnIndex,
    enable: columnOption.enabledExpand,
  })

  const cellVal = useMemo(() => {
    if (!columnOption.dataIndex) {
      return ''
    }
    return easyGet(rowInfo, columnOption.dataIndex)
  }, [columnOption.dataIndex, rowInfo])

  const { render } = columnOption
  const children = useMemo(() => {
    if (render) {
      return render(cellVal, rowInfo as unknown as Record<string, any>, {
        rowId,
        columnId,
        rowIndex: props.rowIndex,
        columnIndex: props.columnIndex,
      })
    }
    return cellVal
  }, [render, cellVal, rowInfo, rowId, columnId, props.rowIndex, props.columnIndex])

  return (
    <div
      style={style}
      className={clsx('grid-table-cell', className, 'grid-table-cell-data-item')}
      {...events}
    >
      {expendDom}
      {children}
    </div>
  )
}