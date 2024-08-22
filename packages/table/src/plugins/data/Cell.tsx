import type { CellProps } from '@grid-table/core'
import { useCell, useCellEvents } from '../../hooks'
import { useData } from './useData'
import { useAtomValue } from 'einfach-state'
import { getCellId } from '../../utils/getCellId'
import { useMemo } from 'react'

export function DataCell(props: CellProps) {
  const { rowIndex, columnIndex, style } = useCell(props)
  const events = useCellEvents({
    rowIndex,
    columnIndex,
  })

  const { getRowInfoByRowId, getCellInfoByCellId, getColumnOptionAtomByColId } = useData()
  if (!(typeof getRowInfoByRowId === 'function')) {
    debugger
  }
  const rowInfo = useAtomValue(getRowInfoByRowId(rowIndex.toString()))
  const columnOption = useAtomValue(getColumnOptionAtomByColId(columnIndex))

  const cellId = getCellId({
    rowIndex,
    columnIndex,
  })

  const cellVal = useAtomValue(getCellInfoByCellId(cellId))

  const { render } = columnOption
  const children = useMemo(() => {
    if (render) {
      return render(cellVal, rowInfo as unknown as Record<string, any>)
    }
    return cellVal
  }, [cellVal, render, rowInfo])

  return (
    <div style={style} className="grid-table-cell" {...events}>
      {children}
    </div>
  )
}
