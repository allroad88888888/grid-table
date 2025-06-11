import type { ColumnId } from '@grid-table/basic'
import { atom } from '@einfach/react'
import { columnContextMenuPositionAtom } from '../theadContextMenu/state'

export const hideColumnsAtom = atom<ColumnId[]>([])

export const hideColumnAtom = atom(0, (getter, setter) => {
  const info = getter(columnContextMenuPositionAtom)
  if (info) {
    setter(hideColumnsAtom, (prev) => {
      return Array.from(new Set([...prev, info.columnId]))
    })
  }
})
