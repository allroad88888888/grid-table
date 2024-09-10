import { useLayoutEffect } from 'react'
import { useData } from '../data'

export interface UseAutoWidthProps {
  width: number
  defaultItemWidth: number
}

export function useAutoWidth({ width, defaultItemWidth }: UseAutoWidthProps) {
  const { columnOptionsAtom, store } = useData()

  useLayoutEffect(() => {
    if (width <= 0) {
      return
    }
    return store.setter(columnOptionsAtom, (_getter, prevColumns) => {
      let remainingLength = width - 2
      let hasPropWidthLength = 0

      prevColumns.forEach((column) => {
        const hasWidth = 'width' in column
        if (hasWidth) {
          hasPropWidthLength += 1
          remainingLength -= column.width!
        }
      })
      const emptyWidthLength = prevColumns.length - hasPropWidthLength
      let autoItemWidth = defaultItemWidth
      if (remainingLength > emptyWidthLength * defaultItemWidth) {
        autoItemWidth = remainingLength / emptyWidthLength
      }

      let last = autoItemWidth

      if (autoItemWidth % 1 > 0) {
        autoItemWidth = Math.floor(autoItemWidth)
        last = autoItemWidth + 1
      }

      let temp = 0
      const nextColumns = prevColumns.map((column) => {
        const hasWidth = 'width' in column
        if (hasWidth) {
          return column
        }
        temp += 1
        return {
          ...column,
          width: temp === emptyWidthLength ? last : autoItemWidth,
        }
      })

      return nextColumns
    })
  }, [width])
}
