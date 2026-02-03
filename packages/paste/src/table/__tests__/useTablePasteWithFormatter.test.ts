import { renderHook, waitFor } from '@testing-library/react'
import { useTablePasteWithFormatter } from '../useTablePasteWithFormatter'

// Helper function to create a mock ClipboardEvent
function createMockPasteEvent(data: string[][]): ClipboardEvent {
  const tsvData = data.map((row) => row.join('\t')).join('\n')
  const htmlData = `<table>${data.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</table>`

  return {
    preventDefault: jest.fn(),
    clipboardData: {
      getData: jest.fn((type: string) => {
        if (type === 'text/plain') return tsvData
        if (type === 'text/html') return htmlData
        return ''
      }),
    } as any,
  } as any
}

describe('useTablePasteWithFormatter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('应该处理空数据', async () => {
    const onComplete = jest.fn()
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [],
        onComplete,
      }),
    )

    const emptyEvent = createMockPasteEvent([])
    result.current.handlePaste(emptyEvent)

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith([])
      expect(result.current.data).toEqual([])
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('应该处理没有格式化器的数据', async () => {
    const onComplete = jest.fn()
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [{}, {}, {}],
        onComplete,
      }),
    )

    const testData = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ]
    const event = createMockPasteEvent(testData)
    result.current.handlePaste(event)

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(testData)
      expect(result.current.data).toEqual(testData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('应该应用同步格式化器', async () => {
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [
          { formatter: (v) => v.toUpperCase() },
          { formatter: (v) => v.toLowerCase() },
          {},
        ],
      }),
    )

    const testData = [
      ['abc', 'DEF', 'GHI'],
      ['jkl', 'MNO', 'PQR'],
    ]
    const event = createMockPasteEvent(testData)
    result.current.handlePaste(event)

    await waitFor(() => {
      expect(result.current.data).toEqual([
        ['ABC', 'def', 'GHI'],
        ['JKL', 'mno', 'PQR'],
      ])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.progress).toBe(100)
    })
  })

  it('应该应用异步格式化器', async () => {
    const asyncFormatter = jest.fn(async (v: string) => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      return v.toUpperCase()
    })

    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [{ formatter: asyncFormatter }],
      }),
    )

    const testData = [['hello'], ['world']]
    const event = createMockPasteEvent(testData)
    result.current.handlePaste(event)

    await waitFor(() => {
      expect(asyncFormatter).toHaveBeenCalledTimes(2)
      expect(result.current.data).toEqual([['HELLO'], ['WORLD']])
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('应该传递行列索引给格式化器', async () => {
    const formatter = jest.fn((value, rowIndex, colIndex) => {
      return `${value}-R${rowIndex}-C${colIndex}`
    })

    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [{ formatter }, { formatter }],
      }),
    )

    const testData = [
      ['a', 'b'],
      ['c', 'd'],
    ]
    const event = createMockPasteEvent(testData)
    result.current.handlePaste(event)

    await waitFor(() => {
      expect(formatter).toHaveBeenCalledWith('a', 0, 0)
      expect(formatter).toHaveBeenCalledWith('b', 0, 1)
      expect(formatter).toHaveBeenCalledWith('c', 1, 0)
      expect(formatter).toHaveBeenCalledWith('d', 1, 1)

      expect(result.current.data).toEqual([
        ['a-R0-C0', 'b-R0-C1'],
        ['c-R1-C0', 'd-R1-C1'],
      ])
    })
  })

  it('应该报告进度信息', async () => {
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [{ formatter: (v) => v }],
      }),
    )

    // 创建足够多的数据以触发多次进度更新
    const testData = Array.from({ length: 15 }, (_, i) => [`cell${i}`])
    const event = createMockPasteEvent(testData)

    expect(result.current.progress).toBe(0)
    expect(result.current.isLoading).toBe(false)

    result.current.handlePaste(event)

    await waitFor(() => {
      expect(result.current.progress).toBe(100)
      expect(result.current.processed).toBe(15)
      expect(result.current.total).toBe(15)
      expect(result.current.estimatedTimeLeft).toBe(0)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('应该处理格式化器中的错误', async () => {
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [
          {
            formatter: () => {
              throw new Error('格式化错误')
            },
          },
        ],
      }),
    )

    const testData = [['test']]
    const event = createMockPasteEvent(testData)
    result.current.handlePaste(event)

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
      expect(result.current.error?.message).toBe('格式化错误')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeNull()
    })
  })

  it('应该处理异步格式化器中的错误', async () => {
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [
          {
            formatter: async () => {
              throw new Error('异步错误')
            },
          },
        ],
      }),
    )

    const testData = [['test']]
    const event = createMockPasteEvent(testData)
    result.current.handlePaste(event)

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
      expect(result.current.error?.message).toBe('异步错误')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeNull()
    })
  })

  it('应该在处理过程中设置 isLoading', async () => {
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [
          {
            formatter: async (v) => {
              await new Promise((resolve) => setTimeout(resolve, 50))
              return v
            },
          },
        ],
      }),
    )

    const testData = [['test']]
    const event = createMockPasteEvent(testData)

    expect(result.current.isLoading).toBe(false)
    result.current.handlePaste(event)

    // 异步处理应该设置 isLoading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual([['test']])
    })
  })

  it('应该正确计算进度百分比', async () => {
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [{ formatter: (v) => v }],
      }),
    )

    // 创建 25 个单元格的数据
    const testData = Array.from({ length: 25 }, (_, i) => [`cell${i}`])
    const event = createMockPasteEvent(testData)
    result.current.handlePaste(event)

    await waitFor(() => {
      expect(result.current.progress).toBe(100)
      expect(result.current.processed).toBe(25)
      expect(result.current.total).toBe(25)
    })
  })

  it('应该估算剩余时间', async () => {
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [
          {
            formatter: async (v) => {
              await new Promise((resolve) => setTimeout(resolve, 5))
              return v
            },
          },
        ],
      }),
    )

    const testData = Array.from({ length: 20 }, (_, i) => [`cell${i}`])
    const event = createMockPasteEvent(testData)
    result.current.handlePaste(event)

    await waitFor(() => {
      expect(result.current.progress).toBe(100)
      expect(result.current.estimatedTimeLeft).toBe(0)
    })
  })

  it('应该支持 onComplete 回调', async () => {
    const onComplete = jest.fn()
    const { result } = renderHook(() =>
      useTablePasteWithFormatter({
        columns: [{ formatter: (v) => v.toUpperCase() }],
        onComplete,
      }),
    )

    const testData = [['hello']]
    const event = createMockPasteEvent(testData)
    result.current.handlePaste(event)

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith([['HELLO']])
      expect(result.current.data).toEqual([['HELLO']])
    })
  })
})
