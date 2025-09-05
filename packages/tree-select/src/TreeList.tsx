import { useMemo, useCallback } from 'react'
import clsx from 'clsx'
import { DropdownContent } from './components/DropdownContent'
import { convertRelationToNodes, convertNodesToRelation } from './utils'
import { useSelection } from './hooks/useSelection'
import type { TreeNode, TreeRelation, SelectValue } from './types'
import type { ReactNode, CSSProperties } from 'react'
import './TreeSelect.css'

/**
 * TreeList 组件属性
 */
export interface TreeListProps {
  // 数据源
  /** 树形数据（TreeNode[]格式） */
  data?: TreeNode[]
  /** 关系数据（TreeRelation格式） */
  relation?: TreeRelation
  /** 当前选中值 */
  value?: SelectValue
  /** 默认选中值 */
  defaultValue?: SelectValue
  /** 选择变化回调 */
  onChange?: (value: SelectValue, node?: TreeNode | TreeNode[]) => void

  // 选择模式
  /** 是否多选 */
  multiple?: boolean

  // 外观样式
  className?: string
  style?: CSSProperties
  /** 最大高度 */
  maxHeight?: number

  // 树形配置（继承自GridTree）
  showRoot?: boolean
  root?: string
  expendLevel?: number
  levelSize?: number
  itemSize?: number

  // 空数据提示
  notFoundContent?: ReactNode

  // 自定义渲染
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
 * TreeList 组件
 * 独立的树形列表组件，支持选择功能
 * 基于 DropdownContent 构建，但不包含下拉选择器
 */
export function TreeList(props: TreeListProps) {
  const {
    data,
    relation,
    value,
    defaultValue,
    onChange,
    multiple = false,
    className,
    style,
    maxHeight = 300,
    showRoot = false,
    root = '_ROOT',
    expendLevel = 2,
    levelSize = 20,
    itemSize = 32,
    notFoundContent = '暂无数据',
    renderCheckbox,
    renderSelectedIcon,
    renderItem,
  } = props

  // 准备树形数据
  const treeNodes = useMemo(() => {
    if (data) {
      return data
    } else if (relation) {
      return convertRelationToNodes(relation, root)
    }
    return []
  }, [data, relation, root])

  // 构建节点映射
  const nodeMap = useMemo(() => {
    const map = new Map<string, TreeNode>()

    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        map.set(node.id, node)
        if (node.children) {
          traverse(node.children)
        }
      })
    }

    traverse(treeNodes)
    return map
  }, [treeNodes])

  // 转换为relation格式供GridTree使用
  const treeRelation = useMemo(() => {
    return convertNodesToRelation(treeNodes, showRoot, root)
  }, [treeNodes, showRoot, root])

  // 选择状态管理
  const { selectedValue, handleSelect } = useSelection(treeNodes, {
    value,
    defaultValue,
    multiple,
    onChange,
  })

  // 处理节点选择
  const handleNodeSelect = useCallback(
    (id: string, node: TreeNode) => {
      console.log('TreeList handleNodeSelect called:', { id, node, multiple })
      handleSelect(id, node)
    },
    [handleSelect, multiple],
  )

  return (
    <div className={clsx('tree-list', className)} style={style}>
      <DropdownContent
        treeNodes={treeNodes}
        treeRelation={treeRelation}
        nodeMap={nodeMap}
        selectedValue={selectedValue}
        multiple={multiple}
        dropdownMaxHeight={maxHeight}
        showRoot={showRoot}
        root={root}
        expendLevel={expendLevel}
        levelSize={levelSize}
        itemSize={itemSize}
        notFoundContent={notFoundContent}
        onNodeSelect={handleNodeSelect}
        renderCheckbox={renderCheckbox}
        renderSelectedIcon={renderSelectedIcon}
        renderItem={renderItem}
      />
    </div>
  )
}
