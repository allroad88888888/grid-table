import { useCallback, useEffect } from 'react'
import { atom, useAtomValue, useSetAtom, useStore } from '@einfach/react'
import {
  columnIdShowListAtom,
  columnSizeMapAtom,
  rowIdShowListAtom,
  rowSizeMapAtom,
  useBasic,
} from '@grid-table/basic'
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

const proportionalResizeColumnAtom = atom(false, (getter, setter, wrapWidth: number) => {
  const prevColumns = getter(columnSizeMapAtom)
  const remainingLength = wrapWidth - 2

  const columnShowIdList = getter(columnIdShowListAtom)
  const currentTotalWidth = columnShowIdList.reduce<number>((prev, tId) => {
    return prev + prevColumns.get(tId)!
  }, 0)

  // 表格宽度大于等于容器宽度 啥也不做
  if (currentTotalWidth >= remainingLength) {
    return
  }

  // 获取当前列宽数组
  const currentWidths = columnShowIdList.map((tId) => {
    return prevColumns.get(tId)!
  })

  // 使用新的平均分配函数
  const newWidthList = distributeToNewArray(currentWidths, remainingLength)

  console.log(`newWidthList`, newWidthList)
  // 更新列宽映射
  const next = new Map(prevColumns)
  columnShowIdList.forEach((tId, index) => {
    next.set(tId, newWidthList[index])
  })

  setter(columnSizeMapAtom, next)
})

export function useCellSizeByColumn(props: UseSizeByColumnProps) {
  const { rowHeight, columnMinWidth = 25, wrapWidth, columns } = props
  const { columnIdShowListAtom } = useBasic()
  const store = useStore()
  const initColumnsSizeByColumns = useSetAtom(initColumnsSizeByColumnsAtom)

  const proportionalResizeColumn = useSetAtom(proportionalResizeColumnAtom)

  /**
   * 监听columns变动
   */
  useEffect(() => {
    initColumnsSizeByColumns(columns, { columnMinWidth, wrapWidth: wrapWidth })
  }, [columns, columnMinWidth, initColumnsSizeByColumns])

  /**
   * 监听 容器宽度
   */
  useEffect(() => {
    if (wrapWidth <= 0) {
      return
    }
    proportionalResizeColumn(wrapWidth)
  }, [columnIdShowListAtom, columnMinWidth, columnSizeMapAtom, store, wrapWidth, columns])

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
