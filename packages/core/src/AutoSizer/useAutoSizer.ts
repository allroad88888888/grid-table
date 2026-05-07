import type { RefObject } from 'react'
import { useLayoutEffect, useState } from 'react'
import { throttle } from './throttle'
import { snapToDevicePixel } from '../utils/snapToDevicePixel'

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
      // 当父元素 display:none 时，宽高均为 0，跳过更新以保留上次有效尺寸
      if (rec.height === 0 && rec.width === 0) {
        return
      }
      // 将测量值对齐到物理像素栅格，避免非整数 DPR/缩放下容器宽度产生小数
      // 设备像素，进而导致 grid 的 auto-fill 推断出与显式轨道数不一致的轨道数
      setParam({
        height: snapToDevicePixel(rec.height + 2),
        width: snapToDevicePixel(rec.width + 2),
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
