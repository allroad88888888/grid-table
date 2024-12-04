import { useMemo } from 'react'
import { atom, useAtomValue } from 'einfach-state'
import type { Getter } from 'einfach-state'
import type { Id } from '../types'
import { idParentIdMapAtom, parentIdLevelAtom } from '../state'
import { getIdByIndex } from './useIdByIndex'
import { useStore } from './useStore'

export function getLevelById(getter: Getter, id: Id) {
  const idParentIdMap = getter(idParentIdMapAtom)
  const level = getter(parentIdLevelAtom).get(idParentIdMap.get(id)!)
  return level === undefined ? 0 : level + 1
}

export function getLevelByIndex(getter: Getter, index: number) {
  const id = getIdByIndex(getter, index)
  return getLevelById(getter, id)
}

export function useLevel(props: { index: number }): number
export function useLevel(props: { id: Id }): number
export function useLevel({ id, index }: { id?: Id; index?: number }) {
  const levelAtom = useMemo(() => {
    if (id) {
      return atom((getter) => {
        return getLevelById(getter, id)
      })
    }
    return atom((getter) => {
      return getLevelByIndex(getter, index!)
    })
  }, [id, index])

  const { store } = useStore()
  return useAtomValue(levelAtom, { store })
}
