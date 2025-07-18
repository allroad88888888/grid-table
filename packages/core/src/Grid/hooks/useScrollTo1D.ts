import { useCallback } from 'react'
import type { ScrollLogicalPosition } from '../type'
import {
  calculateScrollPosition,
  calculateScrollPositionFromPixel,
} from './useScrollLogicalPosition'

interface UseScrollTo1DOptions {
  containerHeight: number
  sizeList: number[]
}

interface ScrollTo1DOptions {
  behavior?: ScrollBehavior
  logicalPosition?: ScrollLogicalPosition
}

interface Scroll1DOptions {
  behavior?: ScrollBehavior
  leftLogicalPosition?: ScrollLogicalPosition
  rightLogicalPosition?: ScrollLogicalPosition
}

export function useScrollTo1D(ref: React.RefObject<HTMLElement>, options: UseScrollTo1DOptions) {
  const { containerHeight, sizeList } = options

  const scrollTo = useCallback(
    (index: number, scrollOptions: ScrollTo1DOptions = {}) => {
      if (!ref.current || index < 0 || index >= sizeList.length - 1) return

      const { behavior, logicalPosition = 'start' } = scrollOptions

      const elementTop = sizeList[index]
      const elementSize = sizeList[index + 1] - sizeList[index]

      const scrollTop = calculateScrollPosition({
        elementPosition: elementTop,
        elementSize,
        containerSize: containerHeight,
        currentScrollPosition: ref.current.scrollTop,
        logicalPosition,
      })

      // 如果是 nearest 且元素已经在视口内，不需要滚动
      if (logicalPosition === 'nearest' && scrollTop === ref.current.scrollTop) {
        return
      }

      ref.current.scrollTo({
        top: Math.max(0, scrollTop),
        behavior,
      })
    },
    [ref, containerHeight, sizeList],
  )

  const scroll = useCallback(
    (left?: number, top?: number, scrollOptions: Scroll1DOptions = {}) => {
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

        // 如果有leftLogicalPosition（控制水平位置），基于left调整
        if (left !== undefined && leftLogicalPosition !== 'start') {
          const containerWidth = ref.current.clientWidth
          scrollLeft = calculateScrollPositionFromPixel(left, containerWidth, leftLogicalPosition)
        }

        // 如果有rightLogicalPosition（控制垂直位置），基于top调整
        if (top !== undefined && rightLogicalPosition !== 'start') {
          scrollTop = calculateScrollPositionFromPixel(top, containerHeight, rightLogicalPosition)
        }

        ref.current.scrollTo({
          top: Math.max(0, scrollTop),
          left: Math.max(0, scrollLeft),
          behavior,
        })
      }
    },
    [ref, containerHeight],
  )

  return { scrollTo, scroll }
}
