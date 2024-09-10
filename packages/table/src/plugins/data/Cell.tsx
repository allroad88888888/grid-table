import type { CellProps } from '@grid-table/core'
import { useCell, useCellEvents } from '../../hooks'
import { useData } from './useData'
import { useAtomValue } from 'einfach-state'
import { useMemo } from 'react'
import clsx from 'clsx'
import { easyGet } from 'einfach-utils'
import { useExpandItem } from './tree'
import './Cell.css'
import { useRowInfo } from './useRowInfo'

export function DataCell(props: CellProps) {
  const { rowIndex, columnIndex, style, className } = useCell(props)
  const events = useCellEvents({
    rowIndex,
    columnIndex,
  })

  const { columnOptionsAtom } = useData()

  const { path, rowInfo } = useRowInfo({ rowIndex })

  const columnOption = useAtomValue(columnOptionsAtom)[columnIndex]

  const { expendDom } = useExpandItem({
    rowIndex,
    columnIndex,
    path,
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
      return render(cellVal, rowInfo as unknown as Record<string, any>, path)
    }
    return cellVal
  }, [cellVal, path, render, rowInfo])

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
