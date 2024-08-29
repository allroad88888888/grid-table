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

    function change(parentNode: HTMLElement) {
      const rect = parentNode.getBoundingClientRect()
      // 判断隐藏 nothing todo
      if (rect.height === 0 && rect.width === 0) {
        return
      }
      // const parentNode = innerRef?.current as HTMLElement;
      const styleTemp = window.getComputedStyle(parentNode) || {}
      const paddingLeft = parseFloat(styleTemp.paddingLeft ?? '0')
      const paddingRight = parseFloat(styleTemp.paddingRight ?? '0')
      const paddingTop = parseFloat(styleTemp.paddingTop ?? '0')
      const paddingBottom = parseFloat(styleTemp.paddingBottom ?? '0')

      const borderBottom = parseFloat(styleTemp.borderBottomWidth ?? '0')
      const borderTop = parseFloat(styleTemp.borderTopWidth ?? '0')
      const borderLeft = parseFloat(styleTemp.borderLeftWidth ?? '0')
      const borderRight = parseFloat(styleTemp.borderRightWidth ?? '0')
      setParam({
        height: parentNode.offsetHeight - paddingTop - paddingBottom - borderBottom - borderTop,
        width: parentNode.offsetWidth - paddingLeft - paddingRight - borderLeft - borderRight,
      })
    }
    change(ref.current)
    const debChange = throttle(change, 300)

    let resizeObserver: ResizeObserver
    if (withAnimation) {
      let ticking = false
      resizeObserver = new ResizeObserver((t) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            change(t[0].target as HTMLElement)
            ticking = false
          })

          ticking = true
        }
      })
    } else {
      resizeObserver = new ResizeObserver((t) => {
        debChange(t[0].target as HTMLElement)
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
