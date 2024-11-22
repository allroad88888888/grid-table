import { useAtomValue, atom, useStore } from 'einfach-state'
import type { CellProps } from '@grid-table/core'
import { useMemo, type CSSProperties } from 'react'

import { getCellId } from '../utils/getCellId'
import { useBasic } from '@grid-table/basic'

export function useCell({ rowIndex, columnIndex, style }: CellProps) {
  const {
    columnIdShowListAtom,
    rowIdShowListAtom,
    getColumnStateAtomById: getColumnStateAtomByIndex,
    getCellStateAtomById,
  } = useBasic()
  const store = useStore()

  const cellInfoAtom = useMemo(() => {
    return atom((getter) => {
      const columnList = getter(columnIdShowListAtom)
      const rowList = getter(rowIdShowListAtom)
      const rowId = rowList[rowIndex]
      const columnId = columnList[columnIndex]
      const cellId = getCellId({
        rowId: rowId,
        columnId: columnId,
      })
      const { style: columnStyle = {}, className: columnCls = [] } = getter(
        getColumnStateAtomByIndex(columnId),
      )

      const { style: selfStyle = {}, className: selfCls = [] } = getter(
        getCellStateAtomById(cellId),
      )

      return {
        rowId,
        columnId,
        cellId,
        // className: '',
        // style: '',
        style: {
          ...columnStyle,
          ...selfStyle,
        } as CSSProperties,
        className: [...Array.from(columnCls), ...Array.from(selfCls)].join(' '),
      }
    })
  }, [
    columnIdShowListAtom,
    columnIndex,
    getCellStateAtomById,
    getColumnStateAtomByIndex,
    rowIdShowListAtom,
    rowIndex,
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
