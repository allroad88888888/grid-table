import { useMemo } from 'react'
import { showIdsAtom } from '../state'
import { useStore } from './useStore'
import { useAtomValue, atom } from '@einfach/state'
import type { Getter } from '@einfach/state'

export function getIdByIndex(getter: Getter, index: number) {
  return getter(showIdsAtom)[index]
}

export function useIdByIndex(index: number) {
  const { store } = useStore()

  const idAtom = useMemo(() => {
    return atom((getter) => {
      return getIdByIndex(getter, index)
    })
  }, [index])

  return useAtomValue(idAtom, { store })
}
