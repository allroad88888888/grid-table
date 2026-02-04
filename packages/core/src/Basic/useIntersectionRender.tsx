import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useTransition } from './useTransition'

export type IntersectionObserverConfig = {
  /**
   * 是否启用 IntersectionObserver 延迟渲染
   * @default true
   */
  enabled?: boolean
  /**
   * IntersectionObserver 的 root 元素
   * @default null (viewport)
   */
  root?: Element | null
  /**
   * rootMargin，用于提前触发渲染
   * @default '1px'
   */
  rootMargin?: string
  /**
   * 交叉阈值
   * @default 0
   */
  threshold?: number | number[]
}

// IntersectionObserver 管理器类（每个表格一个实例）
export class IntersectionObserverManager {
  private observer: IntersectionObserver | null = null
  private callbacks: Map<Element, (isIntersecting: boolean) => void> = new Map()
  private config: Required<IntersectionObserverConfig>

  constructor(config: IntersectionObserverConfig = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      root: config.root ?? null,
      rootMargin: config.rootMargin ?? '1px',
      threshold: config.threshold ?? 0,
    }
  }

  isEnabled(): boolean {
    return this.config.enabled
  }

  private ensureObserver() {
    if (!this.observer) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const callback = this.callbacks.get(entry.target)
            if (callback) {
              callback(entry.isIntersecting)
            }
          })
        },
        {
          root: this.config.root,
          rootMargin: this.config.rootMargin,
          threshold: this.config.threshold,
        }
      )
    }
    return this.observer
  }

  observe(element: Element, callback: (isIntersecting: boolean) => void) {
    const observer = this.ensureObserver()

    // 注册回调
    this.callbacks.set(element, callback)

    // 开始观察
    observer.observe(element)

    // 返回清理函数
    return () => {
      this.callbacks.delete(element)
      observer.unobserve(element)
    }
  }

  cleanup() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.callbacks.clear()
  }
}

// Context 用于在表格内部共享 manager 实例
const IntersectionObserverManagerContext = createContext<IntersectionObserverManager | null>(null)

/**
 * Provider 组件，用于在表格级别提供 IntersectionObserverManager 实例
 * 
 * @example
 * ```tsx
 * <IntersectionObserverProvider enabled={true} rootMargin="1px" threshold={0}>
 *   <YourTable />
 * </IntersectionObserverProvider>
 * ```
 */
export function IntersectionObserverProvider({
  children,
  enabled = true,
  root,
  rootMargin = '1px',
  threshold = 0,
}: {
  children: React.ReactNode
} & IntersectionObserverConfig) {
  const manager = useMemo(
    () => new IntersectionObserverManager({ enabled, root, rootMargin, threshold }),
    [enabled, root, rootMargin, threshold]
  )

  useEffect(() => {
    return () => {
      // 表格卸载时清理所有 observers
      manager.cleanup()
    }
  }, [manager])

  return (
    <IntersectionObserverManagerContext.Provider value={manager}>
      {children}
    </IntersectionObserverManagerContext.Provider>
  )
}

// 全局默认单例（用于没有 Provider 的场景）
const defaultManager = new IntersectionObserverManager()

/**
 * 使用 IntersectionObserver + startTransition 实现延迟渲染
 * 
 * 性能优化特性：
 * - 通过 Context 共享 IntersectionObserver 实例，每个表格独立管理
 * - 所有 cell 使用相同的配置，真正共享同一个 observer 实例
 * - 渲染完成后自动取消监听，释放资源
 * - startTransition 低优先级渲染，不阻塞用户交互
 * 
 * @example
 * ```tsx
 * // 在表格外层包裹 Provider
 * <IntersectionObserverProvider enabled={true} rootMargin="1px" threshold={0}>
 *   <YourTable />
 * </IntersectionObserverProvider>
 * 
 * // 在组件内使用
 * if (hasHeavyComponent) {
 *   const { ref, shouldRender } = useIntersectionRender()
 *   return (
 *     <div ref={ref}>
 *       {shouldRender ? <HeavyComponent /> : null}
 *     </div>
 *   )
 * }
 * ```
 */
export function useIntersectionRender<T extends Element = HTMLDivElement>() {
  const [shouldRender, setShouldRender] = useState(false)
  const [, startTransition] = useTransition()
  const elementRef = useRef<T>(null)
  
  // 从 Context 获取 manager，如果没有则使用默认单例
  const manager = useContext(IntersectionObserverManagerContext) || defaultManager
  
  // 检查全局 enabled 状态
  const enabled = manager.isEnabled()
  
  // 保存 cleanup 函数，用于渲染后取消监听
  const cleanupRef = useRef<(() => void) | null>(null)

  const handleIntersection = useCallback((isIntersecting: boolean) => {
    if (isIntersecting) {
      // 使用 startTransition 低优先级渲染
      startTransition(() => {
        setShouldRender(true)
        
        // 渲染完成后，立即取消监听，释放资源
        if (cleanupRef.current) {
          cleanupRef.current()
          cleanupRef.current = null
        }
      })
    }
  }, [startTransition])

  useEffect(() => {
    // 如果全局禁用，直接渲染
    if (!enabled) {
      setShouldRender(true)
      return
    }

    const element = elementRef.current
    if (!element) {
      return
    }

    // 使用表格专属的 manager（配置已在 Provider 层面设置）
    const cleanup = manager.observe(element, handleIntersection)

    // 保存 cleanup 函数
    cleanupRef.current = cleanup

    return () => {
      // 组件卸载时清理
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [enabled, handleIntersection, manager])

  return {
    ref: elementRef,
    shouldRender,
    isPending: !shouldRender && enabled,
  }
}
