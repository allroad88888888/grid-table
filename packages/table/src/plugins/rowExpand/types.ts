import type { RowId } from '@grid-table/basic'
import type { ComponentType } from 'react'

export type ExpandedRowRenderProps<ItemInfo = Record<string, any>> = {
  rowData: ItemInfo
  rowId: RowId
  rowIndex: number
  collapse: () => void
}

export type ExpandIconProps = {
  expanded: boolean
  onToggle: () => void
  expandable: boolean
}

export type UseRowExpandProps<ItemInfo = Record<string, any>> = {
  expandedRowRender?: ComponentType<ExpandedRowRenderProps<ItemInfo>>
  expandedRowKeys?: RowId[]
  defaultExpandedRowKeys?: RowId[]
  onExpand?: (expanded: boolean, rowId: RowId, rowData: ItemInfo) => void
  onExpandedRowsChange?: (expandedRowKeys: RowId[]) => void
  rowExpandable?: (rowData: ItemInfo) => boolean
  accordion?: boolean
  expandedRowHeight?: number | 'auto'
  expandColumnWidth?: number
  expandColumnFixed?: 'left' | 'right'
}
