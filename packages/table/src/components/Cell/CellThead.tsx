import type { CellProps } from '@grid-table/core'
import { atom, useAtomValue, selectAtom, useStore } from '@einfach/react'
import { easyGet } from '@einfach/utils'
import { useCellThead } from '../../hooks'
import clsx from 'clsx'
import { useData } from '../../core'
import { reactNodeRender } from '../../utils/reactNodeRender'
import { ColumnDragItem } from '../../plugins/drag'
import { useMemo, useCallback } from 'react'
import { headerRowIndexListAtom } from '@grid-table/basic'
import { useTheadCellEvents } from '../../hooks/useTheadCellEvents'
import { columnSortInfoAtom } from '../../plugins/sort/state'
import { sortToggleAtom } from '../../plugins/sort/state'
import { SortIcon } from '../../plugins/sort/SortIcon'

export function DataCellThead(props: CellProps) {
  const { columnId, style, className, rowId } = useCellThead(props)

  const store = useStore()
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

  // 排序状态
  const sortInfoAtom = useMemo(
    () => selectAtom(columnSortInfoAtom, (map) => map.get(columnId) ?? null),
    [columnId],
  )
  const sortInfo = useAtomValue(sortInfoAtom, { store })
  const isSortable = !!columnOption.sorter

  const onSortClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isSortable) return
      const toggle = store.getter(sortToggleAtom)
      toggle?.(columnId, e.shiftKey)
    },
    [store, columnId, isSortable],
  )

  // 合并排序点击和 thead 通用事件的 onClick，避免 spread 覆盖
  const mergedOnClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onSortClick(e)
      events.onClick?.(e)
    },
    [onSortClick, events],
  )

  // 剔除 events 中的 onClick，用合并后的版本替代
  const { onClick: _eventsOnClick, ...eventsWithoutClick } = events

  const SortIconComponent = columnOption.sortIcon || SortIcon
  const sortIconElement = isSortable ? (
    <SortIconComponent
      direction={sortInfo?.direction}
      priority={sortInfo?.priority}
    />
  ) : null

  const TitleComponent = columnOption.titleComponent

  if (TitleComponent) {
    return (
      <TitleComponent
        style={style}
        className={clsx('thead-cell', className)}
        position={{
          rowId,
          cellId: props.cellId,
          rowIndex: props.rowIndex,
          columnId,
          colIndex: props.columnIndex,
        }}
        {...events}
      >
        <>{props.rowIndex === headerRowCount ? <ColumnDragItem columnId={columnId} /> : null}</>
      </TitleComponent>
    )
  }

  const sortableStyle = isSortable ? { ...style, cursor: 'pointer' } : style

  if (!columnOption.title) {
    return (
      <div
        style={sortableStyle}
        className={clsx('thead-cell', isSortable && 'thead-cell-sortable', className)}
        {...eventsWithoutClick}
        onClick={mergedOnClick}
        data-cell-id={props.cellId}
        data-testid={`thead-cell-${columnId}`}
        data-sortable={isSortable || undefined}
      >
        <div className={clsx('grid-table-cell-data-item')}>{cellVal}{sortIconElement}</div>
        {props.rowIndex === headerRowCount ? <ColumnDragItem columnId={columnId} /> : null}
      </div>
    )
  }

  return (
    <div
      style={sortableStyle}
      className={clsx('thead-cell', isSortable && 'thead-cell-sortable', className)}
      {...eventsWithoutClick}
      onClick={mergedOnClick}
      data-cell-id={props.cellId}
      data-testid={`thead-cell-${columnId}`}
      data-sortable={isSortable || undefined}
    >
      <div className={clsx('grid-table-cell-data-item')}>{reactNodeRender(columnOption.title)}{sortIconElement}</div>
      {props.rowIndex === headerRowCount ? <ColumnDragItem columnId={columnId} /> : null}
    </div>
  )
}
