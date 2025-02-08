import { atom } from '@einfach/state'
import type { ColumnType } from '../../types'
import type { ColumnId } from '@grid-table/basic'
import { columnSizeMapAtom } from '@grid-table/basic'
import { getColumnId } from '../../utils/getColumnId'

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
    }: {
      columnMinWidth: number
    },
  ) => {
    const nextMap = new Map<ColumnId, number>(getter(columnSizeMapAtom))
    columns.forEach((column) => {
      const columnId = getColumnId(column)
      if (nextMap.has(columnId)) {
        return
      }
      nextMap.set(columnId, column.width || columnMinWidth)
    })
    setter(columnSizeMapAtom, nextMap)
  },
)
