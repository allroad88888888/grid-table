import { useCallback, useRef } from 'react'

/**
 * 基于 WeakMap<fn, Map<key, result>> 的缓存包装器
 * 当 fn 引用变化时，旧缓存自动失效（WeakMap 的 fn 无引用后被 GC）
 * @param fn 计算函数
 * @param getKey 根据参数生成缓存 key
 */
export function useMemoCallback<T extends (...args: any[]) => any>(
  fn: T,
  getKey: (...args: Parameters<T>) => string,
): T {
  const cacheRef = useRef(new WeakMap<object, Map<string, ReturnType<T>>>())

  return useCallback(
    (...args: Parameters<T>): ReturnType<T> => {
      const cache = cacheRef.current
      let map = cache.get(fn)
      if (!map) {
        map = new Map()
        cache.set(fn, map)
      }
      const key = getKey(...args)
      const cached = map.get(key)
      if (cached !== undefined) {
        return cached
      }
      const result = fn(...args)
      map.set(key, result)
      return result
    },
    [fn, getKey],
  ) as T
}
