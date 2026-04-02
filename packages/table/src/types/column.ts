import type { PositionId } from '@grid-table/basic'
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import type { SortCompareFn, SortDirection, SortIconProps } from '../plugins/sort/types'
import type { FilterFn, FilterOption, FilterValue } from '../plugins/filter/types'

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

  /**
   * 是否启用区域选中
   * @default true
   */
  enableSelectArea?: boolean

  /**
   * 等比宽度放大系数，当有剩余空间时用于计算该列的放大比例
   * @default 1
   * 0 表示不参与放大
   */
  flexGrow?: number

  /**
   * 自定义列className
   */
  className?: string

  /**
   * 排序配置
   * - true: 使用默认比较（数字优先，fallback localeCompare）
   * - function: 自定义比较函数
   * - false | undefined: 不可排序
   */
  sorter?: boolean | SortCompareFn<ItemInfo>

  /**
   * 默认排序方向
   */
  defaultSortDirection?: SortDirection

  /**
   * 自定义排序图标
   */
  sortIcon?: ComponentType<SortIconProps>

  /**
   * 过滤类型
   */
  filterType?: 'text' | 'number' | 'select'

  /**
   * 自定义过滤函数
   */
  filterFn?: FilterFn<ItemInfo>

  /**
   * 选择过滤的选项列表
   */
  filterOptions?: FilterOption[]

  /**
   * 默认过滤值
   */
  defaultFilterValue?: FilterValue
}

export interface CustomHeaderCellProps {
  position: PositionId & { rowIndex: number; colIndex: number }
  style?: CSSProperties
  className?: string
  children?: ReactNode
}

export interface CustomCellProps<ItemInfo = Record<string, any>> {
  text: string | undefined
  rowInfo: ItemInfo
  position: PositionId & { rowIndex: number; colIndex: number }
}
