import { useAtomValue, useStore, selectAtom, atom } from '@einfach/react'
import type { CellProps } from '@grid-table/core'
import { useMemo, type CSSProperties } from 'react'
import { useBasic } from '@grid-table/basic'
import { areaSelectedTheadCellSetAtom } from '../plugins/areaSelected/state'
import { copyCellTheadStyleMapAtom } from '../plugins/copy/state'
import { mergeHeaderCellStyleMapAtom } from '../plugins/mergeCells/state'

export function useCellThead({ cellId, style, rowId, columnId }: CellProps) {
  const { getColumnStateAtomById, getTheadCellStateAtomById } = useBasic()
  const store = useStore()

  const areaSelectedAtom = useMemo(
    () => selectAtom(areaSelectedTheadCellSetAtom, (set) => set.has(cellId)),
    [cellId],
  )

  const cellInfoAtom = useMemo(() => {
    return atom((getter) => {
      const { style: columnStyle = {}, className: columnCls = [] } = getter(
        getColumnStateAtomById(columnId),
      )

      const { style: selfStyle = {}, className: selfCls = [] } = getter(
        getTheadCellStateAtomById(cellId),
      )

      // 从 Map atom 读取样式
      const copyStyle = getter(copyCellTheadStyleMapAtom).get(cellId) || {}
      const mergeStyle = getter(mergeHeaderCellStyleMapAtom).get(cellId) || {}

      const isAreaSelected = getter(areaSelectedAtom)

      const clsList = [...Array.from(columnCls), ...Array.from(selfCls)]
      if (isAreaSelected) {
        clsList.push('select-cell-item')
      }

      return {
        style: {
          ...columnStyle,
          ...selfStyle,
          ...mergeStyle,
          ...copyStyle,
        } as CSSProperties,
        className: clsList.join(' '),
      }
    })
  }, [cellId, columnId, getColumnStateAtomById, getTheadCellStateAtomById, areaSelectedAtom])

  const { style: stateStyle, className: stateClass } = useAtomValue(cellInfoAtom, { store })

  return {
    rowId,
    columnId,
    style: {
      ...style,
      ...stateStyle,
    } as CSSProperties,
    className: stateClass,
  }
}
