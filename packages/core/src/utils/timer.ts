const hasNativePerformanceNow
  = typeof performance === 'object' && typeof performance.now === 'function'

const now = hasNativePerformanceNow ? () => performance.now() : () => Date.now()

export type TimeoutID = {
  id: number
}

export function cancelTimeout(timeoutID: TimeoutID) {
  cancelAnimationFrame(timeoutID.id)
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function requestTimeout(callback: Function, delay: number): TimeoutID {
  const start = now()

  function tick() {
    if (now() - start >= delay) {
      callback.call(null)
    }
    else {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      timeoutID.id = requestAnimationFrame(tick)
    }
  }

  const timeoutID: TimeoutID = {
    id: requestAnimationFrame(tick),
  }

  return timeoutID
}
