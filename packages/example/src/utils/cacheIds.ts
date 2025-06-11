/**
 * 批量获取数据的函数类型
 * @template T 数据项的类型
 * @template P 参数对象的类型
 */
type BatchFetcher<T, P> = (ids: string[], params: P) => Promise<Record<string, T>>

/**
 * 参数比较函数类型
 * @template P 参数对象的类型
 */
type EqualFn<P> = (a: P, b: P) => boolean

/**
 * 待处理请求的结构
 */
type PendingRequest<T, P> = {
  ids: Set<string>
  params: P
  resolvers: Map<
    string,
    Array<{
      resolve: (value: T | undefined) => void
      reject: (error: any) => void
    }>
  >
}

/**
 * 创建批量缓存函数
 *
 * 核心功能：
 * - 在 delay 时间内汇总相同参数的 ID 请求
 * - 批量调用传入的方法，减少网络请求次数
 * - 缓存已获取的数据，避免重复请求
 *
 * @template T 数据项的类型
 * @template P 参数对象的类型
 * @param fetcher 批量获取数据的方法，接收 ID 列表和参数对象，返回 Promise<{id: info}>
 * @param equal 参数比较方法，用于判断两个参数对象是否相等
 * @param delay 延迟时间（毫秒），在此时间内的请求会被汇总
 * @returns 返回一个函数，接收单个 ID 和参数对象，返回对应数据的 Promise
 */
export function createBatchCache<T, P>(
  fetcher: BatchFetcher<T, P>,
  equal: EqualFn<P>,
  delay: number,
) {
  // 缓存数据，按参数分组存储（包括undefined值）
  const cache = new Map<string, Map<string, T | undefined>>()

  // 待处理的请求队列，按参数分组
  const pendingRequests = new Map<string, PendingRequest<T, P>>()

  // 延迟执行的定时器
  let timeoutId: NodeJS.Timeout | null = null

  /**
   * 执行批量请求
   */
  const executeBatch = async () => {
    const currentRequests = new Map(pendingRequests)
    pendingRequests.clear()
    timeoutId = null

    // 处理每组参数的请求
    for (const [paramsKey, request] of currentRequests) {
      const { ids, params, resolvers } = request

      try {
        // 调用批量获取方法
        const result = await fetcher(Array.from(ids), params)

        // 更新缓存
        if (!cache.has(paramsKey)) {
          cache.set(paramsKey, new Map())
        }
        const paramsCache = cache.get(paramsKey)!

        // 存储获取到的数据，包括不存在的ID（undefined值）
        for (const id of ids) {
          const data = result[id]
          paramsCache.set(id, data) // data可能是undefined，也需要缓存
        }

        // 解析所有对应的 Promise
        for (const [id, resolverList] of resolvers) {
          const data = result[id]
          resolverList.forEach(({ resolve }) => resolve(data))
        }
      } catch (error) {
        // 处理错误，拒绝所有对应的 Promise
        for (const resolverList of resolvers.values()) {
          resolverList.forEach(({ reject }) => reject(error))
        }
      }
    }
  }

  /**
   * 生成参数的缓存键
   */
  const generateParamsKey = (params: P): string => {
    try {
      return JSON.stringify(params)
    } catch {
      // 如果参数无法序列化，使用对象引用作为键
      return String(params)
    }
  }

  /**
   * 查找具有相同参数的现有请求
   */
  const findExistingRequest = (params: P): [string, PendingRequest<T, P>] | null => {
    for (const [key, request] of pendingRequests) {
      if (equal(request.params, params)) {
        return [key, request]
      }
    }
    return null
  }

  /**
   * 返回的单个请求函数
   * @param id 要获取的数据 ID
   * @param params 请求参数
   * @returns 如果数据已缓存则直接返回数据，否则返回 Promise
   */
  return (id: string, params: P): T | undefined | Promise<T | undefined> => {
    const paramsKey = generateParamsKey(params)

    // 检查缓存 - 如果已缓存，直接返回数据
    const paramsCache = cache.get(paramsKey)
    if (paramsCache && paramsCache.has(id)) {
      return paramsCache.get(id)
    }

    // 查找现有的相同参数请求
    const existing = findExistingRequest(params)
    let existingRequest: PendingRequest<T, P>
    let requestKey: string

    if (existing) {
      ;[requestKey, existingRequest] = existing
    } else {
      // 创建新的请求组
      requestKey = paramsKey
      existingRequest = {
        ids: new Set<string>(),
        params,
        resolvers: new Map(),
      }
      pendingRequests.set(requestKey, existingRequest)
    }

    // 添加到请求队列
    existingRequest.ids.add(id)

    return new Promise<T | undefined>((resolve, reject) => {
      // 为这个 ID 添加 resolver
      if (!existingRequest.resolvers.has(id)) {
        existingRequest.resolvers.set(id, [])
      }
      existingRequest.resolvers.get(id)!.push({ resolve, reject })

      // 设置或重置延迟执行定时器
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(executeBatch, delay)
    })
  }
}

/**
 * 默认的深度比较函数
 * @param a 第一个对象
 * @param b 第二个对象
 * @returns 是否相等
 */
export function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) return true

  if (a == null || b == null) return false

  if (typeof a !== 'object' || typeof b !== 'object') return false

  const keysA = Object.keys(a as any)
  const keysB = Object.keys(b as any)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!deepEqual((a as any)[key], (b as any)[key])) return false
  }

  return true
}
