import type { RefObject } from 'react'
import { useLayoutEffect, useState } from 'react'
import { throttle } from './throttle'

interface Params {
  height: number
  width: number
}

export interface AutoSizerOptions {
  /**
   * 如果高度变动有动画效果，请设置为true
   * @default false
   */
  withAnimation?: boolean
}

export function useAutoSizer<T extends HTMLElement>(
  ref: RefObject<T>,
  { withAnimation = false }: AutoSizerOptions = { withAnimation: false },
) {
  const [param, setParam] = useState<Params>({
    height: 0,
    width: 0,
  })

  useLayoutEffect(() => {
    if (!ref?.current) {
      return
    }

    function change2(rec: DOMRectReadOnly) {
      setParam({
        height: rec.height + 2,
        width: rec.width + 2,
      })
    }
    const debChange = throttle(change2, 300)

    let resizeObserver: ResizeObserver
    if (withAnimation) {
      let ticking = false
      resizeObserver = new ResizeObserver((t) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            change2(t[0].contentRect)
            ticking = false
          })

          ticking = true
        }
      })
    } else {
      resizeObserver = new ResizeObserver((t) => {
        debChange(t[0].contentRect)
      })
    }
    resizeObserver.observe(ref?.current)

    // eslint-disable-next-line consistent-return
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return param
}
