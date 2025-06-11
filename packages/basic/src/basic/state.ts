import type { AtomState } from '@einfach/react'
import { atom, incrementAtom } from '@einfach/react'
import type { ResizeParam } from '@grid-table/core'
import type {
  CellId,
  CellState,
  ColumnId,
  ColumnItemState,
  EventsCellSet,
  RowId,
  RowItemState,
} from './type'

import { createAtomFamilyEntity } from '../utils'

/**
 * 列 id list
 */
export const columnIndexListAtom = atom<ColumnId[]>([])
/**
 * 行 id list
 */
export const rowIndexListAtom = atom<RowId[]>([])
/**
 * 头部列 d list
 */
export const headerRowIndexListAtom = atom<RowId[]>(['0'])

export const columnSizeMapAtom = atom(new Map<ColumnId, number>())

/**
 * 固定行
 */
export const rowSizeMapAtom = atom(new Map<RowId, number>())

/**
 *  合并行 合并列
 */
export const headerRowSizeMaAtom = atom(new Map<RowId, number>())

/**
 * cellEvent
 */
export const cellEventsAtom = incrementAtom({} as EventsCellSet)

/**
 * header cellEvent
 */
export const theadCellEventsAtom = incrementAtom({} as EventsCellSet)

/**
 * 宽高
 */
export const resizeAtom = atom<ResizeParam>({ height: -1, width: -1 })

/**
 * 展示列 id list
 */
export const columnIdShowListAtom = incrementAtom((_getter) => {
  return _getter(columnIndexListAtom)
})

/**
 * 展示行 id list
 */
export const rowIdShowListAtom = incrementAtom((_getter) => {
  return _getter(rowIndexListAtom)
})

export const basicAtom = atom(() => {
  const { createAtomFamily, clear } = createAtomFamilyEntity()

  /**
   * 根据列id 获取 状态
   */
  const getColumnStateAtomById = createAtomFamily({
    debuggerKey: 'basic column info',
    createAtom: (key: ColumnId) => {
      const atomEntity = incrementAtom<ColumnItemState>({
        style: {},
        className: new Set(),
      })
      return atomEntity
    },
  })

  /**
   * 根据行id 获取 状态
   */
  const getRowStateAtomById = createAtomFamily({
    debuggerKey: 'basic row info',
    createAtom: (key: RowId) => {
      const atomEntity = incrementAtom<RowItemState>({
        style: {},
        className: new Set(),
      })
      return atomEntity
    },
  })

  /**
   * 根据表格id 获取状态
   */
  const getCellStateAtomById = createAtomFamily({
    debuggerKey: 'basic cell info',
    createAtom: (key: CellId) => {
      const atomEntity = incrementAtom<CellState>({
        style: {},
        className: new Set(),
      })
      return atomEntity
    },
  })

  /**
   * 表头格子的状态
   */
  const getHeaderCellStateAtomById = createAtomFamily({
    debuggerKey: 'header cell state',
    createAtom: (key: CellId) => {
      const atomEntity = incrementAtom<CellState>({
        style: {},
        className: new Set(),
      })
      return atomEntity
    },
  })

  return {
    createAtomFamily,
    cellEventsAtom,
    columnIndexListAtom,
    rowIndexListAtom,
    getColumnStateAtomById,
    getRowStateAtomById,
    getHeaderCellStateAtomById,
    getCellStateAtomById,
    headerRowIndexListAtom,
    resizeAtom,
    clear,
    columnIdShowListAtom,
    rowIdShowListAtom,
    columnSizeMapAtom,
    rowSizeMapAtom,
    headerRowSizeMaAtom,
    theadCellEventsAtom,
  }
})

export type Core = AtomState<typeof basicAtom>
