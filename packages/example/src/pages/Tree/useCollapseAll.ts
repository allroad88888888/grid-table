import { collapseNodeSetAtom, parentSetIdAtom, useStore } from '@grid-tree/core/src'
import { atom, useSetAtom } from '@einfach/state'

export const collapseAllAtom = atom(0, (getter, setter) => {
  const parentSetId = getter(parentSetIdAtom)
  const res = new Set(parentSetId)
  res.delete('ROOT')
  setter(collapseNodeSetAtom, res)
})

export function useCollapseAll() {
  const { store } = useStore()
  return useSetAtom(collapseAllAtom, { store })
}
