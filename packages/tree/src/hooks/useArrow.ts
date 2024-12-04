import { useMemo } from 'react'
import { atom } from 'einfach-state'
import type { Atom, Getter } from 'einfach-state'
import type { Id } from '../types'
import { collapseNodeSetAtom, parentSetIdAtom } from '../state'

export function getArrowById(getter: Getter, id: Id): boolean | undefined {
  const parentSetId = getter(parentSetIdAtom)

  if (!parentSetId.has(id)) {
    return undefined
  }
  return getter(collapseNodeSetAtom).has(id)
}

export function useArrowAtom(id: Id): Atom<boolean | undefined> {
  const arrowAtom = useMemo(() => {
    return atom((getter) => {
      return getArrowById(getter, id)
    })
  }, [id])

  return arrowAtom
}
