import type { Store } from '@einfach/react'
import type { ComponentType, CSSProperties } from 'react'

export type Id = string

export type Relation = Record<string, Id[]>

export interface DataTodoProps {
  /**
   * 跟节点是啥
   * @default ROOT
   */
  root?: string
  /**
   * 默认展开几个层级
   * @default 2
   */
  expendLevel?: number
  /**
   * 整棵树少于多少个，就全部展开
   *
   * 这个优先级大于expendLevel
   * @default 100
   */
  minLengthExpandAll?: number
  /**
   * 是否强制平铺
   * @default false
   */
  isTiling?: boolean
  /**
   * 头部禁用id是否留着
   * @default false
   */
  keepTopDisabled?: boolean
  /**
   * 前端禁用ids
   */
  disabledIds?: string[]
  /**
   * 是否显示root节点
   * @default false
   */
  showRoot?: boolean
}

export interface GridTreeItemOptions {
  /**
   * 每一行高度
   */
  size?: number
  /**
   * 没多一层-前置size多少
   * @default 24
   */
  levelSize?: number
  /**
   * @default li
   */
  itemTag?: 'div' | 'li'

  ContentComponent?: ComponentType<{ id: Id }>

  itemClassName?: string
}

export interface GridTreeViewOptions {
  style?: CSSProperties
  className?: string
  /**
   * @default ul
   */
  tag?: 'div' | 'ul'
  // 下面都是作用于 每一行上

  ItemComponent?: ComponentType<{ index: number; style: CSSProperties }>

  /**
   * 不管虚拟滚动怎么滚，都会保留的id
   */
  stayIds?: Id[]
}

export interface GridTreeProps extends DataTodoProps, GridTreeViewOptions, GridTreeItemOptions {
  relation: Relation
  overscanCount?: number
  store?: Store
}
