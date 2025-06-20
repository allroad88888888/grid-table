import { atom } from '@einfach/react'
import { insertNodeInTree } from '../utils/insert'
import type { InsertPosition } from '../utils/insert'
import { batchRemoveNodes } from '../utils/remove'
import { collapseNodeSetAtom, idParentIdMapAtom, relationAtom, rootAtom } from './state'
import type { Id } from '../types'

export const addItemAtom = atom(
  0,
  (
    getter,
    setter,
    {
      id,
      newId,
      position = 'child-first',
    }: {
      id: string
      newId: string
      position?: InsertPosition
    },
  ) => {
    const relation = getter(relationAtom)

    const parentIdMap = getter(idParentIdMapAtom)
    const root = getter(rootAtom)
    const { relation: newRelation } = insertNodeInTree({
      currentId: id,
      newId,
      position,
      relation,
      parentMap: parentIdMap,
      root,
    })
    setter(relationAtom, newRelation)

    setter(collapseNodeSetAtom, (prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  },
)

export const removeItemAtom = atom(0, (getter, setter, id: Id | Id[]) => {
  const relation = getter(relationAtom)
  const parentIdMap = getter(idParentIdMapAtom)
  const root = getter(rootAtom)
  const { relation: newRelation } = batchRemoveNodes({
    nodeIds: Array.isArray(id) ? id : [id],
    relation,
    parentMap: parentIdMap,
    root,
  })
  setter(relationAtom, newRelation)
})
