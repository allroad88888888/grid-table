export function throttle<T>(
  fn: (...arg: any[]) => T,
  wait: number,
  options?: {
    leading: boolean
  },
) {
  let timer: any = null
  let isLeading = false
  let lastArgs: any[] | null = null
  let lastThis: any = null
  const { leading = true } = options || {}

  return function (this: any, ...args: any[]) {
    // 始终保存最后一次调用的参数和上下文
    lastArgs = args
    lastThis = this

    if (!timer) {
      if (leading === true && isLeading === false) {
        fn.apply(this, args)
      }
      isLeading = true
      timer = setTimeout(() => {
        timer = null
        // 使用最后一次调用的参数和上下文
        if (lastArgs) {
          fn.apply(lastThis, lastArgs)
        }
        setTimeout(() => {
          isLeading = false
        })
      }, wait)
    }
  }
}
