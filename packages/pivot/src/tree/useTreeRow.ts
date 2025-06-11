import { useEffect } from 'react'
import { useBasic } from '@grid-table/basic'
import { useStore, useSetAtom } from '@einfach/react'
import { collapsedRowNodesAtom, rowTreeInitAtom } from './state'
import type { UseTreeProps } from './type'
import { getRowInfoAtomByRowId } from '@grid-table/view'
import { easyGet } from '@einfach/utils'

export function useTreeRow({ relation, propId }: UseTreeProps = {}) {
  const { rowIdShowListAtom } = useBasic()
  const store = useStore()
  const init = useSetAtom(rowTreeInitAtom)

  useEffect(() => {
    if (!relation) {
      return
    }
    init({ relation })
  }, [init, relation])

  useEffect(() => {
    if (!propId) {
      return
    }
    return store.setter(rowIdShowListAtom, (getter, prev) => {
      const showIds = new Set(getter(collapsedRowNodesAtom))

      const nextIds = prev.filter((id) => {
        const info = getter(getRowInfoAtomByRowId(id))

        const tId = easyGet(info, propId)
        return tId ? showIds.has(tId) : true
      })
      return nextIds
    })
  }, [propId, rowIdShowListAtom, store])
}
