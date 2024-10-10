import type { ColumnType } from './column'

export type DataItem = Record<string, any>

export type UseDataProps<ItemInfo extends DataItem = DataItem> = {
  dataSource: ItemInfo[]
  columns: ColumnType[]
  parentProp?: keyof ItemInfo
  idProp?: keyof ItemInfo
  root?: string
}
