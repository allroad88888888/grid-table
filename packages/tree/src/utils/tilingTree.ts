export interface TilingTreeDataProps<T> {
  dataList: T[]
  // @default ROOT
  root?: string
  idProp?: keyof T
  parentProp?: keyof T
}
