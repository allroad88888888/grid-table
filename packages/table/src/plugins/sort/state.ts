import { atom } from '@einfach/react'
import type { ColumnId } from '@grid-table/basic'
import type { SortDirection, SortState } from './types'

/** 内部排序状态 */
export const sortStateAtom = atom<SortState>([])

/**
 * 列排序方向查询 Map（派生 atom）
 * 供表头组件读取当前列的排序方向和优先级
 */
export const columnSortInfoAtom = atom((getter) => {
  const sortState = getter(sortStateAtom)
  const map = new Map<ColumnId, { direction: SortDirection; priority: number }>()
  sortState.forEach((field, index) => {
    map.set(field.columnId, { direction: field.direction, priority: index + 1 })
  })
  return map
})

/**
 * 排序切换函数的 atom
 * useSort 写入 toggleSort 回调，CellThead 读取并调用
 */
export const sortToggleAtom = atom<((columnId: ColumnId, multiSort: boolean) => void) | null>(null)
