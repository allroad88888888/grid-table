import { atom } from '@einfach/react'
import { Id } from '../types'
import { collapseNodeSetAtom, idParentIdMapAtom } from './state'

export const expandParentNodesAtom = atom(null, (getter, setter, id: Id) => {
  const idParentIdMap = getter(idParentIdMapAtom)
  const parentIds: Id[] = []

  let tempId = id
  while (idParentIdMap[tempId]) {
    parentIds.push(idParentIdMap[tempId])
    tempId = idParentIdMap[tempId]
  }

  setter(collapseNodeSetAtom, (prev) => {
    const newSet = new Set(prev)
    parentIds.forEach((id) => {
      newSet.delete(id)
    })
    return newSet
  })
})
