import { format } from '../format'
import type { Relation, DataTodoProps } from '../../types'

describe('format 性能专项', () => {
  const baseProps: Required<DataTodoProps> = {
    root: 'a',
    expendLevel: 2,
    minLengthExpandAll: 100,
    keepTopDisabled: false,
    isTiling: false,
    disabledIds: [],
    showRoot: false,
  }

  it('50万节点，深度9层，2秒内完成', () => {
    // 生成一棵广度优先、深度不超过9的树，总节点约50万
    const relation: Relation = {}
    const root = 'a'
    let id = 0
    let currentLevel: string[] = [root]
    relation[root] = []
    let total = 1
    for (let level = 0; level < 8; level++) {
      const nextLevel: string[] = []
      for (const parent of currentLevel) {
        const childrenCount = Math.max(
          2,
          Math.floor(500000 / Math.pow(2, level + 1) / currentLevel.length),
        )
        for (let i = 0; i < childrenCount && total < 500000; i++) {
          const child = `n${id++}`
          if (!relation[parent]) relation[parent] = []
          relation[parent].push(child)
          relation[child] = []
          nextLevel.push(child)
          total++
        }
      }
      currentLevel = nextLevel
      if (total >= 500000) break
    }
    const props = { ...baseProps, root }
    const start = Date.now()
    const result = format(relation, props)
    const duration = Date.now() - start
    expect(result.allIds.length).toBeGreaterThan(499000)
    expect(duration).toBeLessThan(3000) // 2秒内完成
  })
})
