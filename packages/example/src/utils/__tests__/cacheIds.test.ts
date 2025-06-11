import { createBatchCache, deepEqual } from '../cacheIds'

describe('createBatchCache', () => {
  it('应该正确实现批量请求和缓存功能', async () => {
    // 模拟批量获取方法
    const mockFetcher = jest.fn(async (ids: string[], params: { type: string }) => {
      const result: Record<string, string> = {}
      ids.forEach((id) => {
        result[id] = `${params.type}-${id}`
      })
      return result
    })

    // 创建批量缓存函数
    const batchGet = createBatchCache(mockFetcher, deepEqual, 50)

    // 测试参数
    const params = { type: 'user' }

    // 1. 同时请求多个ID，应该合并为一次批量
    const [result1, result2, result3] = await Promise.all([
      batchGet('1', params),
      batchGet('2', params),
      batchGet('3', params),
    ])

    // 验证结果
    expect(result1).toBe('user-1')
    expect(result2).toBe('user-2')
    expect(result3).toBe('user-3')

    // 验证只调用了一次批量获取方法
    expect(mockFetcher).toHaveBeenCalledTimes(1)
    expect(mockFetcher).toHaveBeenCalledWith(['1', '2', '3'], params)

    // 2. 测试缓存功能 - 再次请求相同数据不应触发新的API调用
    const cachedResult = await batchGet('1', params)
    expect(cachedResult).toBe('user-1')

    // 验证仍然只调用了一次批量获取方法（缓存命中）
    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })

  it('应该正确处理不同参数的请求', async () => {
    const mockFetcher = jest.fn(async (ids: string[], params: { type: string }) => {
      const result: Record<string, string> = {}
      ids.forEach((id) => {
        result[id] = `${params.type}-${id}`
      })
      return result
    })

    const batchGet = createBatchCache(mockFetcher, deepEqual, 50)

    const userParams = { type: 'user' }
    const adminParams = { type: 'admin' }

    // 不同参数的请求应该分别处理
    const [userResult, adminResult] = await Promise.all([
      batchGet('1', userParams),
      batchGet('1', adminParams),
    ])

    expect(userResult).toBe('user-1')
    expect(adminResult).toBe('admin-1')

    // 应该调用了两次，每种参数一次
    expect(mockFetcher).toHaveBeenCalledTimes(2)
    expect(mockFetcher).toHaveBeenCalledWith(['1'], userParams)
    expect(mockFetcher).toHaveBeenCalledWith(['1'], adminParams)
  })

  it('应该在延迟时间内合并请求', async () => {
    const mockFetcher = jest.fn(async (ids: string[], params: { type: string }) => {
      const result: Record<string, string> = {}
      ids.forEach((id) => {
        result[id] = `${params.type}-${id}`
      })
      return result
    })

    const batchGet = createBatchCache(mockFetcher, deepEqual, 100)

    const params = { type: 'user' }

    // 发起第一个请求
    const promise1 = batchGet('1', params)

    // 延迟 30ms 后发起第二个请求（在延迟时间内）
    await new Promise((resolve) => setTimeout(resolve, 30))
    const promise2 = batchGet('2', params)

    // 延迟 30ms 后发起第三个请求（在延迟时间内）
    await new Promise((resolve) => setTimeout(resolve, 30))
    const promise3 = batchGet('3', params)

    const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3])

    expect(result1).toBe('user-1')
    expect(result2).toBe('user-2')
    expect(result3).toBe('user-3')

    // 应该只调用一次，因为都在延迟时间内
    expect(mockFetcher).toHaveBeenCalledTimes(1)
    expect(mockFetcher).toHaveBeenCalledWith(['1', '2', '3'], params)
  })

  it('应该正确处理API错误', async () => {
    const mockFetcher = jest.fn(async () => {
      throw new Error('API错误')
    })

    const batchGet = createBatchCache(mockFetcher, deepEqual, 50)
    const params = { type: 'user' }

    // 所有请求都应该被拒绝
    await expect(batchGet('1', params)).rejects.toThrow('API错误')
    await expect(Promise.all([batchGet('2', params), batchGet('3', params)])).rejects.toThrow(
      'API错误',
    )

    expect(mockFetcher).toHaveBeenCalledTimes(2)
  })

  it('应该支持自定义参数比较函数', async () => {
    const mockFetcher = jest.fn(
      async (ids: string[], params: { type: string; version?: number }) => {
        const result: Record<string, string> = {}
        ids.forEach((id) => {
          result[id] = `${params.type}-${id}`
        })
        return result
      },
    )

    // 自定义比较函数：只比较 type 字段，忽略 version
    const customEqual = (
      a: { type: string; version?: number },
      b: { type: string; version?: number },
    ) => {
      return a.type === b.type
    }

    const batchGet = createBatchCache(mockFetcher, customEqual, 50)

    const params1 = { type: 'user', version: 1 }
    const params2 = { type: 'user', version: 2 } // 不同 version，但 type 相同

    // 这两个请求应该被合并，因为自定义比较函数只看 type
    const [result1, result2] = await Promise.all([batchGet('1', params1), batchGet('2', params2)])

    expect(result1).toBe('user-1')
    expect(result2).toBe('user-2')

    // 应该只调用一次，因为自定义比较认为参数相同
    expect(mockFetcher).toHaveBeenCalledTimes(1)
    expect(mockFetcher).toHaveBeenCalledWith(['1', '2'], params1) // 使用第一个参数
  })

  it('应该正确处理返回 undefined 的情况', async () => {
    const mockFetcher = jest.fn(async (ids: string[]) => {
      const result: Record<string, string> = {}
      // 只返回部分数据，模拟某些ID不存在的情况
      if (ids.includes('1')) {
        result['1'] = 'user-1'
      }
      // 不返回 '2' 的数据
      return result
    })

    const batchGet = createBatchCache(mockFetcher, deepEqual, 50)
    const params = { type: 'user' }

    const [result1, result2] = await Promise.all([batchGet('1', params), batchGet('2', params)])

    expect(result1).toBe('user-1')
    expect(result2).toBeUndefined() // 没有返回数据的ID应该是 undefined

    expect(mockFetcher).toHaveBeenCalledTimes(1)
    expect(mockFetcher).toHaveBeenCalledWith(['1', '2'], params)
  })

  it('应该正确处理服务器返回 null 的情况', async () => {
    const mockFetcher = jest.fn(async (ids: string[]) => {
      const result: Record<string, string | null> = {}
      // 模拟服务器返回的数据，包含 null 值
      ids.forEach((id) => {
        if (id === '1') {
          result[id] = 'user-1'
        } else if (id === '2') {
          result[id] = null // 服务器明确返回 null
        } else {
          result[id] = `user-${id}`
        }
      })
      return result
    })

    const batchGet = createBatchCache(mockFetcher, deepEqual, 50)
    const params = { type: 'user' }

    const [result1, result2, result3] = await Promise.all([
      batchGet('1', params),
      batchGet('2', params), // 这个会返回 null
      batchGet('3', params),
    ])

    expect(result1).toBe('user-1')
    expect(result2).toBeNull() // 服务器返回 null 的情况
    expect(result3).toBe('user-3')

    expect(mockFetcher).toHaveBeenCalledTimes(1)
    expect(mockFetcher).toHaveBeenCalledWith(['1', '2', '3'], params)

    // 测试缓存是否也能正确处理 null 值
    const cachedNullResult = await batchGet('2', params)
    expect(cachedNullResult).toBeNull()

    // 验证缓存命中，不会触发新的API调用
    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })

  it('缓存命中时应该直接返回数据而不是Promise', async () => {
    const mockFetcher = jest.fn(async (ids: string[], params: { type: string }) => {
      const result: Record<string, string> = {}
      ids.forEach((id) => {
        // 只为存在的ID返回数据，'999'不存在
        if (id !== '999') {
          result[id] = `${params.type}-${id}`
        }
      })
      return result
    })

    const batchGet = createBatchCache(mockFetcher, deepEqual, 50)
    const params = { type: 'user' }

    // 第一次批量请求 - 同时请求存在和不存在的ID
    const [existingData, nonExistingData] = await Promise.all([
      batchGet('1', params), // 存在的ID
      batchGet('999', params), // 不存在的ID
    ])

    expect(existingData).toBe('user-1')
    expect(nonExistingData).toBeUndefined()
    expect(mockFetcher).toHaveBeenCalledTimes(1)
    expect(mockFetcher).toHaveBeenCalledWith(['1', '999'], params)

    // 第二次请求已缓存的存在数据 - 应该直接返回数据，不是 Promise
    const cachedResult = batchGet('1', params)
    expect(cachedResult).not.toBeInstanceOf(Promise)
    expect(cachedResult).toBe('user-1')

    // 第二次请求已缓存的不存在数据 - 应该直接返回 undefined，不是 Promise
    const cachedUndefined = batchGet('999', params)
    expect(cachedUndefined).not.toBeInstanceOf(Promise)
    expect(cachedUndefined).toBeUndefined()

    // 验证仍然只调用了一次API（缓存命中）
    expect(mockFetcher).toHaveBeenCalledTimes(1)
  })
})
