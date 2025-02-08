import { atom, useAtomValue, useSetAtom } from '@einfach/state'
import { useStore } from './useStore'
import { useIdByIndex } from './useIdByIndex'
import { useLevel } from './useLevel'
import { useIsCollapseAtom } from './useIsCollapse'
import { viewOptionAtom } from '../views/state'
import { collapseNodeSetAtom } from '../state'
import type { Id } from '../types'

export const onExpandOrCollapseClickAtom = atom(0, (getter, setter, id: Id) => {
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

  const arrowAtom = useIsCollapseAtom(id)
  const { levelSize, itemTag, ContentComponent, itemClassName } = useAtomValue(viewOptionAtom, {
    store,
  })

  /**
   * 是否收起
   */
  const isCollapse = useAtomValue(arrowAtom, { store })

  const onExpandOrCollapseClick = useSetAtom(onExpandOrCollapseClickAtom, { store })

  const ItemTag = itemTag

  return {
    id,
    ItemTag,
    isCollapse,
    level,
    levelSize,
    ContentComponent,
    itemClassName,
    onExpandOrCollapseClick,
  }
}
