import type { PositionId } from '@grid-table/basic'
import type { ComponentType, ReactNode } from 'react'

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
  renderComponent?: ComponentType<{
    text: string | undefined
    rowInfo: ItemInfo
    param: PositionId
  }>
  render?: (text: string | undefined, rowInfo: ItemInfo, param: PositionId) => ReactNode

  fixed?: 'left' | 'right'

  title?: ReactNode

  width?: number

  /**
   * 树形展开按钮显示
   */
  enabledExpand?: boolean
}
