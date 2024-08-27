import type { UseDataProps } from '../plugins/data/type/common'

export type AntdTableProps = {
  /**
   * @default true
   */
  bordered?: boolean
  /**
   * 行高度
   * @default 36
   */
  rowHeight?: number
  /**
   * 单元格默认宽度
   * @default 80
   */
  cellDefaultWidth?: number
  // columns: ColumnType[]
  // /**
  //  * 数据
  //  */
  // dataSource: object[]
  /**
   * @default false
   */
  loading?: boolean
  //   sticky?: boolean
} & UseDataProps
