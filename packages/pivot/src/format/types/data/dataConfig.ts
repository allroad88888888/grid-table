import type { TreePropsItem } from '../../../tree/type'
import type { Data } from './data'
import type { FilterParam } from './filter'
import type { SortParams } from './sort'

export interface Meta {
  field: string
  name: string
}

export declare interface CustomTreeItem {
  key: string
  title: string
  collapsed?: boolean
  description?: string
  children?: CustomTreeItem[]
}

export interface Fields {
  rows: string[]
  columns: string[]
  values: string[]
  customTreeItems?: CustomTreeItem[]
  /**
   * @default true
   */
  valueInCols?: boolean
}

export interface TreeInfo {
  /**
   * 关系
   */
  relation: Record<string, string[]>
  /**
   * 关系是哪个字段
   */
  relationProp: string
  /**
   * 形成关系 是哪个字段
   */
  relationSetProp: string
}

export interface DataConfig {
  fields: Fields
  meta?: Meta[]
  data: Data[]
  totalData?: Data[]
  sortParams?: SortParams
  filterParams?: FilterParam[]
  treeRow?: TreePropsItem
  treeColumn?: TreePropsItem

  [key: string]: unknown
}
