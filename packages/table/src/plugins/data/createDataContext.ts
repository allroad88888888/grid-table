import { atom, type Store } from 'einfach-state'
import { createAtomFamilyEntity } from '../../utils/createAtomFamily'
import type { ColumnType } from './type'

export function createDataContent(store: Store) {
  const { createAtomFamily, clear } = createAtomFamilyEntity()

  const getRowInfoByRowId = createAtomFamily<Record<string, any>>({
    debuggerKey: 'getRowInfoByRowId',
  })

  const getCellInfoByCellId = createAtomFamily<string | undefined>({
    debuggerKey: 'getCellInfoByCellId',
  })

  const getColumnOptionAtomByColId = createAtomFamily<ColumnType, number>({
    debuggerKey: 'getColumnOptionAtomByColId',
  })

  const loadingAtom = atom<boolean>(true)

  return {
    getRowInfoByRowId,
    getCellInfoByCellId,
    getColumnOptionAtomByColId,
    loadingAtom,
    clear,
  }
}

export type DataContextType = ReturnType<typeof createDataContent>
