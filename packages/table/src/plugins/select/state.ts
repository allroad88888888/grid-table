import { atom } from '@einfach/react'

import type { RowId } from '@grid-table/basic'

export const nodeSelectionSetAtom = atom<
  Set<RowId>,
  [Set<RowId> | ((prev: Set<RowId>) => Set<RowId>)],
  void
>(new Set<RowId>(), (getter, setter, props: Set<RowId> | ((prev: Set<RowId>) => Set<RowId>)) => {
  let next: Set<RowId>
  if (typeof props === 'function') {
    next = props(getter(nodeSelectionSetAtom))
  } else {
    next = props
  }
  const disabledSet = getter(nodeSelectionDisabledSetAtom)
  next = new Set([...next].filter((tId) => !disabledSet.has(tId)))
  setter(nodeSelectionSetAtom, next)
  return next
})

export const nodeSelectionDisabledSetAtom = atom<Set<RowId>>(new Set<RowId>())
