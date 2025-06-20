import type { UseDataProps } from './common'
import type { UseRowSelectionProps } from '../plugins/select/useRowSelection'
import type { CSSProperties } from 'react'
import type { VGridTableProps } from '@grid-table/core'
import type { CopyProps } from '../plugins'
import type { Store } from '@einfach/react'

export type AntdTableProps = {
  className?: string
  style?: CSSProperties
  /**
   * @default true
   */
  bordered?:
    | boolean
    | 'dotted'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset'
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
  // enableCopy?: boolean
  /**
   * 是否开启区域选中
   */
  enableSelectArea?: boolean
  /**
   * header 右键
   */
  enableHeadContextMenu?: boolean
  store?: Store
} & CopyProps &
  UseDataProps &
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
