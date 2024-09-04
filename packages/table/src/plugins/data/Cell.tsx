import type { CellProps } from '@grid-table/core'
import { useCell, useCellEvents } from '../../hooks'
import { useData } from './useData'
import { atom, useAtomValue } from 'einfach-state'
import { useMemo } from 'react'
import clsx from 'clsx'
import { easyGet } from 'einfach-utils'
import { useExpandItem } from './tree'
import './Cell.css'

export function DataCell(props: CellProps) {
  const { rowIndex, columnIndex, style, className } = useCell(props)
  const events = useCellEvents({
    rowIndex,
    columnIndex,
  })

  const { showPathListAtom, columnOptionsAtom, getRowInfoAtomByPath } = useData()

  const { rowInfoAtom, pathAtom } = useMemo(() => {
    const _pathAtom = atom((_getter) => {
      const pathList = _getter(showPathListAtom)
      const path = pathList[rowIndex]
      return path
    })

    const _rowInfoAtom = atom((_getter) => {
      const path = _getter(_pathAtom)
      return _getter(getRowInfoAtomByPath(path))
    })

    return {
      pathAtom: _pathAtom,
      rowInfoAtom: _rowInfoAtom,
    }
  }, [getRowInfoAtomByPath, rowIndex, showPathListAtom])

  const path = useAtomValue(pathAtom)
  const rowInfo = useAtomValue(rowInfoAtom)
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
