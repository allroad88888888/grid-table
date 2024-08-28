import { atom, type Store } from 'einfach-state'
import { createAtomFamilyEntity } from '../../utils/createAtomFamily'
import type { ColumnType, Path } from './type'
import { incrementAtom } from '../../utils/incrementAtom'
import { ROOT } from './const'

export function createDataContent(store: Store, { root = ROOT }: { root?: string }) {
  const { createAtomFamily, clear } = createAtomFamilyEntity()

  const columnOptionsAtom = incrementAtom<ColumnType[]>([])

  const showPathListAtom = incrementAtom<Path[]>([])

  const getRowInfoAtomByPath = createAtomFamily<Record<string, any> | null>({
    debuggerKey: 'getRowInfoByPath',
  })

  const relationAtom = atom(new Map<string, string[]>())

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
  const nodeLevelAtom = atom<Map<string, number>>(new Map())

  return {
    parentNodeSetAtom,
    relationAtom,
    getRowInfoAtomByPath,
    columnOptionsAtom,
    loadingAtom,
    showPathListAtom,
    nodeLevelAtom,
    root,
    clear,
    store,
  }
}

export type DataContextType = ReturnType<typeof createDataContent>
