import { atom, type Store } from 'einfach-state'
import { createAtomFamilyEntity } from '../utils/createAtomFamily'
import type { ColumnType } from '../types'
import { incrementAtom } from '../utils/incrementAtom'
import { ROOT } from '../utils/const'
import type { ColumnId, RowId } from '@grid-table/basic/src'

export function createDataContent(store: Store, { root = ROOT }: { root?: string }) {
  const { createAtomFamily, clear } = createAtomFamilyEntity()

  const getColumnOptionAtomByColumnId = createAtomFamily({
    debuggerKey: 'getColumnOptionAtomByColumnId',
    createAtom(key: ColumnId, initState?: ColumnType) {
      return incrementAtom(initState!)
    },
  })

  const getRowInfoAtomByRowId = createAtomFamily<Record<string, any> | null, RowId>({
    debuggerKey: 'getRowInfoAtomByRowId',
  })

  const relationAtom = atom(new Map<RowId, RowId[]>())

  const loadingAtom = atom<boolean>(true)

  /**
   * 用来计算节点是否有子级
   */
  const parentNodeSetAtom = atom((getter) => {
    return new Set(getter(relationAtom).keys())
  })

  /**
   * 存储节点level信息
   */
  const nodeLevelAtom = atom<Map<RowId, number>>(new Map())

  return {
    parentNodeSetAtom,
    relationAtom,
    getRowInfoAtomByRowId,
    getColumnOptionAtomByColumnId,
    loadingAtom,
    nodeLevelAtom,
    root,
    clear,
    store,
  }
}

export type DataContextType = ReturnType<typeof createDataContent>
