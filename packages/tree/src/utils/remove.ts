import { ROOT } from './const'

/**
 * 删除节点的参数
 */
export interface RemoveNodeParams {
  /** 要删除的节点ID */
  nodeId: string
  /** 父子关系映射 Record<parentId, childId[]> */
  relation: Record<string, string[]>
  /** 子父关系映射 Record<childId, parentId> */
  parentMap: Record<string, string>
  /** 根节点标识，默认为 ROOT */
  root?: string
  /** 是否级联删除子节点，默认为true */
  cascade?: boolean
}

/**
 * 从树形结构中删除节点
 * @param params - 删除节点的参数对象
 * @returns 更新后的relation和parentMap
 */
export function removeNodeFromTree(params: RemoveNodeParams): {
  relation: Record<string, string[]>
  parentMap: Record<string, string>
} {
  const { nodeId, relation, parentMap, root = ROOT, cascade = true } = params

  // 创建副本以避免直接修改原对象
  const newRelation = { ...relation }
  const newParentMap = { ...parentMap }

  // 获取节点的子节点和父节点
  const children = newRelation[nodeId] || []
  const parentId = newParentMap[nodeId] || (newRelation[root]?.includes(nodeId) ? root : undefined)

  // 如果找不到节点，直接返回原始数据
  if (!parentId && !newRelation[nodeId]) {
    return { relation: newRelation, parentMap: newParentMap }
  }

  // 级联删除：删除当前节点及其所有子孙节点
  if (cascade) {
    // 获取所有子孙节点ID
    const getAllDescendants = (id: string): string[] => {
      const result: string[] = []
      const childIds = newRelation[id] || []

      for (const childId of childIds) {
        result.push(childId)
        result.push(...getAllDescendants(childId))
      }

      return result
    }

    const nodesToDelete = [nodeId, ...getAllDescendants(nodeId)]

    // 删除所有关联节点
    for (const id of nodesToDelete) {
      delete newRelation[id]
      delete newParentMap[id]
    }

    // 从父节点的子节点列表中移除当前节点
    if (parentId) {
      newRelation[parentId] = (newRelation[parentId] || []).filter((id) => id !== nodeId)
    }
  }
  // 非级联删除：删除当前节点，将子节点提升到父节点
  else {
    // 从父节点的子节点列表中移除当前节点，并在相同位置添加子节点
    if (parentId) {
      const parentChildren = [...(newRelation[parentId] || [])]
      const nodeIndex = parentChildren.indexOf(nodeId)

      if (nodeIndex !== -1) {
        // 替换当前节点为其子节点
        parentChildren.splice(nodeIndex, 1, ...children)
      } else {
        // 如果找不到索引（理论上不应该发生），直接添加到末尾
        parentChildren.push(...children)
      }

      newRelation[parentId] = parentChildren

      // 更新子节点的父节点引用
      for (const childId of children) {
        newParentMap[childId] = parentId
      }
    }

    // 删除当前节点
    delete newRelation[nodeId]
    delete newParentMap[nodeId]
  }

  return { relation: newRelation, parentMap: newParentMap }
}

/**
 * 批量删除节点的参数
 */
export interface BatchRemoveParams {
  /** 要删除的节点ID数组 */
  nodeIds: string[]
  /** 父子关系映射 */
  relation: Record<string, string[]>
  /** 子父关系映射 */
  parentMap: Record<string, string>
  /** 根节点标识，默认为 ROOT */
  root?: string
  /** 是否级联删除子节点，默认为true */
  cascade?: boolean
}

/**
 * 批量删除多个节点
 * @param params - 批量删除的参数对象
 * @returns 更新后的relation和parentMap
 */
export function batchRemoveNodes(params: BatchRemoveParams): {
  relation: Record<string, string[]>
  parentMap: Record<string, string>
} {
  const { nodeIds, relation, parentMap, root = ROOT, cascade = true } = params

  let currentRelation = { ...relation }
  let currentParentMap = { ...parentMap }

  for (const nodeId of nodeIds) {
    const result = removeNodeFromTree({
      nodeId,
      relation: currentRelation,
      parentMap: currentParentMap,
      root,
      cascade,
    })
    currentRelation = result.relation
    currentParentMap = result.parentMap
  }

  return {
    relation: currentRelation,
    parentMap: currentParentMap,
  }
}
