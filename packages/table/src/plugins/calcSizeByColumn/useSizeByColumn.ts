import { useCallback, useLayoutEffect } from 'react'
import { useAtomValue } from 'einfach-state'
import type { ColumnId } from '@grid-table/basic/src'
import { getIdByObj, useBasic } from '@grid-table/basic/src'
import type { ColumnType } from '../../types'

interface UseSizeByColumnProps {
  /**
   * 列最小宽度
   * @default 25
   */
  columnMinWidth?: number
  rowHeight: number
  rowCount: number
  wrapWidth: number
  columns: ColumnType[]
}

export function useCellSizeByColumn(props: UseSizeByColumnProps) {
  const { rowHeight, columnMinWidth = 25, wrapWidth, columns } = props
  const { store, columnIdShowListAtom, columnSizeMapAtom } = useBasic()

  /**
   * 监听columns变动
   */
  useLayoutEffect(() => {
    const nextMap = new Map<ColumnId, number>(store.getter(columnSizeMapAtom))
    columns.forEach((column) => {
      const columnId = getIdByObj(column)
      if (nextMap.has(columnId)) {
        return
      }
      nextMap.set(columnId, column.width || columnMinWidth)
    })
    store.setter(columnSizeMapAtom, nextMap)
  }, [columns, columnMinWidth, store, columnSizeMapAtom])

  /**
   * 监听 容器宽度
   */
  useLayoutEffect(() => {
    if (wrapWidth <= 0) {
      return
    }
    return store.setter(columnSizeMapAtom, (prevColumns) => {
      let remainingLength = wrapWidth - 2
      let hasPropWidthLength = 0

      for (const [, width] of prevColumns) {
        hasPropWidthLength += 1
        remainingLength -= width!
      }

      const columnShowIdList = store.getter(columnIdShowListAtom)

      const emptyWidthLength = columnShowIdList.length - hasPropWidthLength
      let autoItemWidth = columnMinWidth
      if (remainingLength > emptyWidthLength * columnMinWidth) {
        autoItemWidth = remainingLength / emptyWidthLength
      }

      let last = autoItemWidth

      if (autoItemWidth % 1 > 0) {
        autoItemWidth = Math.floor(autoItemWidth)
        last = autoItemWidth + 1
      }

      let temp = 0

      const next = new Map(prevColumns)
      columnShowIdList.forEach((columnId) => {
        if (prevColumns.has(columnId)) {
          return
        }
        next.set(columnId, temp === emptyWidthLength ? last : autoItemWidth)
        temp += 1
      })

      return next
    })
  }, [columnIdShowListAtom, columnMinWidth, columnSizeMapAtom, store, wrapWidth])

  const columnIdShowList = useAtomValue(columnIdShowListAtom)

  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const calcColumnSizeByIndex = useCallback(
    (index: number) => {
      const columnId = columnIdShowList[index]
      return columnSizeMap.has(columnId) ? columnSizeMap.get(columnId)! : columnMinWidth
    },
    [columnIdShowList, columnMinWidth, columnSizeMap],
  )

  const calcRowSizeByIndex = useCallback(() => {
    return rowHeight
  }, [rowHeight])

  const calcHeadRowSizeByIndex = useCallback(() => {
    return rowHeight
  }, [rowHeight])

  return {
    calcColumnSizeByIndex,
    calcRowSizeByIndex,
    calcHeadRowSizeByIndex,
  }
}
