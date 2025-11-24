import { atom } from '@einfach/react'
import type { ColumnType } from '../../types'
import type { ColumnId } from '@grid-table/basic'
import { columnSizeMapAtom } from '@grid-table/basic'
import { getColumnId } from '../../utils/getColumnId'
import { distributeColumnWidths } from './utils'

export const initSizeAtom = atom<Map<ColumnId, number> | undefined>(undefined)
/**
 * 初始化 列 宽度
 */
export const initColumnsSizeByColumnsAtom = atom(
  0,
  (
    getter,
    setter,
    columns: ColumnType[],
    {
      columnMinWidth,
      wrapWidth,
    }: {
      columnMinWidth: number
      wrapWidth: number
    },
  ) => {
    const nextMap = new Map<ColumnId, number>(getter(columnSizeMapAtom))

    // 检查是否有新的列需要初始化
    const newColumns = columns.filter((column) => {
      const columnId = getColumnId(column)
      return !nextMap.has(columnId)
    })

    // 如果没有新列需要初始化，直接返回
    if (newColumns.length === 0) {
      return
    }

    // 使用新的分配方法计算列宽
    const distributedWidths = distributeColumnWidths(newColumns, wrapWidth, columnMinWidth)

    // 将计算出的宽度设置到 map 中
    newColumns.forEach((column, index) => {
      const columnId = getColumnId(column)
      nextMap.set(columnId, distributedWidths[index])
    })

    setter(initSizeAtom, nextMap)

    setter(columnSizeMapAtom, nextMap)
  },
)
