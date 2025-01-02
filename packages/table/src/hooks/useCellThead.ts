import { useAtomValue, useStore } from 'einfach-state'
import type { CellProps } from '@grid-table/core'
import { type CSSProperties } from 'react'
import { useBasic } from '@grid-table/basic'

export function useCellThead({ cellId, style, rowId, columnId }: CellProps) {
  const { getColumnStateAtomById, getHeaderCellStateAtomById } = useBasic()
  const store = useStore()

  const { style: columnStyle = {}, className: columnCls = [] } = useAtomValue(
    getColumnStateAtomById(columnId),
    {
      store,
    },
  )

  const { style: selfStyle = {}, className: selfCls = [] } = useAtomValue(
    getHeaderCellStateAtomById(cellId),
  )

  return {
    rowId,
    columnId,
    style: {
      ...style,
      ...columnStyle,
      ...selfStyle,
    } as CSSProperties,
    className: [...Array.from(columnCls), ...Array.from(selfCls)].join(' '),
  }
}
