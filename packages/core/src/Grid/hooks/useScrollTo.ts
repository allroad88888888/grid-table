import { useCallback } from 'react'
import type { ScrollLogicalPosition } from '../type'
import {
  calculateScrollPosition,
  calculateScrollPositionFromPixel,
} from './useScrollLogicalPosition'

interface UseScrollToOptions {
  containerWidth: number
  containerHeight: number
  rowSizeList: number[]
  columnSizeList: number[]
}

interface ScrollToOptions {
  behavior?: ScrollBehavior
  rowLogicalPosition?: ScrollLogicalPosition
  columnLogicalPosition?: ScrollLogicalPosition
}

interface ScrollOptions {
  behavior?: ScrollBehavior
  leftLogicalPosition?: ScrollLogicalPosition
  rightLogicalPosition?: ScrollLogicalPosition
}

export function useScrollTo(ref: React.RefObject<HTMLElement>, options: UseScrollToOptions) {
  const { containerWidth, containerHeight, rowSizeList, columnSizeList } = options

  const scrollTo = useCallback(
    (rowIndex: number, columnIndex: number, scrollOptions: ScrollToOptions = {}) => {
      if (
        !ref.current ||
        rowIndex < 0 ||
        rowIndex >= rowSizeList.length - 1 ||
        columnIndex < 0 ||
        columnIndex >= columnSizeList.length - 1
      )
        return

      const {
        behavior,
        rowLogicalPosition = 'start',
        columnLogicalPosition = 'start',
      } = scrollOptions

      const elementTop = rowSizeList[rowIndex]
      const elementLeft = columnSizeList[columnIndex]
      const rowSize = rowSizeList[rowIndex + 1] - rowSizeList[rowIndex]
      const columnSize = columnSizeList[columnIndex + 1] - columnSizeList[columnIndex]

      // 计算垂直滚动位置
      const scrollTop = calculateScrollPosition({
        elementPosition: elementTop,
        elementSize: rowSize,
        containerSize: containerHeight,
        currentScrollPosition: ref.current.scrollTop,
        logicalPosition: rowLogicalPosition,
      })

      // 计算水平滚动位置
      const scrollLeft = calculateScrollPosition({
        elementPosition: elementLeft,
        elementSize: columnSize,
        containerSize: containerWidth,
        currentScrollPosition: ref.current.scrollLeft,
        logicalPosition: columnLogicalPosition,
      })

      ref.current.scrollTo({
        top: Math.max(0, scrollTop),
        left: Math.max(0, scrollLeft),
        behavior,
      })
    },
    [ref, containerWidth, containerHeight, rowSizeList, columnSizeList],
  )

  const scroll = useCallback(
    (left?: number, top?: number, scrollOptions: ScrollOptions = {}) => {
      if (!ref.current) return

      const {
        behavior,
        leftLogicalPosition = 'start',
        rightLogicalPosition = 'start',
      } = scrollOptions

      // 如果提供了精确的像素坐标
      if (top !== undefined || left !== undefined) {
        let scrollTop = top ?? ref.current.scrollTop
        let scrollLeft = left ?? ref.current.scrollLeft

        // 调整垂直滚动位置（使用rightLogicalPosition）
        if (top !== undefined && rightLogicalPosition !== 'start') {
          scrollTop = calculateScrollPositionFromPixel(top, containerHeight, rightLogicalPosition)
        }

        // 调整水平滚动位置（使用leftLogicalPosition）
        if (left !== undefined && leftLogicalPosition !== 'start') {
          scrollLeft = calculateScrollPositionFromPixel(left, containerWidth, leftLogicalPosition)
        }

        ref.current.scrollTo({
          top: Math.max(0, scrollTop),
          left: Math.max(0, scrollLeft),
          behavior,
        })
      }
    },
    [ref, containerWidth, containerHeight],
  )

  return { scrollTo, scroll }
}
