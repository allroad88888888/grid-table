/**
 * 获取 relation 中所有唯一 id 的数量
 * @param relation 树形关系 Record<string, string[]>
 * @returns 唯一 id 的数量
 */
export function countRelationIds(relation: Record<string, string[]>): number {
  const idSet = new Set<string>()
  for (const [id, children] of Object.entries(relation)) {
    idSet.add(id)
    for (const child of children) {
      idSet.add(child)
    }
  }
  return idSet.size
}
