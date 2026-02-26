import { useEffect, useRef, useCallback, useMemo } from 'react'
import { useStore } from '@einfach/react'
import { areaIsTouchAtom } from './state'

/**
 * 自动滚动配置
 */
interface AutoScrollConfig {
  /** 边缘触发区域大小 (px) */
  edgeSize: number
  /** 滚动速度 (px/frame) */
  scrollSpeed: number
  /** 最小移动距离，超过此距离才激活自动滚动 (px) */
  minMoveDistance: number
}

const DEFAULT_CONFIG: AutoScrollConfig = {
  edgeSize: 10,
  scrollSpeed: 10,
  minMoveDistance: 20,
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
 *
 * 事件绑定逻辑：
 * 1. 用户在单元格上按下鼠标 → 事件冒泡到容器 → handleContainerMouseDown 触发
 * 2. 记录初始位置，在容器上添加 mousemove 和 mouseup 事件
 * 3. mousemove 时检查移动距离，超过最小距离（minMoveDistance）才激活自动滚动
 * 4. 激活后，鼠标靠近边缘（edgeSize）时自动滚动，使用固定速度（scrollSpeed）
 * 5. 鼠标松开时，移除容器事件，停止滚动
 * 6. 支持多表格场景：每个表格独立管理自己的滚动状态，互不干扰
 */
export function useAutoScrollOnDrag({
  enable = true,
  containerRef,
  config: customConfig,
}: UseAutoScrollOnDragProps) {
  const store = useStore()

  const config = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...customConfig,
    }),
    [customConfig],
  )

  // 存储当前鼠标位置
  const mousePositionRef = useRef({ x: 0, y: 0 })
  // 存储鼠标按下时的初始位置
  const mouseDownPositionRef = useRef({ x: 0, y: 0 })
  // 当前表格是否激活（鼠标在此表格容器内按下并移动超过阈值）
  const isActiveRef = useRef(false)
  // 动画帧 ID
  const rafIdRef = useRef<number | null>(null)
  // 事件处理器引用，用于清理
  const handlersRef = useRef<{
    mousemove: ((e: MouseEvent) => void) | null
    mouseup: (() => void) | null
  }>({
    mousemove: null,
    mouseup: null,
  })

  /**
   * 滚动循环 - 只负责检测边缘并滚动
   */
  const scrollLoop = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      rafIdRef.current = null
      return
    }

    // 只有在当前表格激活且正在拖拽选择时才执行滚动
    const currentIsTouch = store.getter(areaIsTouchAtom)
    if (!isActiveRef.current || !currentIsTouch) {
      rafIdRef.current = requestAnimationFrame(scrollLoop)
      return
    }

    const { x: clientX, y: clientY } = mousePositionRef.current
    const rect = container.getBoundingClientRect()
    const { edgeSize, scrollSpeed } = config

    let scrollX = 0
    let scrollY = 0

    // 获取 thead 高度，滚动区域从 tbody 开始
    const thead = container.querySelector('[role="thead"]')
    const theadHeight = thead?.getBoundingClientRect().height || 0
    const tbodyTop = rect.top + theadHeight

    // 水平方向：固定速度
    if (clientX < rect.left + edgeSize) {
      scrollX = -scrollSpeed
    } else if (clientX > rect.right - edgeSize) {
      scrollX = scrollSpeed
    }

    // 垂直方向：固定速度
    if (clientY < tbodyTop + edgeSize && clientY >= rect.top) {
      scrollY = -scrollSpeed
    } else if (clientY > rect.bottom - edgeSize) {
      scrollY = scrollSpeed
    }

    if (scrollX !== 0 || scrollY !== 0) {
      container.scrollBy({ left: scrollX, top: scrollY })
    }

    rafIdRef.current = requestAnimationFrame(scrollLoop)
  }, [containerRef, config, store])

  /**
   * 停止滚动
   */
  const stopScroll = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [])

  /**
   * 移除容器上的事件监听
   */
  const removeDocumentListeners = useCallback(() => {
    if (handlersRef.current.mousemove) {
      containerRef.current?.removeEventListener('mousemove', handlersRef.current.mousemove)
      handlersRef.current.mousemove = null
    }
    if (handlersRef.current.mouseup) {
      containerRef.current?.removeEventListener('mouseup', handlersRef.current.mouseup)
      handlersRef.current.mouseup = null
    }
  }, [containerRef])

  /**
   * 处理鼠标移动
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }

      if (!isActiveRef.current) {
        const deltaX = e.clientX - mouseDownPositionRef.current.x
        const deltaY = e.clientY - mouseDownPositionRef.current.y
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        if (distance >= config.minMoveDistance) {
          isActiveRef.current = true
        }
      }
    },
    [config.minMoveDistance],
  )

  /**
   * 处理鼠标松开
   */
  const handleMouseUp = useCallback(() => {
    isActiveRef.current = false
    removeDocumentListeners()
  }, [removeDocumentListeners])

  /**
   * 处理容器上的鼠标按下（事件冒泡捕获单元格点击）
   */
  const handleContainerMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return

      isActiveRef.current = false
      mouseDownPositionRef.current = { x: e.clientX, y: e.clientY }
      mousePositionRef.current = { x: e.clientX, y: e.clientY }

      removeDocumentListeners()

      handlersRef.current.mousemove = handleMouseMove
      handlersRef.current.mouseup = handleMouseUp
      containerRef.current?.addEventListener('mousemove', handleMouseMove)
      containerRef.current?.addEventListener('mouseup', handleMouseUp)
    },
    [handleMouseMove, handleMouseUp, removeDocumentListeners, containerRef],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!enable || !container) {
      stopScroll()
      isActiveRef.current = false
      removeDocumentListeners()
      return
    }

    container.addEventListener('mousedown', handleContainerMouseDown)
    rafIdRef.current = requestAnimationFrame(scrollLoop)

    return () => {
      container.removeEventListener('mousedown', handleContainerMouseDown)
      removeDocumentListeners()
      stopScroll()
      isActiveRef.current = false
    }
  }, [enable, handleContainerMouseDown, scrollLoop, stopScroll, removeDocumentListeners])
}
