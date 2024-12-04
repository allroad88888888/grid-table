import { atom, useAtomValue, useSetAtom } from 'einfach-state'
import { useStore } from './useStore'
import { useIdByIndex } from './useIdByIndex'
import { useLevel } from './useLevel'
import { useArrowAtom } from './useArrow'
import { viewOptionAtom } from '../views/state'
import { collapseNodeSetAtom } from '../state'
import type { Id } from '../types'

export const onArrowClickAtom = atom(0, (getter, setter, id: Id) => {
  setter(collapseNodeSetAtom, (prev) => {
    if (prev.has(id)) {
      prev.delete(id)
    } else {
      prev.add(id)
    }
    return new Set(prev)
  })
})

export function useItem(index: number) {
  const { store } = useStore()
  const id = useIdByIndex(index)
  const level = useLevel({ id })

  const arrowAtom = useArrowAtom(id)
  const { levelSize, itemTag, Component, itemClassName } = useAtomValue(viewOptionAtom, { store })

  /**
   * 是否有箭头
   */
  const arrow = useAtomValue(arrowAtom, { store })

  const onArrowClick = useSetAtom(onArrowClickAtom, { store })

  const ItemTag = itemTag

  return {
    id,
    ItemTag,
    arrow,
    level,
    levelSize,
    Component,
    itemClassName,
    onArrowClick,
  }
}
