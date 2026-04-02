import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useStore } from '@einfach/react'
import type { CellId } from '@grid-table/basic'
import { createCopyBorderStyle } from './copyUtils'
import { copyCellTbodyStyleMapAtom, copyCellTheadStyleMapAtom } from './state'
import type { CopyAreas } from './types'

export interface UseCopyStyleProps {
  selectedAreas: CopyAreas
  isShowStyle: boolean
  enable: boolean
}

/**
 * 复制样式处理的 hook
 * 批量计算所有 cell 的边框样式写入 Map atom，替代逐 cell setter
 */
export function useCopyStyle({ selectedAreas, isShowStyle, enable }: UseCopyStyleProps) {
  const store = useStore()

  useEffect(() => {
    if (enable === false || isShowStyle === false) {
      return
    }

    const totalRowLength = selectedAreas.cellTheadList.length + selectedAreas.cellTbodyList.length
    let currentRowIndex = 0

    // 批量计算 thead 样式
    const theadMap = new Map<CellId, CSSProperties>()
    selectedAreas.cellTheadList.forEach((rowCellIds) => {
      const columnLength = rowCellIds.length
      rowCellIds.forEach((cellId, columnIndex) => {
        const style = createCopyBorderStyle({
          currentRowIndex,
          totalRowLength,
          columnIndex,
          columnLength,
          prevStyle: {},
        })
        theadMap.set(cellId, style)
      })
      currentRowIndex++
    })

    // 批量计算 tbody 样式
    const tbodyMap = new Map<CellId, CSSProperties>()
    selectedAreas.cellTbodyList.forEach((rowCellIds) => {
      const columnLength = rowCellIds.length
      rowCellIds.forEach((cellId, columnIndex) => {
        const style = createCopyBorderStyle({
          currentRowIndex,
          totalRowLength,
          columnIndex,
          columnLength,
          prevStyle: {},
        })
        tbodyMap.set(cellId, style)
      })
      currentRowIndex++
    })

    // 一次性写入
    store.setter(copyCellTheadStyleMapAtom, theadMap)
    store.setter(copyCellTbodyStyleMapAtom, tbodyMap)

    return () => {
      store.setter(copyCellTheadStyleMapAtom, new Map())
      store.setter(copyCellTbodyStyleMapAtom, new Map())
    }
  }, [selectedAreas, enable, isShowStyle, store])
}
