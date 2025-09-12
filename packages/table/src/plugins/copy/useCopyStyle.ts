import { useEffect } from 'react'
import { useStore } from '@einfach/react'
import { useBasic } from '@grid-table/basic'
import { createCopyBorderStyle } from './copyUtils'
import type { CopyAreas } from './types'

export interface UseCopyStyleProps {
  selectedAreas: CopyAreas
  isShowStyle: boolean
  enable: boolean
}

/**
 * 复制样式处理的 hook
 */
export function useCopyStyle({ selectedAreas, isShowStyle, enable }: UseCopyStyleProps) {
  const store = useStore()
  const { getCellStateAtomById, getTheadCellStateAtomById } = useBasic()

  useEffect(() => {
    if (enable === false || isShowStyle === false) {
      return
    }

    const cancelList: (() => void)[] = []

    // 计算总的行数（用于边框计算）
    const totalRowLength = selectedAreas.cellTheadList.length + selectedAreas.cellTbodyList.length
    let currentRowIndex = 0

    // 处理 thead 单元格样式
    selectedAreas.cellTheadList.forEach((rowCellIds, theadRowIndex) => {
      const columnLength = rowCellIds.length
      rowCellIds.forEach((cellId, columnIndex) => {
        cancelList.push(
          store.setter(getTheadCellStateAtomById(cellId), (_getter, prev) => {
            const nextStyle = createCopyBorderStyle({
              currentRowIndex,
              totalRowLength,
              columnIndex,
              columnLength,
              prevStyle: prev.style || {},
            })

            return {
              ...prev,
              style: nextStyle,
            }
          })!,
        )
      })
      currentRowIndex++
    })

    // 处理 tbody 单元格样式
    selectedAreas.cellTbodyList.forEach((rowCellIds, tbodyRowIndex) => {
      const columnLength = rowCellIds.length
      rowCellIds.forEach((cellId, columnIndex) => {
        cancelList.push(
          store.setter(getCellStateAtomById(cellId), (_getter, prev) => {
            const nextStyle = createCopyBorderStyle({
              currentRowIndex,
              totalRowLength,
              columnIndex,
              columnLength,
              prevStyle: prev.style || {},
            })

            return {
              ...prev,
              style: nextStyle,
            }
          })!,
        )
      })
      currentRowIndex++
    })

    return () => {
      cancelList.forEach((cancel) => {
        cancel()
      })
    }
  }, [selectedAreas, enable, getCellStateAtomById, getTheadCellStateAtomById, isShowStyle, store])
}
