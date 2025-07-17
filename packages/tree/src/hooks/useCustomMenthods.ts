import { ForwardedRef, useImperativeHandle } from 'react'
import { GridTreeRef, Id } from '../types'
import { VGridListRef } from '@grid-table/core'
import { atom, useSetAtom } from '@einfach/react'
import { expandParentNodesAtom } from '../state/others'
import { showIdsAtom } from '../state'
import { useStore } from './useStore'

const getIndexByIdAtom = atom(null, (getter, setter, id: Id) => {
  setter(expandParentNodesAtom, id)
  const showIds = getter(showIdsAtom)
  const index = showIds.findIndex((showId) => showId === id)
  return index
})

export function useCustomMenthods(
  ref: ForwardedRef<GridTreeRef>,
  listRef: React.RefObject<VGridListRef>,
) {
  const { store } = useStore()
  const getIndexById = useSetAtom(getIndexByIdAtom, { store })
  useImperativeHandle(ref, () => {
    return {
      scrollTo: (id: Id, options = {}) => {
        const index = getIndexById(id)
        setTimeout(() => {
          listRef.current?.scrollTo(index, options)
        })
      },
      scroll: (left, top, options) => {
        listRef.current?.scroll(left, top, options)
      },
    }
  })
}
