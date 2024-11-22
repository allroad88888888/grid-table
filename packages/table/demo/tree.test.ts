import { describe, test, expect } from '@jest/globals'
import { businessTodo } from './business'
import { mockDataList } from './mock'
import type { TilingId } from './buildTreeByService'
import { removeLast, removeTop } from './buildTreeByService'

import { cleanRelation } from './demo'
import { ROOT } from './const'

describe('build tree', () => {
  test('easy', () => {
    const startT = performance.now()
    // const relation = businessTodo({
    //   relation: mockDataList.levelData,
    //   disableIds: mockDataList.disableCodes,
    // })

    const idPath: Map<string, string> = new Map()

    const sharePathMap: Map<string, string[]> = new Map()
    // const sharePathMap: Record<string, string[]> = {}

    const stack: { nodeId: string; path: string }[] = [{ nodeId: ROOT, path: ROOT }]

    while (stack.length > 0) {
      const { nodeId, path } = stack.pop()!
      const childIds = Array.from(new Set(mockDataList.levelData[nodeId]))
      if (childIds) {
        for (const childId of childIds) {
          const tPath = `${path}/${childId}`
          // idPath[childId] = tPath

          if (idPath.has(childId)) {
            if (!sharePathMap.has(childId)) {
              sharePathMap.set(childId, [])
            }
            sharePathMap.get(childId)!.push(tPath)
          }
          idPath.set(childId, tPath)

          stack.push({ nodeId: childId, path: tPath })
        }
      }
    }

    // // sac共享节点
    // const idParentId: Record<string, string> = {}

    // /**
    //  * 建立id-parentId关系
    //  * string 普通节点
    //  * string[] 共享节点
    //  */
    // const shareParentIds: Record<TilingId, TilingId | TilingId[]> = {}

    // Object.keys(mockDataList.levelData).forEach((element) => {
    //   const childIds = mockDataList.levelData[element]
    //   childIds.forEach((cId) => {
    //     idParentId[cId] = element
    //     // 共享节点处理
    //     if (cId in shareParentIds) {
    //       if (typeof shareParentIds[cId] === 'string') {
    //         shareParentIds[cId] = [shareParentIds[cId], element]
    //       } else {
    //         ;(shareParentIds[cId] as TilingId[]).push(element)
    //       }
    //     }
    //   })
    // })

    // /**
    //  * 先拍平- 递归性能贼拉胯
    //  * 用while 避免栈溢出
    //  *
    //  * ids 是数组，共享节点
    //  */
    // const ids: string[] = []
    // const stack: string[] = [ROOT]

    // while (stack.length > 0) {
    //   const currentId = stack.pop()!
    //   const childIds = mockDataList.levelData[currentId]
    //   if (childIds) {
    //     // 将当前节点的子节点按顺序入栈
    //     for (let i = childIds.length - 1; i >= 0; i--) {
    //       const cId = childIds[i]
    //       // 这么 一个操作 消耗2s
    //       // idParentId[cId] = currentId
    //       stack.push(cId)
    //     }
    //   }

    //   // ids.push(currentId)
    // }

    // // sac共享节点
    // const idParentId = {}

    // /**
    //  * 建立id-parentId关系
    //  * string 普通节点
    //  * string[] 共享节点
    //  */
    // const shareParentIds: Record<string, string | string[]> = {}

    // Object.keys(mockDataList.levelData).forEach((element) => {
    //   const childIds = mockDataList.levelData[element]
    //   childIds.forEach((cId) => {
    //     idParentId[cId] = element
    //     // 共享节点处理
    //     if (cId in shareParentIds) {
    //       if (typeof shareParentIds[cId] === 'string') {
    //         shareParentIds[cId] = [shareParentIds[cId], element]
    //       } else {
    //         shareParentIds[cId].push(element)
    //       }
    //     }
    //   })
    // })

    // const idInfoObj = {}

    // const currentLevel = 0
    // const parentIdSet = new Set()
    // ids.forEach((id) => {
    //   if (id in idParentId) {
    //     parentIdSet.add(idParentId[id])
    //   }
    //   // idInfoObj[id]={
    //   //   path:parentIdSet.has()
    //   // }
    // })

    // cleanRelation(mockDataList.levelData, new Set())
    // removeTop(mockDataList.levelData, new Set())
    // relation = removeTop(relation, setDisabledIds, false)

    const endT = performance.now()

    console.log(`总计消耗 ${endT - startT}`)
  })
})
