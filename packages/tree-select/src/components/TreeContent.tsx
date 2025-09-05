import clsx from 'clsx'
import type { TreeNode } from '../types'
import type { ReactNode } from 'react'

/**
 * 树节点内容组件属性
 */
export interface TreeContentProps {
  /** 节点ID */
  id: string
  /** 节点映射表 */
  nodeMap: Map<string, TreeNode>
  /** 当前选中值 */
  selectedValue: string | string[]
  /** 是否多选 */
  multiple: boolean
  /** 选择回调 */
  onSelect: (id: string, node: TreeNode) => void
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

/**
 * 树节点内容组件
 * 负责渲染单个树节点的显示内容和交互
 */
export function TreeContent({
  id,
  nodeMap,
  selectedValue,
  multiple,
  onSelect,
  renderCheckbox,
  renderSelectedIcon,
  renderItem,
}: TreeContentProps) {
  const node = nodeMap.get(id)
  if (!node) return <span>{id}</span>

  const isSelected = multiple
    ? Array.isArray(selectedValue) && selectedValue.includes(id)
    : selectedValue === id

  const handleClick = () => {
    // 禁用节点不响应点击事件
    if (node.disabled) {
      return
    }
    onSelect(id, node)
  }

  // 渲染复选框（多选模式）
  const renderCheckboxElement = () => {
    if (!multiple) return null

    if (renderCheckbox) {
      return (
        <span className="tree-select-node-custom-checkbox">
          {renderCheckbox({
            isSelected,
            disabled: !!node.disabled,
            node,
            multiple,
          })}
        </span>
      )
    }

    return (
      <input
        type="checkbox"
        checked={isSelected}
        disabled={!!node.disabled}
        className={clsx('tree-select-node-checkbox', {
          'tree-select-node-checkbox-checked': isSelected,
          'tree-select-node-checkbox-disabled': node.disabled,
        })}
        onChange={() => {
          // 由父元素的onClick处理选择逻辑，这里阻止默认行为
        }}
        onClick={(e) => {
          // 阻止checkbox自身的点击事件冒泡，避免重复触发
          e.stopPropagation()
        }}
        readOnly
      />
    )
  }

  // 渲染选中图标（单选模式）
  const renderSelectedIconElement = () => {
    if (multiple || !isSelected) return null

    if (renderSelectedIcon) {
      return (
        <span className="tree-select-node-custom-selected-icon">
          {renderSelectedIcon({
            isSelected,
            disabled: !!node.disabled,
            node,
            multiple,
          })}
        </span>
      )
    }

    return <span className="tree-select-node-checkmark">✓</span>
  }

  // 如果提供了自定义渲染函数，使用自定义渲染
  if (renderItem) {
    return (
      <div className="tree-select-node-custom">
        {renderItem({
          node,
          isSelected,
          disabled: !!node.disabled,
          multiple,
          onSelect,
        })}
      </div>
    )
  }

  // 默认渲染
  return (
    <div
      className={clsx('tree-select-node', {
        'tree-select-node-selected': isSelected,
        'tree-select-node-disabled': node.disabled,
        'tree-select-node-multiple': multiple,
      })}
      onClick={(e) => {
        e.stopPropagation() // 阻止事件冒泡
        handleClick()
      }}
    >
      {renderCheckboxElement()}
      <span
        className="tree-select-node-label"
        onClick={(e) => {
          // 确保span的点击也能触发选择
          e.stopPropagation()
          handleClick()
        }}
      >
        {node.label}
      </span>
      {renderSelectedIconElement()}
    </div>
  )
}
