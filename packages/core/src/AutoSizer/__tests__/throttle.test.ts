import { throttle } from '../throttle'

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('应该使用最后一次调用的参数', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000, { leading: false })

    // 快速连续调用多次，参数不同
    throttledFn('first')
    throttledFn('second')
    throttledFn('third')
    throttledFn('last')

    // 此时应该还没有执行
    expect(mockFn).not.toHaveBeenCalled()

    // 快进时间，触发延迟执行
    jest.advanceTimersByTime(1000)

    // 应该只执行一次，并且使用最后一次的参数
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('last')
  })

  it('leading=true 时应该立即执行第一次调用，延迟执行使用最后参数', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000, { leading: true })

    // 快速连续调用
    throttledFn('first') // 应该立即执行
    throttledFn('second')
    throttledFn('third')
    throttledFn('last')

    // 第一次调用应该立即执行
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('first')

    // 快进时间，触发延迟执行
    jest.advanceTimersByTime(1000)

    // 应该再执行一次，使用最后一次的参数
    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn).toHaveBeenLastCalledWith('last')
  })

  it('应该保持正确的 this 上下文', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000, { leading: false })

    const context1 = { name: 'context1' }
    const context2 = { name: 'context2' }

    // 使用不同的上下文调用
    throttledFn.call(context1, 'arg1')
    throttledFn.call(context2, 'arg2')

    jest.advanceTimersByTime(1000)

    // 应该使用最后一次调用的上下文
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('arg2')
    expect(mockFn.mock.instances[0]).toBe(context2)
  })

  it('多个参数的情况下应该正确传递最后一次的参数', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000, { leading: false })

    throttledFn(1, 'a', true)
    throttledFn(2, 'b', false)
    throttledFn(3, 'c', true)

    jest.advanceTimersByTime(1000)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith(3, 'c', true)
  })

  it('在冷却期结束后应该能重新节流', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000, { leading: false })

    // 第一轮调用
    throttledFn('first-round')
    jest.advanceTimersByTime(1000)
    expect(mockFn).toHaveBeenCalledWith('first-round')

    // 等待冷却期结束
    jest.advanceTimersByTime(100)

    // 第二轮调用
    throttledFn('second-round-1')
    throttledFn('second-round-2')
    jest.advanceTimersByTime(1000)

    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn).toHaveBeenLastCalledWith('second-round-2')
  })
})
