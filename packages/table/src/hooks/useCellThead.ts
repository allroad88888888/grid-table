import { useAtomValue, useStore, selectAtom } from '@einfach/react'
import type { CellProps } from '@grid-table/core'
import { useMemo, type CSSProperties } from 'react'
import { useBasic } from '@grid-table/basic'
import { areaSelectedTheadCellSetAtom } from '../plugins/areaSelected/state'

export function useCellThead({ cellId, style, rowId, columnId }: CellProps) {
  const { getColumnStateAtomById, getTheadCellStateAtomById } = useBasic()
  const store = useStore()

  const { style: columnStyle = {}, className: columnCls = [] } = useAtomValue(
    getColumnStateAtomById(columnId),
    {
      store,
    },
  )

  const { style: selfStyle = {}, className: selfCls = [] } = useAtomValue(
    getTheadCellStateAtomById(cellId),
  )

  const areaSelectedAtom = useMemo(
    () => selectAtom(areaSelectedTheadCellSetAtom, (set) => set.has(cellId)),
    [cellId],
  )
  const isAreaSelected = useAtomValue(areaSelectedAtom, { store })

  const clsList = [...Array.from(columnCls), ...Array.from(selfCls)]
  if (isAreaSelected) {
    clsList.push('select-cell-item')
  }

  return {
    rowId,
    columnId,
    style: {
      ...style,
      ...columnStyle,
      ...selfStyle,
    } as CSSProperties,
    className: clsList.join(' '),
  }
}
