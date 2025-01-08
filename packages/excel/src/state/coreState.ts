import type { ColumnType } from '@grid-table/view'
import { atom } from 'einfach-state'

export const columnListAtom = atom<ColumnType[]>([])

export const dataListAtom = atom<Object[]>([])
