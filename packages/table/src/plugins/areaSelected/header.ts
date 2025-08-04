import { atom } from '@einfach/react'
import { basicAtom, headerLastIdAtom } from '@grid-table/basic'
import { areaColumnIdsAtom } from './state'
import { getCellId } from '../../utils/getCellId'

/**
 * 专门负责应用表头样式的 setter atom
 * 消费 headerLastRowsCssAtom 的数据，执行样式应用逻辑
 */
export const applyHeaderStyleAtom = atom(null, (getter, setter) => {
  const { getHeaderCellStateAtomById } = getter(basicAtom)

  const selectedColumnIds = getter(areaColumnIdsAtom)
  const lastHeaderRowId = getter(headerLastIdAtom)

  if (selectedColumnIds.length === 0 || !lastHeaderRowId || !getHeaderCellStateAtomById) {
    return () => {}
  }

  const cancelList: (() => void)[] = []

  // 为每个被选中的列的最后一行表头单元格添加样式
  selectedColumnIds.forEach((columnId) => {
    const cellId = getCellId({
      rowId: lastHeaderRowId,
      columnId: columnId,
    })

    const cancel = setter(getHeaderCellStateAtomById(cellId), (getter, prev) => {
      const nextStyle = {
        ...prev.style,
        borderBottomColor: 'var(--grid-area-selected-color,#1890ff)',
        borderBottomStyle: 'solid' as const,
      }

      return {
        ...prev,
        style: nextStyle,
      }
    })

    if (cancel) {
      cancelList.push(cancel)
    }
  })

  // 返回清理函数
  return () => {
    cancelList.forEach((cancel) => {
      cancel()
    })
  }
})
