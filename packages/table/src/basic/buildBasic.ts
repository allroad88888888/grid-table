import { createStore, atom } from 'einfach-state'
import { createAtomFamilyEntity } from '../utils/createAtomFamily'
import type { CellState, ColumnItemState, EventsCellSet, RowItemState, TableOption } from './type'
import type { ResizeParam } from '@grid-table/core'
import { incrementAtom } from '../utils/incrementAtom'

export function buildBasic() {
  const store = createStore()

  const { createAtomFamily, clear } = createAtomFamilyEntity()

  const columnIndexListAtom = incrementAtom<number[]>([])
  const rowIndexListAtom = incrementAtom<number[]>([])

  const getColumnStateAtomByIndex = createAtomFamily({
    debuggerKey: 'basic column info',
    createAtom: (key: Number) => {
      const atomEntity = incrementAtom({} as ColumnItemState)
      return atomEntity
    },
  })

  const getRowStateAtomByIndex = createAtomFamily({
    debuggerKey: 'basic row info',
    createAtom: (key: Number) => {
      const atomEntity = incrementAtom({} as RowItemState)
      return atomEntity
    },
  })

  const getCellStateAtomById = createAtomFamily({
    debuggerKey: 'basic cell info',
    createAtom: () => {
      const atomEntity = incrementAtom({} as CellState)
      return atomEntity
    },
  })

  const cellEventsAtom = incrementAtom({} as EventsCellSet)

  const columnSizeListAtom = incrementAtom<number[]>([])
  const rowSizeListAtom = incrementAtom<number[]>([])
  const theadRowSizeListAtom = incrementAtom<number[]>([])

  const hasInitAtom = atom<boolean>(false)

  const optionsAtom = atom<TableOption>({})

  /**
   * 宽高
   */
  const resizeAtom = atom<ResizeParam>({ height: -1, width: -1 })

  return {
    createAtomFamily,
    theadRowSizeListAtom,
    store,
    cellEventsAtom,
    columnIndexListAtom,
    rowIndexListAtom,
    getColumnStateAtomByIndex,
    getRowStateAtomByIndex,
    getCellStateAtomById,
    columnSizeListAtom,
    rowSizeListAtom,
    hasInitAtom,
    optionsAtom,
    resizeAtom,
    clear,
  }
}
