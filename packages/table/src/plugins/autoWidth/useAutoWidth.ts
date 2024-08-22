import { useMemo } from 'react'
import type { ColumnType } from '../data/type'

export interface UseAutoWidthProps {
  width: number
  defaultItemWidth: number
  columns: ColumnType[]
}
export function useAutoWidth({ width, columns, defaultItemWidth }: UseAutoWidthProps) {
  const calcColumnWidth = useMemo(() => {
    if (width <= 0) {
      return () => defaultItemWidth
    }
    const realWidth = width - 2
    const defaultWidthList: number[] = []
    const emptyColIndexList: number[] = []
    let customWidth: number = 0
    let isCustomWidth = true
    columns.forEach((column, index) => {
      const hasWidth = 'width' in column
      const tWidth = (hasWidth ? column.width : defaultItemWidth)!
      customWidth += tWidth
      defaultWidthList.push(tWidth)
      if (!hasWidth) {
        emptyColIndexList.push(index)
        isCustomWidth = false
      }
    })
    if (!isCustomWidth || realWidth > customWidth) {
      const sameWidth =
        (realWidth - (customWidth - emptyColIndexList.length * defaultItemWidth)) /
        emptyColIndexList.length
      const floor = Math.floor(sameWidth)
      const last =
        realWidth -
        (customWidth - emptyColIndexList.length * defaultItemWidth) -
        floor * (emptyColIndexList.length - 1)

      emptyColIndexList.forEach((emptyIndex, index) => {
        defaultWidthList.splice(
          emptyIndex,
          1,
          index === emptyColIndexList.length - 1 ? last : floor,
        )
      })
    }

    return (index: number) => {
      return defaultWidthList[index]
    }
  }, [columns, width, defaultItemWidth])

  return calcColumnWidth
}
