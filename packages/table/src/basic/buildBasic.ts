import { createStore, atom } from 'einfach-state'
import { createAtomFamilyEntity } from '../utils/createAtomFamily'
import type { BasicStore, ColumnItemState, RowItemState, TableOption } from './type'

export function buildBasic(): BasicStore {
  const store = createStore()

  const { createAtomFamily, clear } = createAtomFamilyEntity()

  const columnListAtom = atom<number[]>([])
  const rowListAtom = atom<number[]>([])

  const getColumnStateAtomByIndex = createAtomFamily<ColumnItemState, number>({
    debuggerKey: 'basic column info',
    defaultValue: {},
  })

  const getRowStateAtomByIndex = createAtomFamily<RowItemState, number>({
    debuggerKey: 'basic row info',
    defaultValue: {},
  })

  const columnSizeMapAtom = atom<Map<number, number>>(new Map())
  const rowSizeMapAtom = atom<Map<number, number>>(new Map())

  const hasInitAtom = atom<boolean>(false)

  const optionsAtom = atom<TableOption>({})

  return {
    store,
    columnListAtom,
    rowListAtom,
    getCellStateAtomByIndex: getColumnStateAtomByIndex,
    getRowStateAtomByIndex,
    columnSizeMapAtom,
    rowSizeMapAtom,
    hasInitAtom,
    optionsAtom,
    clear,
  }
}
