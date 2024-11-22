import { useAtomValue, useStore } from 'einfach-state'
import type { CellProps } from '@grid-table/core'
import { type CSSProperties } from 'react'
import { getCellId } from '../utils/getCellId'
import { useBasic } from '@grid-table/basic'
import { getHeaderRowId } from '../utils'

export function useCellThead({ rowIndex, columnIndex, style }: CellProps) {
  const {
    columnIdShowListAtom,
    rowIdShowListAtom,
    getColumnStateAtomById,
    getHeaderCellStateAtomById,
  } = useBasic()
  const store = useStore()

  const columnList = useAtomValue(columnIdShowListAtom, { store })
  const rowList = useAtomValue(rowIdShowListAtom, { store })
  const columnId: string = columnList[columnIndex]
  const { style: columnStyle = {}, className: columnCls = [] } = useAtomValue(
    getColumnStateAtomById(columnId),
    {
      store,
    },
  )

  const cellId = getCellId({
    rowId: getHeaderRowId(rowIndex),
    columnId: columnId,
  })

  const { style: selfStyle = {}, className: selfCls = [] } = useAtomValue(
    getHeaderCellStateAtomById(cellId),
  )

  return {
    rowId: rowList[rowIndex],
    columnId,
    style: {
      ...style,
      ...columnStyle,
      ...selfStyle,
    } as CSSProperties,
    className: [...Array.from(columnCls), ...Array.from(selfCls)].join(' '),
  }
}
