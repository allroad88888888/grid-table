import { useMemo } from 'react'
import type { Id } from '../types'

export function useStayIndexList(showIds: Id[], stayIds?: Id[]) {
  const stayIndexList = useMemo(() => {
    if (!stayIds || stayIds.length === 0) {
      return [] as number[]
    }
    const setStayId = new Set(stayIds)
    const res: number[] = []
    showIds.forEach((id, index) => {
      if (setStayId.has(id)) {
        res.push(index)
      }
    })
    return res
  }, [stayIds, showIds])

  return stayIndexList
}
