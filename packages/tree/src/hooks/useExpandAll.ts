import { atom, useSetAtom } from '@einfach/state'
import { collapseNodeSetAtom } from '../state'
import { useStore } from './useStore'

export const expandAllAtom = atom(0, (getter, setter) => {
  setter(collapseNodeSetAtom, new Set())
})

export function useExpandAll() {
  const { store } = useStore()
  return useSetAtom(expandAllAtom, { store })
}
