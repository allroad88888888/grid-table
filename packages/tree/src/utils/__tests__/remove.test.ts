import { removeNodeFromTree, batchRemoveNodes } from '../remove'
import { ROOT } from '../const'

describe('树形结构删除方法测试', () => {
  // 测试数据准备
  const createTestData = () => ({
    relation: {
      [ROOT]: ['node1', 'node2', 'node3'],
      node1: ['node1-1', 'node1-2'],
      node2: ['node2-1'],
      'node1-1': ['node1-1-1'],
    },
    parentMap: {
      'node1-1': 'node1',
      'node1-2': 'node1',
      'node2-1': 'node2',
      'node1-1-1': 'node1-1',
    },
  })

  describe('removeNodeFromTree', () => {
    it('应该删除叶子节点', () => {
      const { relation, parentMap } = createTestData()
      const result = removeNodeFromTree({
        nodeId: 'node1-1-1',
        relation,
        parentMap,
      })

      expect(result.relation['node1-1']).toEqual([])
      expect(result.parentMap['node1-1-1']).toBeUndefined()
      expect(result.relation['node1-1-1']).toBeUndefined()
    })

    it('应该级联删除节点及其所有子节点', () => {
      const { relation, parentMap } = createTestData()
      const result = removeNodeFromTree({
        nodeId: 'node1',
        relation,
        parentMap,
        cascade: true,
      })

      expect(result.relation[ROOT]).toEqual(['node2', 'node3'])
      expect(result.relation['node1']).toBeUndefined()
      expect(result.relation['node1-1']).toBeUndefined()
      expect(result.relation['node1-2']).toBeUndefined()
      expect(result.relation['node1-1-1']).toBeUndefined()
      expect(result.parentMap['node1-1']).toBeUndefined()
      expect(result.parentMap['node1-2']).toBeUndefined()
      expect(result.parentMap['node1-1-1']).toBeUndefined()
    })

    it('应该非级联删除节点，子节点提升到父节点下', () => {
      const { relation, parentMap } = createTestData()
      const result = removeNodeFromTree({
        nodeId: 'node1',
        relation,
        parentMap,
        cascade: false,
      })

      // node1-1 和 node1-2 应该提升到 ROOT 下
      expect(result.relation[ROOT]).toEqual(['node1-1', 'node1-2', 'node2', 'node3'])
      expect(result.relation['node1']).toBeUndefined()
      expect(result.parentMap['node1-1']).toBe(ROOT)
      expect(result.parentMap['node1-2']).toBe(ROOT)

      // 子节点的子节点应该保持不变
      expect(result.relation['node1-1']).toEqual(['node1-1-1'])
      expect(result.parentMap['node1-1-1']).toBe('node1-1')
    })

    it('应该删除顶级节点', () => {
      const { relation, parentMap } = createTestData()
      const result = removeNodeFromTree({
        nodeId: 'node3', // 没有子节点的顶级节点
        relation,
        parentMap,
      })

      expect(result.relation[ROOT]).toEqual(['node1', 'node2'])
      expect(result.relation['node3']).toBeUndefined()
    })

    it('应该优雅处理不存在的节点', () => {
      const { relation, parentMap } = createTestData()
      const result = removeNodeFromTree({
        nodeId: 'nonexistent',
        relation,
        parentMap,
      })

      // 应该返回原始数据，不进行任何修改
      expect(result.relation).toEqual(relation)
      expect(result.parentMap).toEqual(parentMap)
    })

    it('应该支持自定义根节点名称', () => {
      const customRoot = 'myRoot'
      const relation = {
        [customRoot]: ['node1', 'node2'],
        node1: ['node1-1'],
      }
      const parentMap = {
        'node1-1': 'node1',
      }

      const result = removeNodeFromTree({
        nodeId: 'node1',
        relation,
        parentMap,
        root: customRoot,
        cascade: true,
      })

      expect(result.relation[customRoot]).toEqual(['node2'])
      expect(result.relation['node1']).toBeUndefined()
      expect(result.relation['node1-1']).toBeUndefined()
      expect(result.parentMap['node1-1']).toBeUndefined()
    })
  })

  describe('batchRemoveNodes', () => {
    it('应该批量删除多个节点', () => {
      const { relation, parentMap } = createTestData()
      const result = batchRemoveNodes({
        nodeIds: ['node1-1', 'node2-1', 'node3'],
        relation,
        parentMap,
      })

      expect(result.relation[ROOT]).toEqual(['node1', 'node2'])
      expect(result.relation['node1']).toEqual(['node1-2'])
      expect(result.relation['node2']).toEqual([])
      expect(result.relation['node1-1']).toBeUndefined()
      expect(result.relation['node1-1-1']).toBeUndefined() // 级联删除
      expect(result.relation['node2-1']).toBeUndefined()
      expect(result.relation['node3']).toBeUndefined()
    })

    it('应该按顺序执行批量删除', () => {
      const { relation, parentMap } = createTestData()
      const result = batchRemoveNodes({
        nodeIds: ['node1', 'node1-1'], // node1-1 已经被删除，不应该再尝试删除
        relation,
        parentMap,
      })

      expect(result.relation[ROOT]).toEqual(['node2', 'node3'])
      expect(result.relation['node1']).toBeUndefined()
      expect(result.relation['node1-1']).toBeUndefined()
    })

    it('应该支持批量非级联删除', () => {
      const { relation, parentMap } = createTestData()
      const result = batchRemoveNodes({
        nodeIds: ['node1', 'node2'],
        relation,
        parentMap,
        cascade: false,
      })

      expect(result.relation[ROOT]).toEqual(['node1-1', 'node1-2', 'node2-1', 'node3'])
      expect(result.parentMap['node1-1']).toBe(ROOT)
      expect(result.parentMap['node1-2']).toBe(ROOT)
      expect(result.parentMap['node2-1']).toBe(ROOT)
    })

    it('应该正确处理空数组', () => {
      const { relation, parentMap } = createTestData()
      const result = batchRemoveNodes({
        nodeIds: [],
        relation,
        parentMap,
      })

      // 应该返回原始数据，不进行任何修改
      expect(result.relation).toEqual(relation)
      expect(result.parentMap).toEqual(parentMap)
    })
  })

  describe('复杂场景测试', () => {
    it('应该处理深层嵌套结构的删除', () => {
      // 创建更复杂的嵌套结构
      const relation = {
        [ROOT]: ['A', 'B'],
        A: ['A1', 'A2'],
        A1: ['A1a', 'A1b'],
        A1a: ['A1a1', 'A1a2'],
        B: ['B1', 'B2'],
        B1: ['B1a'],
      }
      const parentMap = {
        A1: 'A',
        A2: 'A',
        A1a: 'A1',
        A1b: 'A1',
        A1a1: 'A1a',
        A1a2: 'A1a',
        B1: 'B',
        B2: 'B',
        B1a: 'B1',
      }

      // 删除 A1，应该级联删除所有子节点
      const result = removeNodeFromTree({
        nodeId: 'A1',
        relation,
        parentMap,
      })

      expect(result.relation['A']).toEqual(['A2'])
      expect(result.relation['A1']).toBeUndefined()
      expect(result.relation['A1a']).toBeUndefined()
      expect(result.relation['A1b']).toBeUndefined()
      expect(result.relation['A1a1']).toBeUndefined()
      expect(result.relation['A1a2']).toBeUndefined()

      // B 分支应该保持不变
      expect(result.relation['B']).toEqual(['B1', 'B2'])
      expect(result.relation['B1']).toEqual(['B1a'])
    })

    it('应该在非级联删除时正确处理子节点的顺序', () => {
      const relation = {
        [ROOT]: ['A', 'B', 'C'],
        A: ['A1', 'A2', 'A3'],
      }
      const parentMap = {
        A1: 'A',
        A2: 'A',
        A3: 'A',
      }

      const result = removeNodeFromTree({
        nodeId: 'A',
        relation,
        parentMap,
        cascade: false,
      })

      // A 的子节点应该按照原来的顺序提升到 ROOT 下，并插入到 A 原来的位置
      expect(result.relation[ROOT]).toEqual(['A1', 'A2', 'A3', 'B', 'C'])
      expect(result.parentMap['A1']).toBe(ROOT)
      expect(result.parentMap['A2']).toBe(ROOT)
      expect(result.parentMap['A3']).toBe(ROOT)
    })
  })
})
