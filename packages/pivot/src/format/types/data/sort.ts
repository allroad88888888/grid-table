export type SortMethod = 'ASC' | 'DESC' | 'asc' | 'desc'

export interface Sort {
  /** 字段id，业务中一般是displayId */
  sortFieldId: string
  sortMethod?: SortMethod
  /** 自定义排序 */
  sortBy?: string[]
  /** 按照数值字段排序 */
  sortByMeasure?: string
  /** 筛选条件，缩小排序范围 */
  query?: Record<string, any>
  /** 组内排序用来显示icon */
  type?: string
}

export interface SortFuncParam extends Sort {
  data: Array<string | Record<string, any>>
}
export interface SortParam extends Sort {
  /** 自定义func */
  sortFunc?: (v: SortFuncParam) => Array<string | Record<string, any>>
}

export type SortParams = SortParam[]
