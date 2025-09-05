import { useState, useCallback, useMemo } from 'react'
import type { TreeNode, SelectValue, UseSelectionReturn } from '../types'

interface UseSelectionOptions {
  value?: SelectValue
  defaultValue?: SelectValue
  multiple?: boolean
  onChange?: (value: SelectValue, node?: TreeNode | TreeNode[]) => void
}

export function useSelection(
  treeNodes: TreeNode[],
  options: UseSelectionOptions = {},
): UseSelectionReturn {
  const { value, defaultValue, multiple = false, onChange } = options

  // 内部状态
  const [internalValue, setInternalValue] = useState<SelectValue>(
    defaultValue || (multiple ? [] : ''),
  )

  // 当前选中值
  const selectedValue = value !== undefined ? value : internalValue

  // 构建节点映射表
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

  // 获取选中的节点
  const selectedNodes = useMemo(() => {
    if (multiple && Array.isArray(selectedValue)) {
      return selectedValue.map((id) => nodeMap.get(id)).filter(Boolean) as TreeNode[]
    } else if (!multiple && typeof selectedValue === 'string') {
      const node = nodeMap.get(selectedValue)
      return node ? [node] : []
    }
    return []
  }, [selectedValue, nodeMap, multiple])

  // 处理选择
  const handleSelect = useCallback(
    (nodeId: string, node: TreeNode) => {
      if (node.disabled) {
        return
      }

      let newValue: SelectValue
      let newNodes: TreeNode | TreeNode[]

      if (multiple) {
        const currentArray = Array.isArray(selectedValue) ? selectedValue : []
        const index = currentArray.indexOf(nodeId)

        if (index > -1) {
          // 取消选择
          newValue = currentArray.filter((id) => id !== nodeId)
          newNodes = selectedNodes.filter((n) => n.id !== nodeId)
        } else {
          // 添加选择
          newValue = [...currentArray, nodeId]
          newNodes = [...selectedNodes, node]
        }
      } else {
        // 单选模式
        newValue = nodeId
        newNodes = node
      }

      // 更新内部状态
      if (value === undefined) {
        setInternalValue(newValue)
      }

      // 触发回调
      onChange?.(newValue, newNodes)
    },
    [selectedValue, selectedNodes, multiple, value, onChange],
  )

  // 处理清空
  const handleClear = useCallback(() => {
    const newValue = multiple ? [] : ''
    const newNodes = multiple ? [] : undefined

    if (value === undefined) {
      setInternalValue(newValue)
    }

    onChange?.(newValue, newNodes)
  }, [multiple, value, onChange])

  // 获取显示标签
  const getDisplayLabel = useCallback(() => {
    if (multiple && Array.isArray(selectedValue)) {
      return selectedNodes.map((node) => node.label).join(', ')
    } else if (!multiple && typeof selectedValue === 'string' && selectedValue) {
      const node = nodeMap.get(selectedValue)
      return node ? node.label : selectedValue
    }
    return ''
  }, [selectedValue, selectedNodes, multiple, nodeMap])

  return {
    selectedValue,
    selectedNodes,
    handleSelect,
    handleClear,
    getDisplayLabel,
  }
}
