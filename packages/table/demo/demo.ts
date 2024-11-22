import { ROOT } from './const'

type TilingId = string
type RelationType = Record<string, TilingId[]>

export function cleanRelation(relation: RelationType, disableIds: Set<TilingId>): RelationType {
  const newRelation: RelationType = {}
  const parentMap: Map<TilingId, TilingId[]> = new Map() // 存储每个节点的父节点列表

  // 构建父节点的引用表
  for (const [parent, children] of Object.entries(relation)) {
    for (const child of children) {
      if (!parentMap.has(child)) parentMap.set(child, [])
      parentMap.get(child)!.push(parent)
    }
  }

  return newRelation
}
