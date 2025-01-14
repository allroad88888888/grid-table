import type { PositionId } from '@grid-table/basic'
import type { ComponentType, CSSProperties, ReactNode } from 'react'

export type Align = 'left' | 'right' | 'center'

export interface ColumnType<ItemInfo = Record<string, any>> {
  /**
   * @default
   * left
   */
  align?: Align
  /**
   * 必填
   * for copy pasted
   */
  dataIndex?: string | string[]
  renderComponent?: ComponentType<CustomCellProps<ItemInfo>>
  render?: (text: string | undefined, rowInfo: ItemInfo, param: PositionId) => ReactNode

  fixed?: 'left' | 'right'

  title?: ReactNode

  titleComponent?: ComponentType<CustomHeaderCellProps>

  width?: number

  /**
   * 作为列名单独使用 不传会自动生成，
   * 合并行列 有作用
   */
  key?: string

  /**
   * 树形展开按钮显示
   */
  enabledExpand?: boolean
}

export interface CustomHeaderCellProps {
  param: PositionId
  style?: CSSProperties
  className?: string
  children?: ReactNode
}

export interface CustomCellProps<ItemInfo = Record<string, any>> {
  text: string | undefined
  rowInfo: ItemInfo
  param: PositionId & { rowIndex: number; colIndex: number }
}
