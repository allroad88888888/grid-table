import type { ColumnId } from '@grid-table/basic'
import type { ComponentType } from 'react'

export type SortDirection = 'asc' | 'desc'

export type SortField = {
  columnId: ColumnId
  direction: SortDirection
}

export type SortState = SortField[]

export type SortCompareFn<ItemInfo = Record<string, any>> = (
  a: ItemInfo,
  b: ItemInfo,
) => number

export type SortIconProps = {
  direction: SortDirection | undefined
  priority: number | undefined
}

export type ColumnSortOptions<ItemInfo = Record<string, any>> = {
  sorter?: boolean | SortCompareFn<ItemInfo>
  defaultSortDirection?: SortDirection
  sortIcon?: ComponentType<SortIconProps>
}

export type UseSortProps<ItemInfo = Record<string, any>> = {
  sortState?: SortState
  onSortChange?: (sortState: SortState, prevState: SortState) => void
  remoteSort?: boolean
  enableMultiSort?: boolean
  sortCycle?: (SortDirection | null)[]
}
