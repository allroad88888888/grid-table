import type { UseDataProps } from '../plugins/data/type/common'
import type { UseRowSelectionProps } from '../plugins/select/useRowSelection'

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
  /**
   * @default false
   */
  loading?: boolean
  /**
   * 开启勾选框
   */
  rowSelection?: UseRowSelectionProps
} & UseDataProps
