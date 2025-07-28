import { useAtomValue, atom, useStore } from '@einfach/react'
import type { CellProps } from '@grid-table/core'
import { useMemo, type CSSProperties } from 'react'
import { useBasic } from '@grid-table/basic'

export function useCell({ cellId, rowId, columnId, style }: CellProps) {
  const { getColumnStateAtomById, getCellStateAtomById, getRowStateAtomById } = useBasic()
  const store = useStore()

  const cellInfoAtom = useMemo(() => {
    return atom((getter) => {
      const { style: columnStyle = {}, className: columnCls = [] } = getter(
        getColumnStateAtomById(columnId),
      )

      const { style: selfStyle = {}, className: selfCls = [] } = getter(
        getCellStateAtomById(cellId),
      )

      const { style: rowStyle = {}, className: rowCls = [] } = getter(getRowStateAtomById(rowId))

      return {
        style: {
          ...columnStyle,
          ...selfStyle,
          ...rowStyle,
        } as CSSProperties,
        className: [...Array.from(columnCls), ...Array.from(selfCls), ...Array.from(rowCls)].join(
          ' ',
        ),
      }
    })
  }, [cellId, columnId, getCellStateAtomById, getColumnStateAtomById])

  const { style: stateStyle, ...state } = useAtomValue(cellInfoAtom, { store })

  return {
    cellId,
    rowId,
    columnId,
    style: {
      ...stateStyle,
      ...style,
    } as CSSProperties,
    ...state,
  }
}
