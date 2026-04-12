import type { CellProps } from '@grid-table/core'
import { useCell, useCellEvents } from '../../hooks'
import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { easyGet } from '@einfach/utils'
import { useExpandItem } from '../../tree'
import { useColumnOption } from '../../hooks/useColumnOption'
import { useRowInfoById } from '../../hooks/useRowInfo'
import { useIntersectionRender } from '@grid-table/core'
import './Cell.css'

export const DataCell = memo(function DataCell(props: CellProps) {
  const { rowId, columnId, style, className, cellId } = useCell(props)
  const isMergeOverlayCell = className.includes('grid-table-cell--merge-overlay')
  const shouldUseIntersectionRender = !isMergeOverlayCell
  const events = useCellEvents({
    rowId,
    columnId,
    // columnIndex: props.columnIndex,
    // rowIndex: props.rowIndex,
    cellId,
  })

  const rowInfo = useRowInfoById(rowId)

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
    const val = easyGet(rowInfo, columnOption.dataIndex)
    return typeof val === 'boolean' ? String(val) : val
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

  // 使用 IntersectionObserver + startTransition 延迟渲染 RenderComponent
  const { ref: cellRef, shouldRender } = useIntersectionRender<HTMLDivElement>()
  const shouldRenderContent = shouldUseIntersectionRender ? shouldRender : true

  return (
    <div
      ref={shouldUseIntersectionRender ? cellRef : undefined}
      style={style}
      className={clsx('grid-table-cell', className)}
      {...events}
    >
      <div className="grid-table-cell-data-item grid-table-cell-content">
        {expendDom}
        {shouldRenderContent ? (
          RenderComponent ? (
            <RenderComponent
              text={cellVal}
              rowInfo={rowInfo!}
              position={{
                rowId,
                columnId,
                colIndex: props.columnIndex,
                rowIndex: props.rowIndex,
                cellId,
              }}
            />
          ) : (
            children
          )
        ) : null}
      </div>
    </div>
  )
})
