const cacheStore = new WeakMap<(...args: any) => any, any>()

export default function memoize<FunctionType extends (...args: any) => any>(
  fn: FunctionType,
  options: {
    cacheKey?: (...param: Parameters<FunctionType>) => string
  },
) {
  const {
    cacheKey: cacheKeyFn = (...param: Parameters<FunctionType>) => {
      return param[0]
    },
  } = options
  if (!cacheStore.has(fn)) {
    cacheStore.set(fn, new Map())
  }
  const cache = cacheStore.get(fn)!

  return function (this: FunctionType, ...args: Parameters<FunctionType>) {
    const cacheKey = cacheKeyFn(...args)
    if (!cache.has(cacheKey)) {
      const result = fn.apply(this, args)
      cache.set(cacheKey, result)
    }
    return cache.get(cacheKey)
  }
}
