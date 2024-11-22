export type TilingId = string | number

import { ROOT } from './const'
import { buildPathByPathIdList } from './getPathListById'

export function removeLast(relation: Record<string, TilingId[]>, disableIds: Set<TilingId>) {
  if (disableIds.size === 0) {
    return relation
  }
  const endRemoveRelation = new Map<TilingId, Set<TilingId>>()
  const iteratorEndRemove = (id: TilingId) => {
    const children = relation[id] || []
    let childrenIsDisabled = true
    children.forEach((subId) => {
      const childIsDisabled = iteratorEndRemove(subId)
      if (!disableIds.has(subId) || childIsDisabled === false) {
        childrenIsDisabled = false
        if (!endRemoveRelation.has(id)) {
          endRemoveRelation.set(id, new Set())
        }

        endRemoveRelation.get(id)!.add(subId)
      }
    })
    return childrenIsDisabled
  }
  iteratorEndRemove(ROOT)

  const res: Record<TilingId, TilingId[]> = {}
  Object.keys(endRemoveRelation).forEach((key: TilingId) => {
    res[key] = Array.from(endRemoveRelation.get(key)!)
  })
  return res
}

export function removeTop(
  relation: Record<string, TilingId[]>,
  disableIds: Set<TilingId>,
  keepTopDisabled: boolean,
) {
  const newRelation = { ...relation }
  // const relationId = {} as Record<TilingId, Set<TilingId>>
  if (disableIds.size === 0) {
    return relation
  }

  if (keepTopDisabled === true) {
    return relation
  }

  const iteratorRemoveTop = (parentIds: TilingId[], topIsDisabled: boolean) => {
    if (topIsDisabled === false) {
      return
    }
    const newParentIds: TilingId[] = []

    const isDisabled = parentIds.every((pId) => {
      const children = relation[pId] || []
      return children.every((tId) => {
        newParentIds.push(tId)
        return disableIds.has(tId)
      })
    })

    if (isDisabled) {
      parentIds.forEach((pid) => {
        delete newRelation[pid]
      })
      iteratorRemoveTop(newParentIds, true)
      return
    }

    newRelation[ROOT] = newRelation[parentIds[0]]
    delete newRelation[parentIds[0]]
  }
  iteratorRemoveTop([ROOT], true)

  return newRelation
}

interface Option {
  isTiling?: boolean
  keepTopDisabled?: boolean
}
interface EasyTreeRelationChildren {
  id: TilingId
  path: string
  children?: EasyTreeRelationChildren[]
}

export function treeDataTodo(
  relation: Record<string, TilingId[]>,
  disableIds: TilingId[],
  options: Option = {
    isTiling: false,
    keepTopDisabled: false,
  },
) {
  const { isTiling = false, keepTopDisabled = false } = options
  const newPaths: Set<string> = new Set()
  const idPathMap = new Map<TilingId, string[]>()
  const pathIdMap = new Map<string, TilingId>()
  const relationPath = {} as Record<string, string[]>
  const data: EasyTreeRelationChildren = {
    id: ROOT,
    path: ROOT,
    children: [],
  }

  disableIds.push(ROOT)
  const setDisabledIds = new Set<TilingId>(disableIds || [])

  let newRelation: Record<TilingId, TilingId[]> = {}

  if (isTiling === true) {
    newRelation = buildTilingTree(relation, setDisabledIds)
  } else {
    newRelation = removeLast(relation, setDisabledIds)
    newRelation = removeTop(newRelation, setDisabledIds, keepTopDisabled)
  }

  // const newRelation = buildNewTree(relation, setDisabledIds, options);

  const iterator = (id: TilingId, path: TilingId[], parent: EasyTreeRelationChildren) => {
    const children = newRelation[id] || []

    if (!Object.prototype.hasOwnProperty.call(parent, 'children')) {
      // eslint-disable-next-line no-param-reassign
      parent.children = []
    }

    const parentPathStr = buildPathByPathIdList(path)

    if (children && children.length > 0) {
      children.forEach((subId) => {
        const subItem = {
          id: subId,
          path: '',
          children: [],
        }
        const realPath = [...path, subId]

        const realPathStr = buildPathByPathIdList(realPath)

        newPaths.add(realPathStr)
        if (!idPathMap.has(realPathStr)) {
          idPathMap.set(subId, [])
        }
        idPathMap.get(subId)?.push(realPathStr)
        pathIdMap.set(realPathStr, subId)
        if (!Object.prototype.hasOwnProperty.call(relationPath, parentPathStr)) {
          relationPath[parentPathStr] = []
        }
        relationPath[parentPathStr].push(realPathStr)
        parent.children?.push({
          ...subItem,
          path: realPathStr,
        })

        iterator(subId, realPath, subItem)
      })
    }
  }
  iterator(ROOT, [ROOT], data)

  return {
    relation: relationPath,
    setDisabledIds,
    idPathMap,
    pathIdMap,
    paths: Array.from(newPaths),
    relationWithChildren: data,
  }
}
