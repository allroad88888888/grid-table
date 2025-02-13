import { atom } from '@einfach/state'
import type { RowId } from '@grid-table/basic'
import { getChildrenNodeList } from './getChildrenNodeList'
import type { UseTreeProps } from './type'
import { ROOT } from './const'

export const rowTreeInitAtom = atom(
  0,
  (getter, setter, { relation }: Pick<UseTreeProps, 'relation'>) => {
    if (relation) {
      const nextRelation = new Map(Object.entries(relation))
      setter(rowRelationAtom, nextRelation)
      const levelMap = new Map<string, number>()

      const queue = [{ node: ROOT, level: 0 }]
      while (queue.length > 0) {
        const { node, level } = queue.shift()!
        levelMap.set(node, level)
        if (nextRelation.has(node)) {
          const nextLevel = level + 1
          queue.push(
            ...nextRelation.get(node)!.map((cNode) => {
              return {
                node: cNode,
                level: nextLevel,
              }
            }),
          )
        }
      }

      setter(rowLevelMapAtom, levelMap)
    }
  },
)

export const rowRelationAtom = atom<Map<RowId, RowId[]>>(new Map())

export const rowLevelMapAtom = atom<Map<RowId, number>>(new Map())

export const collapsedRowRootsAtom = atom<Set<RowId>>(new Set<RowId>())
export const collapsedRowNodesAtom = atom((getter) => {
  const relation = getter(rowRelationAtom)
  const collapsedRowRoots = getter(collapsedRowRootsAtom)
  return getChildrenNodeList(relation, { collapseNodeSet: collapsedRowRoots })
})
