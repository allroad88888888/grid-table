import { getIdsByLevel } from '../getIdsByLevel'
import type { Relation } from '../../types'

describe('getIdsByLevel 性能测试', () => {
  it('10万节点，深度5层', () => {
    const relation: Relation = {}
    const root = 'root'
    let id = 0
    let currentLevel: string[] = [root]
    relation[root] = []
    let total = 1

    // 生成一棵10万节点的树
    for (let level = 0; level < 4 && total < 100000; level++) {
      const nextLevel: string[] = []
      for (const parent of currentLevel) {
        const childrenCount = Math.min(
          10,
          Math.floor(100000 / Math.pow(10, level + 1) / currentLevel.length),
        )
        for (let i = 0; i < childrenCount && total < 100000; i++) {
          const child = `n${id++}`
          if (!relation[parent]) relation[parent] = []
          relation[parent].push(child)
          relation[child] = []
          nextLevel.push(child)
          total++
        }
      }
      currentLevel = nextLevel
    }

    const start = Date.now()
    const result = getIdsByLevel(4, relation, root)
    const duration = Date.now() - start

    console.log(`10万节点，深度5层，耗时: ${duration}ms`)
    console.log(`返回父节点数: ${result.length}`)
    expect(duration).toBeLessThan(500) // 500ms内完成
  })

  it('50万节点，广度优先，深度≤10层', () => {
    const relation: Relation = {}
    const root = 'root'
    let id = 0
    relation[root] = []
    let total = 1
    const maxDepth = 9 // root为第0层，总共10层
    const maxNodes = 500000
    const maxBranchPerNode = 100 // 每个节点最多100个子节点

    // 使用队列进行广度优先遍历
    const queue: Array<{ id: string; level: number }> = [{ id: root, level: 0 }]
    let queueStart = 0

    while (queueStart < queue.length && total < maxNodes) {
      const { id: parentId, level } = queue[queueStart++]

      if (level < maxDepth) {
        // 计算这个节点应该有多少个子节点
        const remainingNodes = maxNodes - total
        const remainingLevels = maxDepth - level
        const remainingParents = queue.length - queueStart + 1

        // 动态计算分叉数，但不超过最大限制
        let branch = Math.min(
          maxBranchPerNode,
          Math.floor(remainingNodes / (remainingLevels * remainingParents)),
        )
        branch = Math.max(2, branch) // 至少2个子节点

        for (let i = 0; i < branch && total < maxNodes; i++) {
          const childId = `n${id++}`
          relation[parentId].push(childId)
          relation[childId] = []
          queue.push({ id: childId, level: level + 1 })
          total++
        }
      }
    }

    console.log(`生成节点总数: ${Object.keys(relation).length}`)
    console.log(`最大深度: ${queue.reduce((max, n) => Math.max(max, n.level), 0)}`)

    const start = Date.now()
    const result = getIdsByLevel(maxDepth, relation, root)
    const duration = Date.now() - start

    console.log(`50万节点，广度优先，深度≤10层，耗时: ${duration}ms`)
    console.log(`返回父节点数: ${result.length}`)

    expect(duration).toBeLessThan(2000) // 2秒内完成
    expect(Object.keys(relation).length).toBeGreaterThan(490000)
    expect(Object.keys(relation).length).toBeLessThanOrEqual(500000)
  })

  it('宽树结构：1万个直接子节点', () => {
    const relation: Relation = {}
    const root = 'root'
    relation[root] = []

    // 根节点有1万个直接子节点
    for (let i = 0; i < 10000; i++) {
      const child = `child${i}`
      relation[root].push(child)
      // 一半是父节点，一半是叶子节点
      if (i % 2 === 0) {
        relation[child] = [`grandchild${i}`]
        relation[`grandchild${i}`] = []
      } else {
        relation[child] = []
      }
    }

    const start = Date.now()
    const result = getIdsByLevel(1, relation, root)
    const duration = Date.now() - start

    console.log(`宽树结构（1万直接子节点），耗时: ${duration}ms`)
    console.log(`返回父节点数: ${result.length}`)
    expect(result.length).toBe(5001) // root + 5000个有子节点的child
    expect(duration).toBeLessThan(100) // 100ms内完成
  })

  it('深树结构：1万层深度', () => {
    const relation: Relation = {}
    let current = 'root'
    relation[current] = []

    // 创建1万层深的链式结构
    for (let i = 0; i < 10000; i++) {
      const next = `node${i}`
      relation[current] = [next]
      relation[next] = []
      current = next
    }

    const start = Date.now()
    const result = getIdsByLevel(9999, relation, 'root')
    const duration = Date.now() - start

    console.log(`深树结构（1万层深度），耗时: ${duration}ms`)
    console.log(`返回父节点数: ${result.length}`)
    expect(result.length).toBe(10000) // 所有节点都有子节点（除了最后一个）
    expect(duration).toBeLessThan(500) // 500ms内完成
  })
})
