import { useCallback, useMemo } from 'react'
import { useAtomValue, useStore, selectAtom } from '@einfach/react'
import type { ColumnId } from '@grid-table/basic'
import { columnSortInfoAtom } from './state'
import type { SortDirection } from './types'

/**
 * 表头单元格使用，获取排序方向和切换回调
 */
export function useSortHeader(
  columnId: ColumnId,
  toggleSort: (columnId: ColumnId, multiSort: boolean) => void,
): {
  direction: SortDirection | undefined
  priority: number | undefined
  onToggleSort: (e: React.MouseEvent) => void
} {
  const store = useStore()

  const sortInfoAtom = useMemo(
    () =>
      selectAtom(columnSortInfoAtom, (map) => {
        const info = map.get(columnId)
        return info ?? null
      }),
    [columnId],
  )

  const sortInfo = useAtomValue(sortInfoAtom, { store })

  const onToggleSort = useCallback(
    (e: React.MouseEvent) => {
      toggleSort(columnId, e.shiftKey)
    },
    [columnId, toggleSort],
  )

  return {
    direction: sortInfo?.direction,
    priority: sortInfo?.priority,
    onToggleSort,
  }
}
