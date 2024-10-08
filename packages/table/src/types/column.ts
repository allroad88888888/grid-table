import type { PositionId } from '@grid-table/basic/src'
import type { ReactNode } from 'react'

export type Align = 'left' | 'right' | 'center'

export interface ColumnType {
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
  render?: (text: string | undefined, rowInfo: Record<string, any>, param: PositionId) => ReactNode

  fixed?: 'left' | 'right'

  title?: ReactNode

  width?: number

  /**
   * 树形展开按钮显示
   */
  enabledExpand?: boolean
}
