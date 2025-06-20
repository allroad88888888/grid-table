import { atom, useSetAtom } from '@einfach/react'
import { collapseNodeSetAtom } from '../state'
import { useStore } from './useStore'
import type { Id } from '../types'

export const expandAllAtom = atom(0, (getter, setter) => {
  setter(collapseNodeSetAtom, new Set())
})

export function useExpandAll() {
  const { store } = useStore()
  return useSetAtom(expandAllAtom, { store })
}

/**
 * 展开一个节点
 */
export const setExpandItemAtom = atom(0, (getter, setter, id: Id) => {
  setter(collapseNodeSetAtom, (prev) => {
    const newSet = new Set(prev)
    newSet.delete(id)
    return new Set(prev)
  })
})

/**
 * 收起一个节点
 */
export const setCollapseItemAtom = atom(0, (getter, setter, id: Id) => {
  setter(collapseNodeSetAtom, (prev) => {
    const newSet = new Set(prev)
    newSet.add(id)
    return new Set(prev)
  })
})
