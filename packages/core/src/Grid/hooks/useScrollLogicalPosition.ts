import type { ScrollLogicalPosition } from '../type'

interface CalculateScrollPositionOptions {
  elementPosition: number
  elementSize: number
  containerSize: number
  currentScrollPosition: number
  logicalPosition: ScrollLogicalPosition
}

/**
 * 计算基于 ScrollLogicalPosition 的滚动位置
 */
export function calculateScrollPosition(options: CalculateScrollPositionOptions): number {
  const { elementPosition, elementSize, containerSize, currentScrollPosition, logicalPosition } =
    options

  switch (logicalPosition) {
    case 'start':
      return elementPosition

    case 'center':
      return elementPosition - (containerSize - elementSize) / 2

    case 'end':
      return elementPosition - (containerSize - elementSize)

    case 'nearest': {
      const elementEnd = elementPosition + elementSize
      const viewportStart = currentScrollPosition
      const viewportEnd = currentScrollPosition + containerSize

      // 如果元素已经在视口内，不需要滚动
      if (elementPosition >= viewportStart && elementEnd <= viewportEnd) {
        return currentScrollPosition
      }

      // 计算到上边界和下边界的距离，选择最小的
      const distanceToStart = Math.abs(elementPosition - viewportStart)
      const distanceToEnd = Math.abs(elementEnd - viewportEnd)

      if (distanceToStart <= distanceToEnd) {
        return elementPosition // 对齐到开始位置
      } else {
        return elementPosition - (containerSize - elementSize) // 对齐到结束位置
      }
    }

    default:
      return elementPosition
  }
}

/**
 * 计算基于像素坐标和 ScrollLogicalPosition 的滚动位置
 */
export function calculateScrollPositionFromPixel(
  pixelPosition: number,
  containerSize: number,
  logicalPosition: ScrollLogicalPosition,
): number {
  switch (logicalPosition) {
    case 'start':
      return pixelPosition

    case 'center':
      return pixelPosition - containerSize / 2

    case 'end':
      return pixelPosition - containerSize

    case 'nearest':
      // 对于 nearest，保持原有的像素值
      return pixelPosition

    default:
      return pixelPosition
  }
}
