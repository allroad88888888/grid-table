import { atom } from 'einfach-state'
import type { DataTodoProps, Id, Relation } from './../types'
import { ROOT } from './../utils'
import { format } from '../utils/format'
import { easyMergeOptions } from '../utils/easyMergeOptions'

export const iniAtom = atom(0, (getter, setter, relation: Relation, props: DataTodoProps) => {
  setter(dataOptions, (prev) => {
    return easyMergeOptions(prev, props)
  })

  const options = getter(dataOptions)

  const { allIds, parentIdLevel, idParentIdMap } = format(relation, options)

  setter(relationAtom, relation)
  setter(rootAtom, options.root)
  setter(allIdsAtom, allIds)
  setter(parentIdLevelAtom, parentIdLevel)
  setter(idParentIdMapAtom, idParentIdMap)
})

// 树形关系
export const relationAtom = atom<Relation>({})

// 跟节点
export const rootAtom = atom<Id>(ROOT)

// 平铺所有的id
export const allIdsAtom = atom<Id[]>([])

// id跟parentId关系
export const idParentIdMapAtom = atom(new Map<Id, Id>())

// 所有父节点
export const parentSetIdAtom = atom((getter) => {
  const relation = getter(relationAtom)
  return new Set(
    Object.keys(relation).filter((key) => {
      return relation[key].length > 0
    }),
  ) as Set<Id>
})

export const dataOptions = atom<Required<DataTodoProps>>({
  root: ROOT,
  expendLevel: 2,
  minLengthExpandAll: 100,
  keepTopDisabled: false,
  isTiling: false,
  disabledIds: [],
  showRoot: false,
})

/**
 * 每个id对应的level
 */
export const parentIdLevelAtom = atom(new Map<Id, number>())

// 收起的节点
export const collapseNodeSetAtom = atom(new Set<Id>())

// 目标 最终展示的ids
export const showIdsAtom = atom<Id[]>(function (getter) {
  const allIds = getter(allIdsAtom)
  const collapseNodeList = getter(collapseNodeSetAtom)
  const idParentIdMap = getter(idParentIdMapAtom)
  const parentIdLevel = getter(parentIdLevelAtom)

  let isValid = true
  let prevLevel: number = -2

  const showIds = allIds.filter((tId) => {
    const pId = idParentIdMap.get(tId)!
    const pLevel = parentIdLevel.get(pId)!
    if (pLevel < prevLevel) {
      isValid = true
    }
    if (collapseNodeList.has(tId) && isValid === true) {
      isValid = false
      prevLevel = pLevel + 1
      return true
    }

    return isValid
  })

  return showIds
})
