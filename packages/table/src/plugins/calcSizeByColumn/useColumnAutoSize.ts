import { RefObject, useEffect } from 'react'
import { useSetAtom, atom } from '@einfach/react'
import { columnSizeMapAtom, columnIdShowListAtom } from '@grid-table/basic'
import { AutoColumnsSizeOptions, measureColumnsWidth } from './measureColumnsWidth'

const gridRefAtom = atom<{
  ref: RefObject<HTMLDivElement>
} | null>(null)

export const autoColumnsSizeAtom = atom(
  null,
  (getter, stter, columnIds?: string[], options?: AutoColumnsSizeOptions) => {
    const gridRef = getter(gridRefAtom)
    if (!gridRef?.ref?.current) {
      return
    }
    const { minColumnWidth, maxColumnWidth, columnPadding } = options || {}

    let paramIds = columnIds || []

    const columnIdList = getter(columnIdShowListAtom)
    if (!columnIds || columnIds.length === 0) {
      paramIds = columnIdList
    }

    const columnIndexList = columnIdList
      .map((item, index) => {
        if (paramIds?.includes(item)) {
          return index
        }
        return null
      })
      .filter((item) => item !== null)

    const columnWidths = measureColumnsWidth(gridRef.ref, columnIndexList, {
      minColumnWidth,
      maxColumnWidth,
      columnPadding,
    })

    if (columnWidths && columnWidths.length > 0) {
      stter(columnSizeMapAtom, (prevSizeMap: Map<string, number>) => {
        const newSizeMap = new Map(prevSizeMap)

        // 根据索引更新对应的列宽
        columnIndexList.forEach((columnIndex, arrayIndex) => {
          if (arrayIndex < columnWidths.length && columnIndex < columnIdList.length) {
            const columnId = columnIdList[columnIndex]
            if (columnId) {
              newSizeMap.set(columnId, columnWidths[arrayIndex])
            }
          }
        })

        return newSizeMap
      })
    }
  },
)

export function useColumnAutoSize(gridRef: RefObject<HTMLDivElement>) {
  const autoColumnsSize = useSetAtom(autoColumnsSizeAtom)
  const setGridRef = useSetAtom(gridRefAtom)
  useEffect(() => {
    setGridRef({ ref: gridRef })
  }, [gridRef])

  return autoColumnsSize
}
