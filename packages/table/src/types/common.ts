import type { RowId } from '@grid-table/basic'
import type { ColumnType } from './column'

export type DataItem = Record<string, any>

export type UseDataProps<ItemInfo extends DataItem = DataItem> = {
  dataSource: ItemInfo[]
  columns: ColumnType[]
  root?: string
  rowHeight?: number
  headerDataSource?: ItemInfo[]
  // parentProp?: keyof ItemInfo
  idProp?: keyof ItemInfo
} & (
  | {
      parentProp: string
      relation?: never
    }
  | {
      parentProp?: never
      relation: Record<RowId, RowId[]>
    }
  | {
      parentProp?: never
      relation?: never
    }
)
