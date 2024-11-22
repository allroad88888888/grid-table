import type { TilingId } from './buildTreeByService'
import { removeLast, removeTop } from './buildTreeByService'
import { ROOT } from './const'
import { buildPathByPathIdList } from './getPathListById'

type WebItem = any

function initWebItem(
  { level, hasChildren = false, isExpand = false, path = '', isDisabled = false }: Partial<WebItem>,
  id: TilingId,
): WebItem {
  return {
    loading: true,
    loadStatus: 'start',
    level: level || 0,
    hasChildren,
    isExpand,
    path,
    id,
    isDisabled,
  }
}

export function businessTodo<T extends Record<string, any>>(data: {
  relation: Record<string, TilingId[]>
  disableIds: TilingId[]
}) {
  const newPaths: string[] = []
  const showPaths: string[] = []

  // const idPathToArrayMap = new Map<TilingId, TilingId[][] | string>()
  const maxLevel = 0
  const maxShowLevel = 0
  const expendLevel = 10

  const tempWebInfoMap = new Map<string, WebItem>()
  tempWebInfoMap.set(ROOT, initWebItem({ id: ROOT }, ROOT))
  const relationPath: Map<string, string[]> = new Map()
  const setDisabledIds = new Set([...data.disableIds, ...[]])
  let relation: Record<TilingId, TilingId[]>

  relation = data.relation

  let level = 0

  const tempPathMap = new Map<TilingId, string>()
  tempPathMap.set(ROOT, ROOT)

  const iteratorChildren = (childIds: TilingId[]) => {
    // const childIds = relation[prevKey]

    if (childIds.length === 0) {
      return
    }

    const nextChildrenIds: TilingId[] = []
    childIds.forEach((element) => {
      const parentPath = tempPathMap.get(element)!
      tempPathMap.delete(element)
      const hasChildren = element in relation && relation[element].length > 0
      if (hasChildren) {
        relation[element].forEach((cId) => {
          nextChildrenIds.push(cId)
          tempPathMap.set(cId, `${parentPath}/${element}}`)
        })
      }
      const completePathStr = `${parentPath}/${element}`
      // const isExpand = level < expendLevel
      // if (!relationPath.has(parentPath)) {
      //   relationPath.set(parentPath, [])
      // }
      // relationPath.get(parentPath)!.push(completePathStr)
      // newPaths.push(completePathStr)
      // if (level <= expendLevel) {
      //   showPaths.push(completePathStr as string)
      // }

      // const webInfo = initWebItem(
      //   {
      //     level,
      //     hasChildren,
      //     path: completePathStr as string,
      //     isDisabled: setDisabledIds.has(element),
      //     isExpand,
      //   },
      //   element,
      // )
      // tempWebInfoMap.set(completePathStr, webInfo)

      // if (!idPathToArrayMap.has(element)) {
      //   idPathToArrayMap.set(element, [])
      // }

      // idPathToArrayMap.get(element)?.push(completePath)
      // state.pathIdMap.set(completePathStr, element);
    })

    level += 1

    iteratorChildren(nextChildrenIds)
  }
  iteratorChildren([ROOT])
}
