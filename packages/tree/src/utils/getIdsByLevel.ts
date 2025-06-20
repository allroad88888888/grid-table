/**
 * 获取 relation 中从根节点到指定层级的所有父节点 id（只包含有子节点的节点）
 * @param level 目标层级（root 为 0）
 * @param relation 树形关系 Record<string, string[]>
 * @param root 根节点 id
 * @returns 从根节点到指定层级的所有父节点 id 数组
 */
export function getIdsByLevel(
  level: number,
  relation: Record<string, string[]>,
  root: string,
): string[] {
  if (level < 0 || !root || !relation[root]) return []
  const result: string[] = []

  // 预估队列大小，避免频繁扩容
  const estimatedSize = Math.min(Object.keys(relation).length, 100000)
  const queue: Array<{ id: string; lvl: number }> = new Array(estimatedSize)
  queue[0] = { id: root, lvl: 0 }
  let queueStart = 0
  let queueEnd = 1
  const visited = new Set<string>()

  while (queueStart < queueEnd) {
    const { id, lvl } = queue[queueStart++]
    if (visited.has(id)) continue
    visited.add(id)

    const children = relation[id]
    // 只收集有子节点的节点，且在目标层级内
    if (children && children.length > 0 && lvl <= level) {
      result.push(id)
    }

    if (lvl >= level) continue

    if (children && children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (!visited.has(child)) {
          // 动态扩容
          if (queueEnd >= queue.length) {
            queue.length = queue.length * 2
          }
          queue[queueEnd++] = { id: child, lvl: lvl + 1 }
        }
      }
    }
  }

  return result
}
