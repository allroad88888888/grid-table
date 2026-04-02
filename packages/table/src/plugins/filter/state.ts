import { atom } from '@einfach/react'
import type { ColumnId } from '@grid-table/basic'
import type { FilterState } from './types'

/** 内部过滤状态 */
export const filterStateAtom = atom<FilterState>(new Map())

/** 当前激活的过滤列（用于 UI 展示） */
export const activeFilterColumnAtom = atom<ColumnId | null>(null)
