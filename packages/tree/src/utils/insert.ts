import { ROOT } from './const'

/**
 * 插入位置类型
 */
export type InsertPosition = 'before' | 'after' | 'child-first' | 'child-last'

/**
 * 插入节点的参数
 */
export interface InsertNodeParams {
  /** 当前参考节点ID */
  currentId: string
  /** 要插入的新节点ID */
  newId: string
  /** 插入位置 */
  position: InsertPosition
  /** 父子关系映射 Record<parentId, childId[]> */
  relation: Record<string, string[]>
  /** 子父关系映射 Record<childId, parentId> */
  parentMap: Record<string, string>
  /** 根节点标识，默认为 ROOT */
  root?: string
}

/**
 * 在树形结构中插入新节点
 * @param params - 插入节点的参数对象
 * @returns 更新后的relation和parentMap
 */
export function insertNodeInTree(params: InsertNodeParams): {
  relation: Record<string, string[]>
  parentMap: Record<string, string>
} {
  const { currentId, newId, position, relation, parentMap, root = ROOT } = params

  // 创建副本以避免直接修改原对象
  const newRelation = { ...relation }
  const newParentMap = { ...parentMap }

  // 处理同级插入（before/after）
  if (position === 'before' || position === 'after') {
    const parentId = parentMap[currentId]

    if (parentId !== undefined) {
      // 当前节点有父节点
      const siblings = newRelation[parentId] || []
      const currentIndex = siblings.indexOf(currentId)

      if (currentIndex !== -1) {
        const insertIndex = position === 'before' ? currentIndex : currentIndex + 1
        newRelation[parentId] = [
          ...siblings.slice(0, insertIndex),
          newId,
          ...siblings.slice(insertIndex),
        ]
        newParentMap[newId] = parentId
      }
    } else if (currentId === root) {
      // 当前节点是根节点，无法在同级插入
      throw new Error(`无法在根节点 ${currentId} 的同级插入新节点，因为没有父节点`)
    } else {
      // 如果是顶级节点（父节点是 root）
      const rootChildren = newRelation[root] || []
      const currentIndex = rootChildren.indexOf(currentId)

      if (currentIndex !== -1) {
        const insertIndex = position === 'before' ? currentIndex : currentIndex + 1
        newRelation[root] = [
          ...rootChildren.slice(0, insertIndex),
          newId,
          ...rootChildren.slice(insertIndex),
        ]
        // 顶级节点不需要在 parentMap 中记录
      }
    }
  }

  // 处理子级插入（child-first/child-last）
  else if (position === 'child-first' || position === 'child-last') {
    const children = newRelation[currentId] || []

    if (position === 'child-first') {
      newRelation[currentId] = Array.from(new Set([newId, ...children]))
    } else {
      newRelation[currentId] = Array.from(new Set([...children, newId]))
    }

    // 只有当父节点不是 root 时才记录在 parentMap 中
    if (currentId !== root) {
      newParentMap[newId] = currentId
    }
  }

  return {
    relation: newRelation,
    parentMap: newParentMap,
  }
}

/**
 * 批量插入参数
 */
export interface BatchInsertParams {
  /** 插入操作数组 */
  insertions: Array<{
    currentId: string
    newId: string
    position: InsertPosition
  }>
  /** 父子关系映射 */
  relation: Record<string, string[]>
  /** 子父关系映射 */
  parentMap: Record<string, string>
  /** 根节点标识，默认为 ROOT */
  root?: string
}

/**
 * 批量插入多个节点
 * @param params - 批量插入的参数对象
 * @returns 更新后的relation和parentMap
 */
export function batchInsertNodes(params: BatchInsertParams): {
  relation: Record<string, string[]>
  parentMap: Record<string, string>
} {
  const { insertions, relation, parentMap, root = ROOT } = params

  let currentRelation = relation
  let currentParentMap = parentMap

  for (const insertion of insertions) {
    const result = insertNodeInTree({
      currentId: insertion.currentId,
      newId: insertion.newId,
      position: insertion.position,
      relation: currentRelation,
      parentMap: currentParentMap,
      root,
    })
    currentRelation = result.relation
    currentParentMap = result.parentMap
  }

  return {
    relation: currentRelation,
    parentMap: currentParentMap,
  }
}
