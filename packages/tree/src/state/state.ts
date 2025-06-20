import { atom, selectAtom } from '@einfach/react'
import type { DataTodoProps, Id, Relation } from './../types'
import { ROOT } from './../utils'
import { format } from '../utils/format'
import { easyMergeOptions } from '../utils/easyMergeOptions'
import { countRelationIds } from '../utils/countRelationIds'
import { getIdsByLevel } from '../utils/getIdsByLevel'

export const iniAtom = atom(0, (getter, setter, relation: Relation, props: DataTodoProps) => {
  setter(dataOptionsAtom, (prev) => {
    return easyMergeOptions(prev, props)
  })

  const { minLengthExpandAll = 100, expendLevel = 2, root = ROOT } = props

  if (expendLevel) {
    const levelIds = new Set(getIdsByLevel(expendLevel, relation, root))

    const parentIds = Object.keys(relation).filter((id) => {
      return !levelIds.has(id)
    })

    setter(collapseNodeSetAtom, new Set(parentIds))
  }
  // 整棵树少于多少个，就全部展开 .这个优先级大于expendLevel
  if (minLengthExpandAll) {
    const allIds = countRelationIds(relation)
    if (allIds < minLengthExpandAll) {
      setter(collapseNodeSetAtom, new Set())
    }
  }

  setter(relationAtom, relation)
})

export const dataOptionsAtom = atom<Required<DataTodoProps>>({
  root: ROOT,
  expendLevel: 2,
  minLengthExpandAll: 100,
  keepTopDisabled: false,
  isTiling: false,
  disabledIds: [],
  showRoot: false,
})

export const coreAtom = atom((getter) => {
  const relation = getter(relationAtom)
  const options = getter(dataOptionsAtom)
  const { allIds, parentIdLevel, idParentIdMap } = format(relation, options)

  return {
    allIds,
    idParentIdMap,
    parentIdLevel,
  }
})

// 树形关系
export const relationAtom = atom<Relation>({})

// 跟节点
export const rootAtom = selectAtom(dataOptionsAtom, (options) => options.root)

// 平铺所有的id
export const tillingIdsAtom = selectAtom(coreAtom, (core) => core.allIds)

// id跟parentId关系
export const idParentIdMapAtom = selectAtom(coreAtom, (core) => core.idParentIdMap)

// 所有父节点
export const parentSetIdAtom = atom((getter) => {
  const relation = getter(relationAtom)
  return new Set(
    Object.keys(relation).filter((key) => {
      return relation[key].length > 0
    }),
  ) as Set<Id>
})

/**
 * 每个id对应的level
 */
export const parentIdLevelAtom = selectAtom(coreAtom, (core) => core.parentIdLevel)

// 收起的节点
export const collapseNodeSetAtom = atom(new Set<Id>())

// 目标 最终展示的ids
export const showIdsAtom = atom<Id[]>(function (getter) {
  const allIds = getter(tillingIdsAtom)
  const collapseNodeList = getter(collapseNodeSetAtom)

  const idParentIdMap = getter(idParentIdMapAtom)
  const parentIdLevel = getter(parentIdLevelAtom)

  let isValid = true
  let prevLevel: number = -2

  const showIds = allIds.filter((tId) => {
    const pId = idParentIdMap[tId]
    const pLevel = parentIdLevel[pId]
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
