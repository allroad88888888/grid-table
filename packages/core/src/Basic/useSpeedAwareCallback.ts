import { useCallback, useRef } from 'react'

export interface UseSpeedAwareCallbackOptions {
  /**
   * 速度阈值（px/s）
   * 超过此速度时延迟执行，低于此速度时立即执行
   * @default 800
   */
  speedThreshold?: number
  /**
   * 滚动停止/减速后的等待时间（ms）
   * @default 150
   */
  idleDelay?: number
  /**
   * 滚动方向，用于确定使用哪个滚动偏移量
   * @default 'row'
   */
  direction?: 'row' | 'column'
}

/**
 * 速度感知回调 Hook
 * 
 * 根据滚动速度智能决定回调执行时机：
 * - 慢速滚动：立即执行回调
 * - 快速滚动：延迟执行，只保留最新的回调
 * 
 * @example
 * ```tsx
 * const speedAwareCallback = useSpeedAwareCallback(() => {
 *   // 渲染逻辑
 *   doRender()
 * }, { speedThreshold: 800, idleDelay: 150 })
 * 
 * const onScroll = (event) => {
 *   // 更新状态
 *   updateScrollState(event)
 *   // 使用速度感知的回调
 *   speedAwareCallback(event)
 * }
 * ```
 */
export function useSpeedAwareCallback(
  callback: () => void,
  options: UseSpeedAwareCallbackOptions = {}
) {
  const { speedThreshold = 800, idleDelay = 150, direction = 'row' } = options

  // 滚动速度计算相关
  const lastScrollRef = useRef<{ offset: number; time: number } | null>(null)
  const currentSpeedRef = useRef(0)
  // 延迟执行的定时器
  const pendingTimerRef = useRef<NodeJS.Timeout | null>(null)
  // requestAnimationFrame ID
  const rafIdRef = useRef<number | null>(null)

  const speedAwareCallback = useCallback(
    (event: Event) => {
      const { scrollTop, scrollLeft } = event.currentTarget as Element

      // 计算滚动速度
      const now = performance.now()
      const currentOffset = direction === 'row' ? scrollTop : scrollLeft
      const last = lastScrollRef.current

      if (last) {
        const deltaOffset = Math.abs(currentOffset - last.offset)
        const deltaTime = now - last.time

        if (deltaTime > 0) {
          // 计算速度 (px/s)，使用指数移动平均平滑
          const newSpeed = (deltaOffset / deltaTime) * 1000
          currentSpeedRef.current = currentSpeedRef.current * 0.3 + newSpeed * 0.7
        }
      }

      lastScrollRef.current = { offset: currentOffset, time: now }

      // 根据速度决定执行策略
      const speed = currentSpeedRef.current
      const isFastScrolling = speed > speedThreshold

      // 取消之前的任务
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current)
        pendingTimerRef.current = null
      }

      if (isFastScrolling) {
        // 快速滚动：延迟后在下一帧执行
        pendingTimerRef.current = setTimeout(() => {
          pendingTimerRef.current = null
          rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null
            callback()
          })
        }, idleDelay)
      } else {
        // 慢速滚动：在下一帧立即执行
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null
          callback()
        })
      }
    },
    [callback, direction, speedThreshold, idleDelay]
  )

  return speedAwareCallback
}
