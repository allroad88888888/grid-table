import { useEffect, useRef, useCallback } from 'react'
import { useStore, useAtomValue } from '@einfach/react'
import { areaIsTouchAtom } from './state'

/**
 * 自动滚动配置
 */
interface AutoScrollConfig {
  /** 边缘触发区域大小 (px) */
  edgeSize: number
  /** 最大滚动速度 (px/frame) */
  maxSpeed: number
  /** 最小滚动速度 (px/frame) */
  minSpeed: number
}

const DEFAULT_CONFIG: AutoScrollConfig = {
  edgeSize: 50,
  maxSpeed: 20,
  minSpeed: 2,
}

/**
 * 计算滚动速度，距离边缘越近速度越快
 */
function calculateScrollSpeed(
  distance: number,
  edgeSize: number,
  minSpeed: number,
  maxSpeed: number,
): number {
  if (distance >= edgeSize) return 0
  if (distance <= 0) return maxSpeed
  // 距离边缘越近，速度越快（线性插值）
  const ratio = 1 - distance / edgeSize
  return minSpeed + ratio * (maxSpeed - minSpeed)
}

export interface UseAutoScrollOnDragProps {
  /** 是否启用 */
  enable?: boolean
  /** 表格容器的 ref */
  containerRef: React.RefObject<HTMLDivElement>
  /** 自动滚动配置 */
  config?: Partial<AutoScrollConfig>
}

/**
 * 拖拽选择时自动滚动的 hook
 * 只负责检测边缘 + 触发滚动，选区更新由 onMouseEnter 机制处理
 */
export function useAutoScrollOnDrag({
  enable = true,
  containerRef,
  config: customConfig,
}: UseAutoScrollOnDragProps) {
  const store = useStore()
  const isTouch = useAtomValue(areaIsTouchAtom, { store })

  const config = { ...DEFAULT_CONFIG, ...customConfig }

  // 存储当前鼠标位置
  const mousePositionRef = useRef({ x: 0, y: 0 })
  // 动画帧 ID
  const rafIdRef = useRef<number | null>(null)

  /**
   * 滚动循环 - 只负责检测边缘并滚动
   */
  const scrollLoop = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      rafIdRef.current = requestAnimationFrame(scrollLoop)
      return
    }

    const { x: clientX, y: clientY } = mousePositionRef.current
    const rect = container.getBoundingClientRect()
    const { edgeSize, minSpeed, maxSpeed } = config

    // 计算各方向的滚动速度
    let scrollX = 0
    let scrollY = 0

    // 获取 thead 高度，滚动区域从 tbody 开始
    const thead = container.querySelector('[role="thead"]')
    const theadHeight = thead?.getBoundingClientRect().height || 0
    const tbodyTop = rect.top + theadHeight

    // 水平方向
    if (clientX < rect.left + edgeSize && clientX >= rect.left) {
      // 左边缘内
      const distance = clientX - rect.left
      scrollX = -calculateScrollSpeed(distance, edgeSize, minSpeed, maxSpeed)
    } else if (clientX < rect.left) {
      // 左边缘外
      scrollX = -maxSpeed
    } else if (clientX > rect.right - edgeSize && clientX <= rect.right) {
      // 右边缘内
      const distance = rect.right - clientX
      scrollX = calculateScrollSpeed(distance, edgeSize, minSpeed, maxSpeed)
    } else if (clientX > rect.right) {
      // 右边缘外
      scrollX = maxSpeed
    }

    // 垂直方向
    if (clientY < tbodyTop + edgeSize && clientY >= tbodyTop) {
      // 上边缘内
      const distance = clientY - tbodyTop
      scrollY = -calculateScrollSpeed(distance, edgeSize, minSpeed, maxSpeed)
    } else if (clientY < tbodyTop && clientY >= rect.top) {
      // 上边缘外（但在表头内）
      scrollY = -maxSpeed
    } else if (clientY > rect.bottom - edgeSize && clientY <= rect.bottom) {
      // 下边缘内
      const distance = rect.bottom - clientY
      scrollY = calculateScrollSpeed(distance, edgeSize, minSpeed, maxSpeed)
    } else if (clientY > rect.bottom) {
      // 下边缘外
      scrollY = maxSpeed
    }

    // 执行滚动
    if (scrollX !== 0 || scrollY !== 0) {
      container.scrollBy({
        left: scrollX,
        top: scrollY,
      })
    }

    rafIdRef.current = requestAnimationFrame(scrollLoop)
  }, [containerRef, config])

  /**
   * 处理鼠标移动
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  /**
   * 停止滚动
   */
  const stopScroll = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [])

  // 监听拖拽状态
  useEffect(() => {
    if (!enable || !isTouch) {
      stopScroll()
      return
    }

    // 开始监听鼠标移动
    document.addEventListener('mousemove', handleMouseMove)

    // 启动滚动循环
    rafIdRef.current = requestAnimationFrame(scrollLoop)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      stopScroll()
    }
  }, [enable, isTouch, handleMouseMove, scrollLoop, stopScroll])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopScroll()
    }
  }, [stopScroll])
}
