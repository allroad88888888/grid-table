import type { CSSProperties, ReactNode } from 'react'
import type { GridTreeProps } from '@grid-tree/core'

// 树形数据节点类型
export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  disabled?: boolean
  [key: string]: any
}

// 树形关系数据类型（兼容现有格式）
export type TreeRelation = Record<string, string[]>

// 选择值类型
export type SelectValue = string | string[]

// TreeSelect 组件属性
export interface TreeSelectProps {
  // 数据源 - 支持两种格式
  data?: TreeNode[]
  relation?: TreeRelation

  // 选择控制
  value?: SelectValue
  defaultValue?: SelectValue
  onChange?: (value: SelectValue, node?: TreeNode | TreeNode[]) => void

  // 状态控制
  disabled?: boolean
  readonly?: boolean
  loading?: boolean

  // 显示控制
  placeholder?: string
  allowClear?: boolean
  showSearch?: boolean

  // 选择模式
  multiple?: boolean
  checkable?: boolean
  /** 多选时是否需要确认（显示确定/取消按钮） */
  confirmSelect?: boolean
  /** 是否显示已选中项面板（类似穿梭框效果） */
  showSelectedPanel?: boolean

  // 样式控制
  className?: string
  style?: CSSProperties
  dropdownClassName?: string
  dropdownStyle?: CSSProperties

  // 尺寸
  size?: 'small' | 'middle' | 'large'

  // 下拉配置
  dropdownMatchSelectWidth?: boolean
  dropdownMaxHeight?: number
  maxTagCount?: number
  autoMaxTagCount?: boolean
  /** 是否在组件内联渲染下拉菜单，而不是使用Portal渲染到body */
  renderInline?: boolean

  // 树形配置（继承自GridTree）
  /**
   * GridTree 的完整配置对象
   * 可以传递所有 GridTree 参数，未来 GridTree 新增参数也会自动支持
   *
   * 常用参数示例：
   * - showRoot: 是否显示根节点
   * - root: 根节点ID
   * - expendLevel: 默认展开层级
   * - levelSize: 层级缩进大小
   * - size: 项目高度
   * - minLengthExpandAll: 少于多少节点时自动全部展开
   * - isTiling: 是否强制平铺
   * - disabledIds: 前端禁用的节点ids
   * - overscanCount: 虚拟滚动预渲染数量
   * - stayIds: 固定显示的节点列表
   * - itemTag: 每一项的标签类型
   * - tag: 容器标签类型
   * - itemClassName: 自定义项目样式类名
   * - store: @einfach/react 的 Store 实例
   */
  treeProps?: Partial<Omit<GridTreeProps, 'relation'>>

  // 事件
  onDropdownVisibleChange?: (visible: boolean) => void
  onFocus?: () => void
  onBlur?: () => void

  // 自定义渲染
  suffixIcon?: ReactNode
  clearIcon?: ReactNode
  notFoundContent?: ReactNode
  /** 自定义复选框渲染（多选模式） */
  renderCheckbox?: (params: {
    isSelected: boolean
    disabled: boolean
    node: TreeNode
    multiple: boolean
  }) => ReactNode
  /** 自定义选中图标渲染（单选模式） */
  renderSelectedIcon?: (params: {
    isSelected: boolean
    disabled: boolean
    node: TreeNode
    multiple: boolean
  }) => ReactNode
  /** 自定义节点内容渲染 */
  renderItem?: (params: {
    node: TreeNode
    isSelected: boolean
    disabled: boolean
    multiple: boolean
    onSelect: (id: string, node: TreeNode) => void
  }) => ReactNode
}

// 下拉容器属性
export interface DropdownProps {
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  children: ReactNode
  overlay: ReactNode
  className?: string
  style?: CSSProperties
  getPopupContainer?: () => HTMLElement
  dropdownRef?: React.RefObject<HTMLDivElement>
  /** 是否在组件内联渲染下拉菜单 */
  renderInline?: boolean
}

// 选择状态
export interface SelectionState {
  selectedValue: SelectValue
  selectedNodes: TreeNode[]
  visible: boolean
}

// Hook返回类型
export interface UseSelectionReturn {
  selectedValue: SelectValue
  selectedNodes: TreeNode[]
  handleSelect: (value: string, node: TreeNode) => void
  handleClear: () => void
  getDisplayLabel: () => string
}

export interface UseDropdownReturn {
  visible: boolean
  setVisible: (visible: boolean) => void
  handleToggle: () => void
  handleClose: () => void
  containerRef: React.RefObject<HTMLDivElement>
  dropdownRef: React.RefObject<HTMLDivElement>
}

// TreeList 组件类型导出
export type { TreeListProps } from './TreeList'
