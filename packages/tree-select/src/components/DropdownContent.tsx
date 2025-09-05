import { type ReactNode } from 'react'
import GridTree from '@grid-tree/core'
import { TreeContent } from './TreeContent'
import type { TreeNode, TreeRelation } from '../types'

/**
 * 下拉内容组件属性
 */
export interface DropdownContentProps {
  /** 树节点数据 */
  treeNodes: TreeNode[]
  /** 树关系数据 */
  treeRelation: TreeRelation
  /** 节点映射表 */
  nodeMap: Map<string, TreeNode>
  /** 当前选中值 */
  selectedValue: string | string[]
  /** 是否多选 */
  multiple: boolean
  /** 下拉框最大高度 */
  dropdownMaxHeight: number
  /** 是否显示根节点 */
  showRoot: boolean
  /** 根节点键名 */
  root: string
  /** 展开层级 */
  expendLevel: number
  /** 层级缩进大小 */
  levelSize: number
  /** 项目高度 */
  itemSize: number
  /** 空数据提示 */
  notFoundContent: ReactNode
  /** 节点选择回调 */
  onNodeSelect: (id: string, node: TreeNode) => void
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
 * 下拉框内容组件
 * 负责渲染树形结构的下拉内容
 */
export function DropdownContent({
  treeNodes,
  treeRelation,
  nodeMap,
  selectedValue,
  multiple,
  dropdownMaxHeight,
  showRoot,
  root,
  expendLevel,
  levelSize,
  itemSize,
  notFoundContent,
  onNodeSelect,
  renderCheckbox,
  renderSelectedIcon,
  renderItem,
}: DropdownContentProps) {
  // 空数据处理
  if (treeNodes.length === 0) {
    return <div className="tree-select-empty">{notFoundContent}</div>
  }

  /**
   * 内容组件包装器
   * 为GridTree提供统一的内容组件接口
   */
  const ContentComponent = ({ id }: { id: string }) => {
    return (
      <TreeContent
        id={id}
        nodeMap={nodeMap}
        selectedValue={selectedValue}
        multiple={multiple}
        onSelect={onNodeSelect}
        renderCheckbox={renderCheckbox}
        renderSelectedIcon={renderSelectedIcon}
        renderItem={renderItem}
      />
    )
  }

  return (
    <GridTree
      relation={treeRelation}
      className="grid-tree-container tree-select-tree"
      itemClassName="grid-tree-item"
      size={itemSize}
      levelSize={levelSize}
      showRoot={showRoot}
      root={root}
      style={{ maxHeight: dropdownMaxHeight }}
      expendLevel={expendLevel}
      ContentComponent={ContentComponent}
    />
  )
}
