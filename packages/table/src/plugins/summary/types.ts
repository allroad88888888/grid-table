import type { ColumnId } from '@grid-table/basic'
import type { ComponentType, CSSProperties, ReactNode } from 'react'

export type BuiltinAggregation = 'sum' | 'avg' | 'count' | 'min' | 'max'

export type AggregationFn<ItemInfo = Record<string, any>> = (
  values: unknown[],
  rowDataList: ItemInfo[],
) => ReactNode

export type SummaryCellProps<ItemInfo = Record<string, any>> = {
  columnId: ColumnId
  values: unknown[]
  rowDataList: ItemInfo[]
  summaryIndex: number
}

export type SummaryRowConfig<ItemInfo = Record<string, any>> = {
  key?: string
  cells?: Record<string, BuiltinAggregation | AggregationFn<ItemInfo>>
  render?: ComponentType<{
    rowDataList: ItemInfo[]
    summaryIndex: number
  }>
  className?: string
  style?: CSSProperties
}

export type UseSummaryProps<ItemInfo = Record<string, any>> = {
  summary?: SummaryRowConfig<ItemInfo> | SummaryRowConfig<ItemInfo>[]
  summaryPosition?: 'top' | 'bottom'
  summarySticky?: boolean
  summaryRowHeight?: number
}
