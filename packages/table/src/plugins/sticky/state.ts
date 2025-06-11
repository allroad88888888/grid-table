import type { ColumnId, RowId } from '@grid-table/basic'
import { columnIdShowListAtom, rowIdShowListAtom } from '@grid-table/basic'
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

export const stickyLeftOptionAtom = atom<ColumnId[]>([])
export const stickyRightOptionAtom = atom<ColumnId[]>([])
export const stickyTopOptionAtom = atom<ColumnId[]>([])
export const stickyBottomOptionAtom = atom<ColumnId[]>([])

export const stickyLeftAtom = atom((getter) => {
  const showIds = new Set(getter(columnIdShowListAtom))
  return getter(stickyLeftOptionAtom).filter((id) => {
    return showIds.has(id)
  })
})

export const stickyRightAtom = atom((getter) => {
  const showIds = new Set(getter(columnIdShowListAtom))
  return getter(stickyRightOptionAtom).filter((id) => {
    return showIds.has(id)
  })
})
export const stickyTopAtom = atom((getter) => {
  const showIds = new Set(getter(rowIdShowListAtom))
  return getter(stickyTopOptionAtom).filter((id) => {
    return showIds.has(id)
  })
})
export const stickyBottomAtom = atom((getter) => {
  const showIds = new Set(getter(rowIdShowListAtom))
  return getter(stickyBottomOptionAtom).filter((id) => {
    return showIds.has(id)
  })
})

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
