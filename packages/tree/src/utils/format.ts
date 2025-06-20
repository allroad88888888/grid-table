import type { Id, Relation } from '../types'

export function format(
  relation: Relation,
  props: {
    root: Id
    showRoot: Boolean
  },
) {
  const { root, showRoot } = props

  // 使用栈实现深度优先遍历
  const stack: { id: Id; level: number }[] = [
    {
      id: root,
      level: showRoot ? 0 : -1,
    },
  ]
  const allIds: Id[] = []
  const idParentIdMap: Record<Id, Id> = {}
  const parentIdLevel: Record<Id, number> = {}

  while (stack.length > 0) {
    const next = stack.pop()!

    allIds.push(next.id)
    const children = relation[next.id]

    if (children && children.length > 0) {
      parentIdLevel[next.id] = next.level
      const nextLevel = next.level + 1
      // 逆序添加到栈中，保证深度优先的正确顺序
      for (let i = children.length - 1; i >= 0; i--) {
        const cId = children[i]
        idParentIdMap[cId] = next.id
        stack.push({
          id: cId,
          level: nextLevel,
        })
      }
    }
  }

  if (!showRoot) {
    allIds.shift()
  }

  return {
    root,
    allIds,
    idParentIdMap,
    parentIdLevel,
  }
}
