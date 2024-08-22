import { createStore, atom } from 'einfach-state'
import { createAtomFamilyEntity } from '../utils/createAtomFamily'
import type { CellState, ColumnItemState, EventsCellSet, RowItemState, TableOption } from './type'
import type { ResizeParam } from '@grid-table/core'
import { incrementAtom } from '../utils/incrementAtom'

export function buildBasic() {
  const store = createStore()

  const { createAtomFamily, clear } = createAtomFamilyEntity()

  const columnListAtom = incrementAtom<number[]>([])
  const rowListAtom = incrementAtom<number[]>([])

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

  const columnSizeMapAtom = incrementAtom<Map<number, number>>(new Map())
  const rowSizeMapAtom = incrementAtom<Map<number, number>>(new Map())

  const hasInitAtom = atom<boolean>(false)

  const optionsAtom = atom<TableOption>({})

  /**
   * 宽高
   */
  const resizeAtom = atom<ResizeParam>({ height: -1, width: -1 })

  return {
    store,
    cellEventsAtom,
    columnListAtom,
    rowListAtom,
    getColumnStateAtomByIndex,
    getRowStateAtomByIndex,
    getCellStateAtomById,
    columnSizeMapAtom,
    rowSizeMapAtom,
    hasInitAtom,
    optionsAtom,
    resizeAtom,
    clear,
  }
}
