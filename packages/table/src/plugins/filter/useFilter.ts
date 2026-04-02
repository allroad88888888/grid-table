import { useEffect, useCallback } from 'react'
import { useStore } from '@einfach/react'
import { useBasic } from '@grid-table/basic'
import type { ColumnId } from '@grid-table/basic'
import { easyGet } from '@einfach/utils'
import { getColumnOptionAtomByColumnId, getRowInfoAtomByRowId } from '../../stateCore'
import { filterStateAtom } from './state'
import { matchFilter } from './filterUtils'
import type { FilterValue, UseFilterProps } from './types'

export function useFilter(props: UseFilterProps = {}) {
  const { filterState: controlledFilterState, onFilterChange, remoteFilter = false } = props

  const store = useStore()
  const { rowIdShowListAtom } = useBasic()

  // 受控模式：外部 filterState 同步到内部 atom
  useEffect(() => {
    if (controlledFilterState !== undefined) {
      store.setter(filterStateAtom, controlledFilterState)
    }
  }, [controlledFilterState, store])

  // 非服务端模式：过滤逻辑修改 rowIdShowListAtom
  useEffect(() => {
    if (remoteFilter) return

    return store.setter(rowIdShowListAtom, (getter, prev) => {
      const currentFilterState = getter(filterStateAtom)
      if (currentFilterState.size === 0) return prev

      return prev.filter((rowId) => {
        const rowInfo = getter(getRowInfoAtomByRowId(rowId))
        if (!rowInfo) return true

        // AND 逻辑：所有列的过滤条件都要满足
        for (const [columnId, filterValue] of currentFilterState) {
          const columnOption = getter(getColumnOptionAtomByColumnId(columnId))

          // 如果列配置了自定义 filterFn，优先使用
          if (columnOption?.filterFn) {
            if (!columnOption.filterFn(rowInfo, filterValue)) {
              return false
            }
            continue
          }

          // 使用 dataIndex 获取单元格值
          const { dataIndex } = columnOption ?? {}
          const cellValue = dataIndex ? easyGet(rowInfo, dataIndex) : undefined

          if (!matchFilter(cellValue, filterValue)) {
            return false
          }
        }
        return true
      })
    })
  }, [remoteFilter, rowIdShowListAtom, store])

  // 设置单列过滤
  const setColumnFilter = useCallback(
    (columnId: ColumnId, value: FilterValue | null) => {
      const prevState = store.getter(filterStateAtom)
      const nextState = new Map(prevState)

      if (value === null) {
        nextState.delete(columnId)
      } else {
        nextState.set(columnId, value)
      }

      // 非受控模式下更新内部状态
      if (controlledFilterState === undefined) {
        store.setter(filterStateAtom, nextState)
      }

      onFilterChange?.(nextState)
    },
    [store, controlledFilterState, onFilterChange],
  )

  // 清除过滤
  const clearFilter = useCallback(
    (columnId?: ColumnId) => {
      const prevState = store.getter(filterStateAtom)
      let nextState: Map<ColumnId, FilterValue>

      if (columnId !== undefined) {
        nextState = new Map(prevState)
        nextState.delete(columnId)
      } else {
        nextState = new Map()
      }

      if (controlledFilterState === undefined) {
        store.setter(filterStateAtom, nextState)
      }

      onFilterChange?.(nextState)
    },
    [store, controlledFilterState, onFilterChange],
  )

  return { setColumnFilter, clearFilter }
}
