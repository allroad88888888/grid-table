import { useAtomValue, atom } from 'einfach-state'
import type { CellProps } from '@grid-table/core'
import { useMemo, type CSSProperties } from 'react'
import { useBasic } from '../basic'
import { getCellId } from '../utils/getCellId'

export function useCell({ rowIndex, columnIndex, style }: CellProps) {
  const {
    store,
    columnListAtom,
    rowListAtom,
    getColumnStateAtomByIndex,
    getCellStateAtomById,
  } = useBasic()

  const cellInfoAtom = useMemo(() => {
    return atom((getter) => {
      const columnList = getter(columnListAtom)
      const rowList = getter(rowListAtom)
      const gridRowIndex
        = rowList[rowIndex] === undefined ? rowIndex : rowList[rowIndex]
      const gridColumnIndex
        = columnList[columnIndex] === undefined
          ? columnIndex
          : columnList[columnIndex]
      const cellId = getCellId({
        rowIndex: gridRowIndex,
        columnIndex: gridColumnIndex,
      })
      const { style: columnStyle = {}, className: columnCls = [] } = getter(
        getColumnStateAtomByIndex(gridColumnIndex),
      )

      const { style: selfStyle = {}, className: selfCls = [] } = getter(
        getCellStateAtomById(cellId),
      )

      return {
        rowIndex: gridRowIndex,
        columnIndex: gridColumnIndex,
        style: {
          ...columnStyle,
          ...selfStyle,
        } as CSSProperties,
        className: [...Array.from(columnCls), ...Array.from(selfCls)].join(' '),
      }
    })
  }, [
    columnIndex,
    columnListAtom,
    getCellStateAtomById,
    getColumnStateAtomByIndex,
    rowIndex,
    rowListAtom,
  ])

  const { style: stateStyle, ...state } = useAtomValue(cellInfoAtom, { store })

  return {
    style: {
      ...stateStyle,
      ...style,
    } as CSSProperties,
    ...state,
  }
}

export function useTHeadCell({ rowIndex, columnIndex, style }: CellProps) {
  const {
    store,
    columnListAtom,
    getColumnStateAtomByIndex: getColumnStateAtomByIndex,
  } = useBasic()
  const columnList = useAtomValue(columnListAtom, { store })
  const gridColumnIndex
    = columnList[columnIndex] === undefined
      ? columnIndex
      : columnList[columnIndex]
  const { style: columnStyle = {}, className } = useAtomValue(
    getColumnStateAtomByIndex(gridColumnIndex),
    { store },
  )

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
