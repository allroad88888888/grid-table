import type { RowId } from '@grid-table/basic'

export interface TreePropsItem {
  relation?: Record<RowId, RowId[]>
  propId?: string
}

export interface TreeProps {
  treeRow?: TreePropsItem
  treeColumn?: TreePropsItem
}

export interface UseTreeProps extends TreePropsItem {}
