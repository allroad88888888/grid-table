import { useAtomValue, atom, useStore } from '@einfach/state'
import type { CellProps } from '@grid-table/core'
import { useMemo, type CSSProperties } from 'react'
import { useBasic } from '@grid-table/basic'

export function useCell({ cellId, rowId, columnId, style }: CellProps) {
  const { getColumnStateAtomById: getColumnStateAtomByIndex, getCellStateAtomById } = useBasic()
  const store = useStore()

  const cellInfoAtom = useMemo(() => {
    return atom((getter) => {
      const { style: columnStyle = {}, className: columnCls = [] } = getter(
        getColumnStateAtomByIndex(columnId),
      )

      const { style: selfStyle = {}, className: selfCls = [] } = getter(
        getCellStateAtomById(cellId),
      )

      return {
        style: {
          ...columnStyle,
          ...selfStyle,
        } as CSSProperties,
        className: [...Array.from(columnCls), ...Array.from(selfCls)].join(' '),
      }
    })
  }, [cellId, columnId, getCellStateAtomById, getColumnStateAtomByIndex])

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
