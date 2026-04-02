import { atom } from '@einfach/react'
import type { RowId } from '@grid-table/basic'

export const expandedRowKeysAtom = atom<Set<RowId>>(new Set<RowId>())

export const EXPAND_ROW_PREFIX = '__expand_'

export function getExpandRowId(rowId: RowId): RowId {
  return `${EXPAND_ROW_PREFIX}${rowId}` as RowId
}

export function isExpandRowId(rowId: RowId): boolean {
  return rowId.startsWith(EXPAND_ROW_PREFIX)
}

export function getParentRowId(expandRowId: RowId): RowId {
  return expandRowId.slice(EXPAND_ROW_PREFIX.length) as RowId
}
