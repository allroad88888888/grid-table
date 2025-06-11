export function createNeverResolvingPromise<T = never>(
  signal?: AbortSignal,
  timeoutMs?: number,
): Promise<T> {
  return new Promise<T>((_, reject) => {
    let timeoutId: NodeJS.Timeout | undefined

    // 如果提供了超时时间，设置超时
    if (timeoutMs && timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        reject(new Error(`Promise 超时：${timeoutMs}ms`))
      }, timeoutMs)
    }

    // 如果提供了AbortSignal，监听取消事件
    if (signal) {
      // 如果signal已经被取消，立即reject
      if (signal.aborted) {
        if (timeoutId) clearTimeout(timeoutId)
        reject(new Error('Promise 已被取消'))
        return
      }

      // 监听取消事件
      const abortHandler = () => {
        if (timeoutId) clearTimeout(timeoutId)
        reject(new Error('Promise 已被取消'))
      }

      signal.addEventListener('abort', abortHandler, { once: true })
    }
  })
}
