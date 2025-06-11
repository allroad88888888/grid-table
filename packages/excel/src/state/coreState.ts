import type { ColumnType } from '@grid-table/view'
import { atom } from '@einfach/react'

export const columnListAtom = atom<ColumnType[]>([])

export const dataListAtom = atom<Object[]>([])
