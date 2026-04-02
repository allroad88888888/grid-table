import type { ColumnId, RowId } from '@grid-table/basic'
import type { ComponentType } from 'react'

export type GroupByConfig = {
  columnId: ColumnId
  groupValueGetter?: (rowData: Record<string, any>) => unknown
  sort?: 'asc' | 'desc' | ((a: unknown, b: unknown) => number)
}

export type GroupInfo = {
  groupKey: string
  groupValue: unknown
  columnId: ColumnId
  rowCount: number
  depth: number
  parentGroupKey?: string
}

export type GroupRowRenderProps<ItemInfo = Record<string, any>> = {
  groupInfo: GroupInfo
  rowDataList: ItemInfo[]
  expanded: boolean
  onToggle: () => void
  indentLevel: number
}

export type UseRowGroupProps<ItemInfo = Record<string, any>> = {
  groupBy?: GroupByConfig | GroupByConfig[]
  groupRowRender?: ComponentType<GroupRowRenderProps<ItemInfo>>
  defaultExpandedGroupKeys?: string[]
  expandedGroupKeys?: string[]
  onGroupExpand?: (expanded: boolean, groupInfo: GroupInfo) => void
  defaultExpandAll?: boolean
  groupRowHeight?: number
  groupRowClassName?: string | ((groupInfo: GroupInfo) => string)
  indentWidth?: number
}
