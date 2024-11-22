import type { ColumnType } from './types'
import { atom, incrementAtom } from 'einfach-state'
import { createAtomFamilyEntity, type ColumnId, type RowId } from '@grid-table/basic'
import { nodeLevelAtom, parentNodeSetAtom, relationAtom, rootAtom } from './tree/stateTree'
import { loadingAtom } from './state'

export const dataFamilyAtom = atom(() => {
  const { createAtomFamily, clear } = createAtomFamilyEntity()

  const getColumnOptionAtomByColumnId = createAtomFamily({
    debuggerKey: 'ColumnOption-Atom-By-ColumnId',
    createAtom(key: ColumnId, initState?: ColumnType) {
      return incrementAtom(initState!)
    },
  })

  const getRowInfoAtomByRowId = createAtomFamily<Record<string, any> | null, RowId>({
    debuggerKey: 'RowInfo-Atom-By-RowId',
  })

  const getHeaderRowInfoAtomByRowId = createAtomFamily<Record<string, any> | null, RowId>({
    debuggerKey: 'Header-RowInfo-Atom-By-RowId',
  })

  return {
    getRowInfoAtomByRowId,
    getColumnOptionAtomByColumnId,
    getHeaderRowInfoAtomByRowId,
    clear,
  }
})

export const dataBasicAtom = atom((getter) => {
  const dataFamily = getter(dataFamilyAtom)

  return {
    ...dataFamily,
    parentNodeSetAtom,
    relationAtom,
    loadingAtom,
    nodeLevelAtom,
    rootAtom,
  }
})
