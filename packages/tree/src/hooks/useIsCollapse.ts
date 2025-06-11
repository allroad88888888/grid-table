import { useMemo } from 'react'
import { atom } from '@einfach/react'
import type { Atom, Getter } from '@einfach/react'
import type { Id } from '../types'
import { collapseNodeSetAtom, parentSetIdAtom } from '../state'

export function getIdCollapseById(getter: Getter, id: Id): boolean | undefined {
  const parentSetId = getter(parentSetIdAtom)

  if (!parentSetId.has(id)) {
    return undefined
  }
  return getter(collapseNodeSetAtom).has(id)
}

export function useIsCollapseAtom(id: Id): Atom<boolean | undefined> {
  const arrowAtom = useMemo(() => {
    return atom((getter) => {
      return getIdCollapseById(getter, id)
    })
  }, [id])

  return arrowAtom
}
