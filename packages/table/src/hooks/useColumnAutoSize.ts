import { RefObject, useCallback } from 'react'
import { useSetAtom, useAtomValue } from '@einfach/react'
import { columnSizeMapAtom, columnIdShowListAtom } from '@grid-table/basic'
import type { VGridTableRef } from '@grid-table/core'

export function useColumnAutoSize(gridRef: RefObject<VGridTableRef>) {
  const setColumnSizeMap = useSetAtom(columnSizeMapAtom)
  const columnIdShowList = useAtomValue(columnIdShowListAtom)

  // 更新列宽到状态管理
  const updateColumnSizes = useCallback(
    (columnWidths: number[], indices: number[]) => {
      if (columnWidths.length === 0 || indices.length === 0) {
        return
      }

      setColumnSizeMap((prevSizeMap: Map<string, number>) => {
        const newSizeMap = new Map(prevSizeMap)

        // 根据索引更新对应的列宽
        indices.forEach((columnIndex, arrayIndex) => {
          if (arrayIndex < columnWidths.length && columnIndex < columnIdShowList.length) {
            const columnId = columnIdShowList[columnIndex]
            if (columnId) {
              newSizeMap.set(columnId, columnWidths[arrayIndex])
            }
          }
        })

        return newSizeMap
      })
    },
    [setColumnSizeMap, columnIdShowList],
  )

  // 计算并应用列宽
  const calculateColumnWidths = useCallback(() => {
    const result = gridRef.current?.calculateColumnWidths?.()
    if (result && result.columnWidths && result.columnIndexList) {
      updateColumnSizes(result.columnWidths, result.columnIndexList)
    }
  }, [gridRef, updateColumnSizes])

  return calculateColumnWidths
}
