import { useAtomValue } from 'einfach-state'
import type { CellProps } from '@grid-table/core'
import type { CSSProperties } from 'react'
import { useBasic } from '../basic'

export function useCell({ rowIndex, columnIndex, style }: CellProps) {
  const { store, columnListAtom, rowListAtom,
    getCellStateAtomByIndex } = useBasic()
  const columnList = useAtomValue(columnListAtom, { store })
  const rowList = useAtomValue(rowListAtom, { store })
  const gridRowIndex = rowList[rowIndex]
  const gridColumnIndex = columnList[columnIndex]
  const { style: columnStyle = {}, className } = useAtomValue(
    getCellStateAtomByIndex(gridColumnIndex), { store })

  return {
    rowIndex: gridRowIndex,
    columnIndex: gridColumnIndex,
    style: {
      ...style,
      ...columnStyle,
    } as CSSProperties,
    className: className ? Array.from(className).join(' ') : '',
  }
}

export function useTHeadCell({ rowIndex, columnIndex, style }: CellProps) {
  const { store, columnListAtom,
    getCellStateAtomByIndex: getColumnStateAtomByIndex } = useBasic()
  const columnList = useAtomValue(columnListAtom, { store })
  const gridColumnIndex = columnList[columnIndex]
  const { style: columnStyle = {}, className } = useAtomValue(
    getColumnStateAtomByIndex(gridColumnIndex), { store })

  return {
    rowIndex,
    columnIndex: gridColumnIndex,
    style: {
      ...style,
      ...columnStyle,
    } as CSSProperties,
    className: className ? Array.from(className).join(' ') : '',
  }
}
