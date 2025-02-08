import type { Store } from '@einfach/state'
import { createStore, atom, incrementAtom } from '@einfach/state'
import { createAtomFamilyEntity } from '../utils/createAtomFamily'
import type {
  CellId,
  CellState,
  ColumnId,
  ColumnItemState,
  EventsCellSet,
  RowId,
  RowItemState,
} from './type'
import type { ResizeParam } from '@grid-table/core'

export function createCore(store: Store = createStore()) {
  const { createAtomFamily, clear } = createAtomFamilyEntity()

  /**
   * 列 id list
   */
  const columnIndexListAtom = atom<ColumnId[]>([])
  /**
   * 行 id list
   */
  const rowIndexListAtom = atom<RowId[]>([])

  const columnSizeMapAtom = atom(new Map<ColumnId, number>())
  const rowSizeMapAtom = atom(new Map<RowId, number>())

  /**
   * 展示列 id list
   */
  const columnIdShowListAtom = incrementAtom((_getter) => {
    return _getter(columnIndexListAtom)
  })

  /**
   * 展示行 id list
   */
  const rowIdShowListAtom = incrementAtom((_getter) => {
    return _getter(rowIndexListAtom)
  })

  /**
   * 根据列id 获取 状态
   */
  const getColumnStateAtomById = createAtomFamily({
    debuggerKey: 'basic column info',
    createAtom: (key: ColumnId) => {
      const atomEntity = incrementAtom({} as ColumnItemState)
      return atomEntity
    },
  })

  /**
   * 根据行id 获取 状态
   */
  const getRowStateAtomById = createAtomFamily({
    debuggerKey: 'basic row info',
    createAtom: (key: RowId) => {
      const atomEntity = incrementAtom({} as RowItemState)
      return atomEntity
    },
  })

  /**
   * 根据表格id 获取状态
   */
  const getCellStateAtomById = createAtomFamily({
    debuggerKey: 'basic cell info',
    createAtom: (key: CellId) => {
      const atomEntity = incrementAtom({} as CellState)
      return atomEntity
    },
  })

  /**
   * cellEvent
   */
  const cellEventsAtom = incrementAtom({} as EventsCellSet)

  /**
   * 宽高
   */
  const resizeAtom = atom<ResizeParam>({ height: -1, width: -1 })

  return {
    createAtomFamily,
    store,
    cellEventsAtom,
    columnIndexListAtom,
    rowIndexListAtom,
    getColumnStateAtomById,
    getRowStateAtomById,
    getCellStateAtomById,
    resizeAtom,
    clear,
    columnIdShowListAtom,
    rowIdShowListAtom,
    columnSizeMapAtom,
    rowSizeMapAtom,
  }
}

export type Core = ReturnType<typeof createCore>
