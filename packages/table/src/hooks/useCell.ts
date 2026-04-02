import { useAtomValue, atom, useStore, selectAtom } from '@einfach/react'
import type { CellProps } from '@grid-table/core'
import { useMemo, type CSSProperties } from 'react'
import { useBasic } from '@grid-table/basic'
import { mergeCellStyleMapAtom } from '../plugins/mergeCells/state'
import { areaSelectedTbodyCellSetAtom } from '../plugins/areaSelected/state'

export function useCell({ cellId, rowId, columnId, style, rowIndex }: CellProps) {
  const { getColumnStateAtomById, getCellStateAtomById, getRowStateAtomById } = useBasic()
  const store = useStore()

  const areaSelectedAtom = useMemo(
    () => selectAtom(areaSelectedTbodyCellSetAtom, (set) => set.has(cellId)),
    [cellId],
  )

  const cellInfoAtom = useMemo(() => {
    return atom((getter) => {
      const { style: columnStyle = {}, className: columnCls = [] } = getter(
        getColumnStateAtomById(columnId),
      )

      const { style: selfStyle = {}, className: selfCls = [] } = getter(
        getCellStateAtomById(cellId),
      )

      const { style: rowStyle = {}, className: rowCls = [] } = getter(getRowStateAtomById(rowId))

      // 从 mergeCellStyleMap 读取合并样式（一次 Map.get，无逐 cell setter）
      const mergeStyle = getter(mergeCellStyleMapAtom).get(cellId) || {}

      // 从 areaSelectedTbodyCellSetAtom 读取选中状态（一次 Set.has，无逐 cell setter）
      const isAreaSelected = getter(areaSelectedAtom)

      const clsList = [...Array.from(columnCls), ...Array.from(selfCls), ...Array.from(rowCls)]
      if (isAreaSelected) {
        clsList.push('select-cell-item')
      }

      return {
        style: {
          ...columnStyle,
          ...rowStyle,
          ...selfStyle,
          ...mergeStyle,
        } as CSSProperties,
        className: clsList.join(' '),
      }
    })
  }, [cellId, columnId, getCellStateAtomById, getColumnStateAtomById, areaSelectedAtom])

  const {
    style: stateStyle,
    className: stateClass,
    ...state
  } = useAtomValue(cellInfoAtom, { store })

  return {
    cellId,
    rowId,
    columnId,
    style: {
      ...stateStyle,
      ...style,
    } as CSSProperties,
    className: `${stateClass} ${rowIndex % 2 !== 0 ? 'gird-table-cell-even' : 'gird-table-cell-odd'}`,
    ...state,
  }
}
