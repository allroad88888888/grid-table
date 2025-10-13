import type { ColumnId, RowId } from '@grid-table/basic'
import { atom } from '@einfach/react'
import type { AtomEntity } from '@einfach/react'
import type { PositionType, StickyType } from './type'

export const stickyOptions = atom<{
  leftIds?: ColumnId[]
  rightIds?: ColumnId[]
  topIds?: ColumnId[]
  bottomIds?: ColumnId[]
  columnFixed?: boolean
  rowFixed?: boolean
}>({})

export const stickyLeftAtom = atom<ColumnId[]>([])
export const stickyRightAtom = atom<ColumnId[]>([])
export const stickyTopAtom = atom<ColumnId[]>([])
export const stickyBottomAtom = atom<ColumnId[]>([])

export const StickyConfig: Record<
  StickyType,
  {
    position: PositionType
    atomEntity: AtomEntity<RowId[]>
  }
> = {
  rowTop: {
    position: 'top',
    atomEntity: stickyTopAtom,
  },
  rowBottom: {
    position: 'bottom',
    atomEntity: stickyBottomAtom,
  },
  columnTop: {
    position: 'left',
    atomEntity: stickyLeftAtom,
  },
  columnBottom: {
    position: 'right',
    atomEntity: stickyRightAtom,
  },
}
