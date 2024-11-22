export declare type DataType = Record<string, any>

export interface FilterParam {
  filterKey: string
  filteredValues?: unknown[]
  customFilter?: (row: DataType) => boolean
}
