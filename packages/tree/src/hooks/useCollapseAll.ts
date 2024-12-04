import { atom, useSetAtom } from 'einfach-state'
import { collapseNodeSetAtom, parentSetIdAtom } from '../state'
import { useStore } from './useStore'

export const collapseAllAtom = atom(0, (getter, setter) => {
  const parentSetId = getter(parentSetIdAtom)
  setter(collapseNodeSetAtom, new Set(parentSetId))
})

export function useCollapseAll() {
  const { store } = useStore()
  return useSetAtom(collapseAllAtom, { store })
}
