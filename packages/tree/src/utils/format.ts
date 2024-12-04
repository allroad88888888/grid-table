import type { DataTodoProps, Id, Relation } from '../types'

export function format(relation: Relation, props: Required<DataTodoProps>) {
  const { root, expendLevel, minLengthExpandAll, showRoot } = props

  const stack: { id: Id; level: number }[] = [
    {
      id: root,
      level: showRoot ? 0 : -1,
    },
  ]
  const allIds: Id[] = []
  const idParentIdMap = new Map<Id, Id>()
  const parentIdLevel = new Map<Id, number>()

  while (stack.length > 0) {
    const next = stack.shift()!

    allIds.push(next.id)
    const children = relation[next.id] || []

    if (children.length > 0) {
      parentIdLevel.set(next.id, next.level)
      stack.unshift(
        ...children.map((cId) => {
          idParentIdMap.set(cId, next.id)
          return {
            id: cId,
            level: next.level + 1,
          }
        }),
      )
    }
  }

  if (!showRoot) {
    allIds.shift()
  }

  // 默认展开几个层级 处理
  const collapseNodeList = new Set<Id>()
  parentIdLevel.forEach((level, tId) => {
    if (level > expendLevel) {
      collapseNodeList.add(tId)
    }
  })

  // 整棵树少于多少个，就全部展开 .这个优先级大于expendLevel
  if (allIds.length < minLengthExpandAll) {
    collapseNodeList.clear()
  }

  return {
    root,
    allIds,
    idParentIdMap,
    parentIdLevel,
  }
}

// function format(relation: Record<string, string[]>) {
//   const allIds = []

//   function it(children: string[]) {
//     children.forEach((cId) => {
//       allIds.push(cId)
//       it(relation[cId] || [])
//     })
//   }
//   it(relation[ROOT])
// }

// function formatXX(relation: Record<string, string[]>, disabledIds: Set<string>) {
//   const newRelation: Record<string, string[]> = {}
//   function it(children: string[]) {
//     let disabled = true
//     children.forEach((cId) => {
//       if (it(relation[cId] || []) === false || !disabledIds.has(cId)) {
//         disabled = false
//         if (!(cId in newRelation)) {
//           newRelation[cId] = []
//         }
//         newRelation[cId].push(cId)
//       }
//     })

//     return disabled
//   }
//   it(relation[ROOT])
// }
