import { atom } from 'einfach-state'
import type { MergeCellIdItem } from './types'

export const headerMergeCellListAtom = atom<MergeCellIdItem[] | undefined>(undefined)
