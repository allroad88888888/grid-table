import React, { useState, useCallback } from 'react'
import { modernDebounce, modernAsyncDebounce, idleThrottle } from '../utils/modernDebounce'

export default function ModernDebounceThrottle() {
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [scrollCount, setScrollCount] = useState(0)
  const [idleExecutions, setIdleExecutions] = useState(0)
  const [asyncResults, setAsyncResults] = useState<string[]>([])

  // 1. 使用现代防抖进行搜索
  const debouncedSearch = useCallback(
    modernDebounce((value: string) => {
      // 执行搜索逻辑
      const results = value
        ? [`"${value}" 搜索结果 1`, `"${value}" 搜索结果 2`, `"${value}" 搜索结果 3`]
        : []
      setSearchResults(results)
    }, 500),
    [],
  )

  // 2. 使用异步防抖处理API调用
  const debouncedAsyncSearch = useCallback(
    modernAsyncDebounce(async (value: string): Promise<string[]> => {
      // 执行异步搜索逻辑
      await new Promise((resolve) => setTimeout(resolve, 200))
      return value ? [`异步结果: ${value}_1`, `异步结果: ${value}_2`] : []
    }, 600),
    [],
  )

  // 3. 使用智能节流处理滚动
  const throttledScroll = useCallback(
    idleThrottle(
      () => {
        // 滚动事件处理逻辑
        setScrollCount((prev) => prev + 1)
      },
      { timeout: 1000 },
    ),
    [],
  )

  // 4. 使用智能节流处理其他计算密集型任务
  const idleTask = useCallback(
    idleThrottle(
      () => {
        // 空闲时执行任务逻辑
        setIdleExecutions((prev) => prev + 1)
      },
      { timeout: 2000 },
    ),
    [],
  )

  // 处理搜索输入
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    debouncedSearch(value)

    // 异步搜索
    debouncedAsyncSearch(value)
      .then((results: string[]) => setAsyncResults(results))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') {
          // 处理异步搜索错误
        }
      })
  }

  // 处理滚动
  const handleScroll = () => {
    throttledScroll()
  }

  // 触发空闲任务
  const triggerIdleTask = () => {
    idleTask()
  }

  // 取消所有防抖/节流
  const cancelAll = () => {
    debouncedSearch.cancel()
    debouncedAsyncSearch.cancel()
    throttledScroll.cancel()
    idleTask.cancel()
    setSearchResults([])
    setAsyncResults([])
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>现代防抖节流示例</h1>

      {/* 防抖搜索示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>1. 现代防抖搜索 (使用 AbortController)</h2>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="输入搜索内容..."
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <div>
          <h3>同步搜索结果:</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>异步搜索结果:</h3>
          <ul>
            {asyncResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 智能节流滚动示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>2. 智能节流滚动 (使用 requestIdleCallback)</h2>
        <div
          onScroll={handleScroll}
          style={{
            height: '200px',
            border: '1px solid #ccc',
            padding: '10px',
            overflowY: 'scroll',
            background: '#f9f9f9',
          }}
        >
          <div
            style={{ height: '1000px', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)' }}
          >
            <p>滚动这个区域来触发节流事件</p>
            <p>滚动处理次数: {scrollCount}</p>
            <div style={{ height: '800px' }} />
            <p>继续滚动...</p>
          </div>
        </div>
      </section>

      {/* 空闲时执行任务示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>3. 空闲时执行任务</h2>
        <button
          onClick={triggerIdleTask}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          触发空闲任务
        </button>
        <p>空闲任务执行次数: {idleExecutions}</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          * 任务会在浏览器空闲时执行，频繁点击不会立即执行多次
        </p>
      </section>

      {/* 控制按钮 */}
      <section>
        <h2>4. 控制选项</h2>
        <button
          onClick={cancelAll}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          取消所有防抖/节流
        </button>
      </section>

      {/* 说明 */}
      <section
        style={{ marginTop: '30px', padding: '15px', background: '#f0f0f0', borderRadius: '4px' }}
      >
        <h3>💡 现代防抖节流的优势:</h3>
        <ul>
          <li>
            <strong>AbortController:</strong> 更好的取消机制，避免内存泄漏
          </li>
          <li>
            <strong>requestIdleCallback:</strong> 在浏览器空闲时执行，性能更优
          </li>
          <li>
            <strong>Promise 支持:</strong> 更好地处理异步操作
          </li>
          <li>
            <strong>TypeScript 友好:</strong> 完整的类型推导
          </li>
          <li>
            <strong>可取消性:</strong> 提供显式的取消方法
          </li>
        </ul>
      </section>
    </div>
  )
}
