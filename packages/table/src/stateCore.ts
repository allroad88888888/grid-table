import type { ColumnType } from './types'
import { atom, incrementAtom, selectAtom } from '@einfach/react'
import type { ColumnId, RowId } from '@grid-table/basic'
import { nodeLevelAtom, parentNodeSetAtom, relationAtom, rootAtom } from './tree/stateTree'

import { createAtomFamily } from './utils/createAtomFamily'

export const loadingAtom = atom(true)

export const getColumnOptionAtomByColumnId = createAtomFamily({
  debuggerKey: 'ColumnOption-Atom-By-ColumnId',
  createAtom(key: ColumnId, initState?: ColumnType) {
    return incrementAtom(initState!)
  },
})

/**
 * 总的 rowInfo Map：rowId → rowInfo
 * dataInitAtom 一次性 set 整个 Map，避免逐行 setter 的开销
 */
export const rowInfoMapAtom = atom(new Map<RowId, Record<string, any> | null>())

const rowInfoSelectCache = new Map<string, ReturnType<typeof selectAtom>>()

/**
 * 通过 selectAtom 从 rowInfoMapAtom 中按 rowId 获取单行数据
 * 只有该行数据引用变化时才触发下游更新
 */
export function getRowInfoAtomByRowId(rowId: RowId) {
  if (!rowInfoSelectCache.has(rowId)) {
    const selected = selectAtom(rowInfoMapAtom, (map) => map.get(rowId) ?? null)
    selected.debugLabel = `RowInfo-Select||${rowId}`
    rowInfoSelectCache.set(rowId, selected)
  }
  return rowInfoSelectCache.get(rowId)!
}

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
