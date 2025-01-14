import type { CellProps } from '@grid-table/core'
import { useCell, useCellEvents } from '../../hooks'
import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { easyGet } from 'einfach-utils'
import { useExpandItem } from '../../tree'
import { useColumnOption } from '../../hooks/useColumnOption'
import { useRowInfo } from '../../hooks/useRowInfo'
import './Cell.css'

export const DataCell = memo(function DataCell(props: CellProps) {
  const { rowId, columnId, style, className, cellId } = useCell(props)
  const events = useCellEvents({
    rowId,
    columnId,
    // columnIndex: props.columnIndex,
    // rowIndex: props.rowIndex,
    cellId,
  })

  const { rowInfo } = useRowInfo({ rowIndex: props.rowIndex })

  const columnOption = useColumnOption(columnId)

  const { expendDom } = useExpandItem({
    rowId,
    columnId,
    // rowIndex: props.rowIndex,
    // columnIndex: props.columnIndex,
    enable: columnOption.enabledExpand,
    cellId,
  })

  const cellVal = useMemo(() => {
    if (!columnOption.dataIndex) {
      return ''
    }
    return easyGet(rowInfo, columnOption.dataIndex)
  }, [columnOption.dataIndex, rowInfo])

  const { render, renderComponent } = columnOption

  const children = useMemo(() => {
    if (render) {
      return render(cellVal, rowInfo as unknown as Record<string, any>, {
        rowId,
        columnId,
        // rowIndex: props.rowIndex,
        // columnIndex: props.columnIndex,
        cellId,
      })
    }
    return cellVal
  }, [render, cellVal, rowInfo, rowId, columnId, cellId])

  const RenderComponent = renderComponent

  return (
    <div
      style={style}
      className={clsx('grid-table-cell', className, 'grid-table-cell-data-item')}
      {...events}
    >
      {expendDom}
      {RenderComponent ? (
        <RenderComponent
          text={cellVal}
          rowInfo={rowInfo!}
          param={{
            rowId,
            columnId,
            colIndex: props.columnIndex,
            rowIndex: props.rowIndex,
            cellId,
          }}
        />
      ) : (
        children
      )}
    </div>
  )
})
