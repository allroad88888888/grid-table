/**
 * 使用 AbortController 实现的现代防抖函数
 * 相比传统setTimeout方式，可以更好地处理清理和取消
 */
export function modernDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): T & { cancel: () => void } {
  let abortController: AbortController | null = null

  const debouncedFn = (...args: Parameters<T>) => {
    // 取消之前的调用
    if (abortController) {
      abortController.abort()
    }

    // 创建新的控制器
    abortController = new AbortController()
    const { signal } = abortController

    // 使用 setTimeout 配合 AbortSignal
    const timeoutId = setTimeout(() => {
      if (!signal.aborted) {
        fn(...args)
      }
    }, delay)

    // 监听取消信号
    signal.addEventListener('abort', () => {
      clearTimeout(timeoutId)
    })
  }

  // 添加手动取消方法
  debouncedFn.cancel = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  return debouncedFn as T & { cancel: () => void }
}

/**
 * 使用 Promise + AbortController 实现的异步防抖
 * 适用于异步操作的防抖
 */
export function modernAsyncDebounce<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number,
): T & { cancel: () => void } {
  let abortController: AbortController | null = null

  const debouncedFn = async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    // 取消之前的调用
    if (abortController) {
      abortController.abort()
    }

    // 创建新的控制器
    abortController = new AbortController()
    const { signal } = abortController

    // 等待延迟
    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(resolve, delay)

      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId)
        reject(new DOMException('Debounced call was aborted', 'AbortError'))
      })
    })

    // 如果没有被取消，执行函数
    if (!signal.aborted) {
      return await fn(...args)
    }

    throw new DOMException('Debounced call was aborted', 'AbortError')
  }

  debouncedFn.cancel = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  return debouncedFn as T & { cancel: () => void }
}

/**
 * 使用 requestIdleCallback 实现的智能节流
 * 在浏览器空闲时执行，性能更好
 */
export function idleThrottle<T extends (...args: any[]) => any>(
  fn: T,
  options?: IdleRequestOptions,
): T & { cancel: () => void } {
  let idleId: number | null = null
  let lastArgs: Parameters<T> | null = null

  const throttledFn = (...args: Parameters<T>) => {
    lastArgs = args

    if (idleId === null) {
      idleId = requestIdleCallback(() => {
        if (lastArgs) {
          fn(...lastArgs)
          lastArgs = null
        }
        idleId = null
      }, options)
    }
  }

  throttledFn.cancel = () => {
    if (idleId !== null) {
      cancelIdleCallback(idleId)
      idleId = null
      lastArgs = null
    }
  }

  return throttledFn as T & { cancel: () => void }
}
