import type { CSSProperties } from 'react'

export function mergeStyles(styles: (Record<string, any> | undefined | null)[]): CSSProperties {
  return styles.reduce<Record<string, any>>((merged, style) => {
    if (style) {
      for (const key in style) {
        if (typeof style[key] === 'object' && !Array.isArray(style[key]) && style[key] !== null) {
          merged[key] = {
            ...((merged[key] as {}) || {}),
            ...style[key],
          }
        } else {
          merged[key] = style[key]
        }
      }
    }
    return merged as CSSProperties
  }, {})
}
