import type { ColumnType } from './types'
import { atom, incrementAtom } from '@einfach/react'
import type { ColumnId } from '@grid-table/basic'
import { nodeLevelAtom, parentNodeSetAtom, relationAtom, rootAtom } from './tree/stateTree'

import { createAtomFamily } from './utils/createAtomFamily'

export const loadingAtom = atom(true)

export const getColumnOptionAtomByColumnId = createAtomFamily({
  debuggerKey: 'ColumnOption-Atom-By-ColumnId',
  createAtom(key: ColumnId, initState?: ColumnType) {
    return incrementAtom(initState!)
  },
})

export const getRowInfoAtomByRowId = createAtomFamily<Record<string, any> | null>({
  debuggerKey: 'RowInfo-Atom-By-RowId',
})

export const getHeaderRowInfoAtomByRowId = createAtomFamily<Record<string, any> | null>({
  debuggerKey: 'Header-RowInfo-Atom-By-RowId',
})

export const dataFamilyAtom = atom(() => {
  return {
    getRowInfoAtomByRowId,
    getColumnOptionAtomByColumnId,
    getHeaderRowInfoAtomByRowId,
    clear: () => {},
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
