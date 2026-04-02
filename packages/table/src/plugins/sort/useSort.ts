import { useEffect, useCallback } from 'react'
import { useStore } from '@einfach/react'
import { useBasic } from '@grid-table/basic'
import type { ColumnId } from '@grid-table/basic'
import { easyGet } from '@einfach/utils'
import { getColumnOptionAtomByColumnId, getRowInfoAtomByRowId } from '../../stateCore'
import { sortStateAtom, sortToggleAtom } from './state'
import type { SortDirection, SortState, UseSortProps } from './types'

const DEFAULT_SORT_CYCLE: (SortDirection | null)[] = ['asc', 'desc', null]

/**
 * 默认比较函数：数字优先，fallback localeCompare
 */
function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1

  const numA = Number(a)
  const numB = Number(b)
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
    return numA - numB
  }

  return String(a).localeCompare(String(b))
}

export function useSort<ItemInfo = Record<string, any>>(
  props: UseSortProps<ItemInfo> = {},
) {
  const {
    sortState: controlledSortState,
    onSortChange,
    remoteSort = false,
    enableMultiSort = true,
    sortCycle = DEFAULT_SORT_CYCLE,
  } = props

  const store = useStore()
  const { rowIdShowListAtom } = useBasic()

  // 受控模式：外部 sortState 同步到内部 atom
  useEffect(() => {
    if (controlledSortState !== undefined) {
      store.setter(sortStateAtom, controlledSortState)
    }
  }, [controlledSortState, store])

  // 非服务端模式：排序逻辑修改 rowIdShowListAtom
  useEffect(() => {
    if (remoteSort) return

    return store.setter(rowIdShowListAtom, (getter, prev) => {
      const sortState = getter(sortStateAtom)
      if (sortState.length === 0) return prev

      // 检查是否有可排序列
      const sortableFields = sortState.filter((f) => {
        const opt = getter(getColumnOptionAtomByColumnId(f.columnId))
        return !!opt?.sorter
      })
      if (sortableFields.length === 0) return prev

      const sorted = [...prev]

      sorted.sort((rowIdA, rowIdB) => {
        for (const field of sortState) {
          const columnOption = getter(getColumnOptionAtomByColumnId(field.columnId))
          if (!columnOption?.sorter) continue

          const { dataIndex } = columnOption
          let cmp: number

          if (typeof columnOption.sorter === 'function') {
            const rowInfoA = getter(getRowInfoAtomByRowId(rowIdA)) as ItemInfo
            const rowInfoB = getter(getRowInfoAtomByRowId(rowIdB)) as ItemInfo
            if (!rowInfoA || !rowInfoB) continue
            cmp = columnOption.sorter(rowInfoA, rowInfoB)
          } else {
            const valA = dataIndex
              ? easyGet(getter(getRowInfoAtomByRowId(rowIdA)), dataIndex)
              : undefined
            const valB = dataIndex
              ? easyGet(getter(getRowInfoAtomByRowId(rowIdB)), dataIndex)
              : undefined
            cmp = defaultCompare(valA, valB)
          }

          if (cmp !== 0) {
            return field.direction === 'asc' ? cmp : -cmp
          }
        }
        return 0
      })

      return sorted
    })
  }, [remoteSort, rowIdShowListAtom, store])

  // 切换排序方向
  const toggleSort = useCallback(
    (columnId: ColumnId, multiSort: boolean) => {
      const prevState = store.getter(sortStateAtom)
      const existingIndex = prevState.findIndex((f) => f.columnId === columnId)
      const existingField = existingIndex >= 0 ? prevState[existingIndex] : undefined

      // 根据 cycle 获取下一个方向
      const currentDirection = existingField?.direction ?? null
      const currentCycleIndex = sortCycle.indexOf(currentDirection)
      const nextDirection = sortCycle[(currentCycleIndex + 1) % sortCycle.length]

      let nextState: SortState

      if (multiSort && enableMultiSort) {
        // 多列排序：追加或更新
        nextState = prevState.filter((f) => f.columnId !== columnId)
        if (nextDirection !== null) {
          nextState.push({ columnId, direction: nextDirection })
        }
      } else {
        // 单列排序：替换
        if (nextDirection === null) {
          nextState = []
        } else {
          nextState = [{ columnId, direction: nextDirection }]
        }
      }

      // 非受控模式下更新内部状态
      if (controlledSortState === undefined) {
        store.setter(sortStateAtom, nextState)
      }

      onSortChange?.(nextState, prevState)
    },
    [store, sortCycle, enableMultiSort, controlledSortState, onSortChange],
  )

  // 写入 atom 供 CellThead 读取
  useEffect(() => {
    store.setter(sortToggleAtom, () => toggleSort)
    return () => {
      store.setter(sortToggleAtom, null)
    }
  }, [store, toggleSort])

  return { toggleSort }
}
