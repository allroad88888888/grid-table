import type { ColumnId } from '@grid-table/basic'
import type { ReactNode } from 'react'

export type TextFilterOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith'
export type NumberFilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'between'
export type SelectFilterOperator = 'include'

export type TextFilterValue = {
  type: 'text'
  operator: TextFilterOperator
  value: string
}

export type NumberFilterValue = {
  type: 'number'
  operator: NumberFilterOperator
  value: number | [number, number]
}

export type SelectFilterValue = {
  type: 'select'
  operator: SelectFilterOperator
  value: unknown[]
}

export type FilterValue = TextFilterValue | NumberFilterValue | SelectFilterValue

export type FilterState = Map<ColumnId, FilterValue>

export type FilterFn<ItemInfo = Record<string, any>> = (
  rowData: ItemInfo,
  filterValue: FilterValue,
) => boolean

export type FilterOption = {
  label: ReactNode
  value: unknown
}

export type ColumnFilterOptions<ItemInfo = Record<string, any>> = {
  filterType?: 'text' | 'number' | 'select'
  filterFn?: FilterFn<ItemInfo>
  filterOptions?: FilterOption[]
  defaultFilterValue?: FilterValue
}

export type UseFilterProps = {
  filterState?: FilterState
  onFilterChange?: (filterState: FilterState) => void
  remoteFilter?: boolean
}
