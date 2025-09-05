import type { TreeNode, TreeRelation } from '../types'

/**
 * 将关系数据转换为树节点数组
 * @param relation 树关系数据
 * @param root 根节点键名
 * @returns 转换后的树节点数组
 */
export function convertRelationToNodes(relation: TreeRelation, root?: string): TreeNode[] {
  const rootKey = root || '_ROOT'
  const visited = new Set<string>()

  /**
   * 递归构建节点
   * @param id 节点ID
   * @returns 构建的节点
   */
  const buildNode = (id: string): TreeNode => {
    if (visited.has(id)) {
      return { id, label: id }
    }
    visited.add(id)

    const children = relation[id]?.map((childId) => buildNode(childId)).filter(Boolean) || []

    return {
      id,
      label: id, // 直接使用id作为label，保持简洁
      children: children.length > 0 ? children : undefined,
    }
  }

  const rootChildren = relation[rootKey] || []
  return rootChildren.map((childId) => buildNode(childId))
}

/**
 * 将树节点数组转换为关系数据
 * @param treeNodes 树节点数组
 * @param showRoot 是否显示根节点
 * @param root 根节点键名
 * @returns 转换后的关系数据
 */
export function convertNodesToRelation(
  treeNodes: TreeNode[],
  showRoot: boolean = false,
  root: string = '_ROOT',
): TreeRelation {
  const rel: TreeRelation = {}

  /**
   * 递归遍历节点
   * @param nodes 节点数组
   * @param parentId 父节点ID
   */
  const traverse = (nodes: TreeNode[], parentId?: string) => {
    const currentLevel: string[] = []

    nodes.forEach((node) => {
      currentLevel.push(node.id)
      if (node.children && node.children.length > 0) {
        rel[node.id] = node.children.map((child) => child.id)
        traverse(node.children, node.id)
      }
    })

    if (parentId) {
      rel[parentId] = currentLevel
    } else if (showRoot) {
      rel[root] = currentLevel
    } else {
      // 不显示根节点时，直接使用顶级节点
      rel[root] = currentLevel
    }
  }

  traverse(treeNodes)
  return rel
}
