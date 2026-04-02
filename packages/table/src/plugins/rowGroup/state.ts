import { atom } from '@einfach/react'

export const expandedGroupKeysAtom = atom<Set<string>>(new Set())
export const GROUP_ROW_PREFIX = '__group_'

export function getGroupRowId(depth: number, groupValue: string): string {
  return `${GROUP_ROW_PREFIX}${depth}_${groupValue}`
}

export function isGroupRowId(rowId: string): boolean {
  return rowId.startsWith(GROUP_ROW_PREFIX)
}
