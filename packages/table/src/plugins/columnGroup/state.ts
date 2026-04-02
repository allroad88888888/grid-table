import { atom } from '@einfach/react'

export const collapsedGroupsAtom = atom<Set<string>>(new Set<string>())
