import { useStore, useAtomValue } from '@einfach/react'
import { useCallback } from 'react'
import { stickyLeftAtom, stickyRightAtom } from './state'
import { columnContextMenuPositionAtom } from '../theadContextMenu/state'
import { localeAtom } from '../../state'

export function StickyColumn() {
  const store = useStore()

  // 获取当前右键点击的列
  const position = useAtomValue(columnContextMenuPositionAtom, { store })
  const stickyLeftColumns = useAtomValue(stickyLeftAtom, { store })
  const stickyRightColumns = useAtomValue(stickyRightAtom, { store })
  const locale = useAtomValue(localeAtom, { store })

  if (!position) {
    return null
  }

  const currentColumnId = position.columnId

  // 判断当前列是否已固定
  const isLeftFixed = stickyLeftColumns.includes(currentColumnId)
  const isRightFixed = stickyRightColumns.includes(currentColumnId)

  // 固定到左边
  const onStickyLeftClick = useCallback(() => {
    store.setter(stickyLeftAtom, (prev) => {
      const next = new Set(prev)
      next.add(currentColumnId)
      return Array.from(next)
    })
    // 同时从右边固定中移除
    store.setter(stickyRightAtom, (prev) => {
      const next = new Set(prev)
      next.delete(currentColumnId)
      return Array.from(next)
    })
  }, [currentColumnId, store])

  // 固定到右边
  const onStickyRightClick = useCallback(() => {
    store.setter(stickyRightAtom, (prev) => {
      const next = new Set(prev)
      next.add(currentColumnId)
      return Array.from(next)
    })
    // 同时从左边固定中移除
    store.setter(stickyLeftAtom, (prev) => {
      const next = new Set(prev)
      next.delete(currentColumnId)
      return Array.from(next)
    })
  }, [currentColumnId, store])

  // 取消固定
  const onUnstickClick = useCallback(() => {
    store.setter(stickyLeftAtom, (prev) => {
      const next = new Set(prev)
      next.delete(currentColumnId)
      return Array.from(next)
    })
    store.setter(stickyRightAtom, (prev) => {
      const next = new Set(prev)
      next.delete(currentColumnId)
      return Array.from(next)
    })
  }, [currentColumnId, store])

  return (
    <>
      {!isLeftFixed && !isRightFixed && (
        <>
          <li onClick={onStickyLeftClick} key="sticky-left">
            {locale.stickyLeft}
          </li>
          <li onClick={onStickyRightClick} key="sticky-right">
            {locale.stickyRight}
          </li>
        </>
      )}
      {(isLeftFixed || isRightFixed) && (
        <li onClick={onUnstickClick} key="unstick">
          {locale.unstick}
        </li>
      )}
    </>
  )
}
