import type { UseDataProps } from './common'
import type { UseRowSelectionProps } from '../plugins/select/useRowSelection'
import type { CSSProperties } from 'react'
import type { VGridTableProps } from '@grid-table/core'

export type AntdTableProps = {
  className?: string
  style?: CSSProperties
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

  /**
   * 复制功能是否启用
   * @default false
   */
  enableCopy?: boolean
  /**
   * 是否开启区域选中
   */
  enableSelectArea?: boolean
} & UseDataProps &
  Pick<
    VGridTableProps,
    | 'theadBaseSize'
    | 'rowBaseSize'
    | 'overRowCount'
    | 'overColumnCount'
    | 'columnBaseSize'
    | 'emptyComponent'
    | 'loadingComponent'
    | 'loading'
  >
