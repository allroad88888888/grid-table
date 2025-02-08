import type { RowId } from '@grid-table/basic'
import type { ColumnType } from './column'

export type DataItem = Record<string, any>

export interface TreeProps<ItemInfo extends DataItem = DataItem> {
  parentProp: keyof ItemInfo
  idProp: keyof ItemInfo
}

export interface TreeRelationProps {
  relation: Record<RowId, RowId[]>
}

export type UseDataProps<ItemInfo extends DataItem = DataItem> = {
  dataSource: ItemInfo[]
  columns: ColumnType[]
  root?: string
  rowHeight?: number
  headerDataSource?: ItemInfo[]
  parentProp?: keyof ItemInfo
  idProp?: keyof ItemInfo
}
