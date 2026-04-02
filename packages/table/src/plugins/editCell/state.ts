import { atom } from '@einfach/react'
import type { PositionId, RowId, ColumnId } from '@grid-table/basic'

export const editingCellAtom = atom<PositionId | null>(null)
export const editingValueAtom = atom<unknown>(undefined)
export const editingErrorAtom = atom<string | undefined>(undefined)
export const editingRowAtom = atom<RowId | null>(null)
export const editingRowDataAtom = atom<Map<ColumnId, unknown>>(new Map())
