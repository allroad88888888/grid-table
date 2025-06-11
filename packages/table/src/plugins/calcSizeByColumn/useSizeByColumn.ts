import { useCallback, useEffect } from 'react'
import { useAtomValue, useSetAtom, useStore } from '@einfach/react'
import { rowIdShowListAtom, rowSizeMapAtom, useBasic } from '@grid-table/basic'
import type { ColumnType } from '../../types'
import { distributeToNewArray } from './utils'
import { initColumnsSizeByColumnsAtom } from './state'

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
  const { columnIdShowListAtom, columnSizeMapAtom } = useBasic()
  const store = useStore()
  const initColumnsSizeByColumns = useSetAtom(initColumnsSizeByColumnsAtom)

  /**
   * 监听columns变动
   */
  useEffect(() => {
    initColumnsSizeByColumns(columns, { columnMinWidth })
  }, [columns, columnMinWidth, initColumnsSizeByColumns])

  /**
   * 监听 容器宽度
   */
  useEffect(() => {
    if (wrapWidth <= 0) {
      return
    }

    return store.setter(columnSizeMapAtom, (prevColumns) => {
      const remainingLength = wrapWidth - 2

      const columnShowIdList = store.getter(columnIdShowListAtom)
      const currentTotalWidth = columnShowIdList.reduce<number>((prev, tId) => {
        return prev + prevColumns.get(tId)!
      }, 0)

      // 表格宽度大于容器宽度 啥也不做
      if (currentTotalWidth >= remainingLength) {
        return prevColumns
      }

      const newWidthList = distributeToNewArray(
        columnShowIdList.map((tId) => {
          return prevColumns.get(tId)!
        }),
        remainingLength,
      )

      const next = new Map(prevColumns)
      columnShowIdList.forEach((tId, index) => {
        next.set(tId, newWidthList[index])
      })

      let total = 0

      next.forEach((value, key) => {
        total += value
      })

      return next
    })
  }, [columnIdShowListAtom, columnMinWidth, columnSizeMapAtom, store, wrapWidth])

  const columnIdShowList = useAtomValue(columnIdShowListAtom, { store })

  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const calcColumnSizeByIndex = useCallback(
    (index: number) => {
      const columnId = columnIdShowList[index]
      return columnSizeMap.has(columnId) ? columnSizeMap.get(columnId)! : columnMinWidth
    },
    [columnIdShowList, columnMinWidth, columnSizeMap],
  )

  const rowSizeMap = useAtomValue(rowSizeMapAtom, { store })
  const rowIdShowList = useAtomValue(rowIdShowListAtom, { store })

  const calcRowSizeByIndex = useCallback(
    (index: number) => {
      const rowId = rowIdShowList[index]
      return rowSizeMap.get(rowId)!
    },
    [rowIdShowList, rowSizeMap],
  )

  const calcHeadRowSizeByIndex = useCallback(() => {
    return rowHeight
  }, [rowHeight])

  return {
    calcColumnSizeByIndex,
    calcRowSizeByIndex,
    calcHeadRowSizeByIndex,
  }
}
