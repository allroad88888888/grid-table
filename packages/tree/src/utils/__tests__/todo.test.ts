import { insertNodeInTree, batchInsertNodes } from '../insert'
import { ROOT } from '../const'

describe('树形结构插入方法测试', () => {
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

  describe('insertNodeInTree', () => {
    describe('顶级节点同级插入', () => {
      it('应该在顶级节点前面插入新节点', () => {
        const { relation, parentMap } = createTestData()
        const result = insertNodeInTree({
          currentId: 'node2',
          newId: 'newNode',
          position: 'before',
          relation,
          parentMap,
        })

        expect(result.relation[ROOT]).toEqual(['node1', 'newNode', 'node2', 'node3'])
        expect(result.parentMap['newNode']).toBeUndefined()
      })

      it('应该在顶级节点后面插入新节点', () => {
        const { relation, parentMap } = createTestData()
        const result = insertNodeInTree({
          currentId: 'node2',
          newId: 'newNode',
          position: 'after',
          relation,
          parentMap,
        })

        expect(result.relation[ROOT]).toEqual(['node1', 'node2', 'newNode', 'node3'])
        expect(result.parentMap['newNode']).toBeUndefined()
      })
    })

    describe('非顶级节点同级插入', () => {
      it('应该在子节点前面插入新节点', () => {
        const { relation, parentMap } = createTestData()
        const result = insertNodeInTree({
          currentId: 'node1-2',
          newId: 'newNode',
          position: 'before',
          relation,
          parentMap,
        })

        expect(result.relation['node1']).toEqual(['node1-1', 'newNode', 'node1-2'])
        expect(result.parentMap['newNode']).toBe('node1')
      })

      it('应该在子节点后面插入新节点', () => {
        const { relation, parentMap } = createTestData()
        const result = insertNodeInTree({
          currentId: 'node1-1',
          newId: 'newNode',
          position: 'after',
          relation,
          parentMap,
        })

        expect(result.relation['node1']).toEqual(['node1-1', 'newNode', 'node1-2'])
        expect(result.parentMap['newNode']).toBe('node1')
      })
    })

    describe('子级插入', () => {
      it('应该在指定节点的子级前面插入新节点', () => {
        const { relation, parentMap } = createTestData()
        const result = insertNodeInTree({
          currentId: 'node1',
          newId: 'newNode',
          position: 'child-first',
          relation,
          parentMap,
        })

        expect(result.relation['node1']).toEqual(['newNode', 'node1-1', 'node1-2'])
        expect(result.parentMap['newNode']).toBe('node1')
      })

      it('应该在指定节点的子级后面插入新节点', () => {
        const { relation, parentMap } = createTestData()
        const result = insertNodeInTree({
          currentId: 'node1',
          newId: 'newNode',
          position: 'child-last',
          relation,
          parentMap,
        })

        expect(result.relation['node1']).toEqual(['node1-1', 'node1-2', 'newNode'])
        expect(result.parentMap['newNode']).toBe('node1')
      })

      it('应该在ROOT下插入子节点时不记录到parentMap', () => {
        const { relation, parentMap } = createTestData()
        const result = insertNodeInTree({
          currentId: ROOT,
          newId: 'newNode',
          position: 'child-first',
          relation,
          parentMap,
        })

        expect(result.relation[ROOT]).toEqual(['newNode', 'node1', 'node2', 'node3'])
        expect(result.parentMap['newNode']).toBeUndefined()
      })
    })

    describe('错误处理', () => {
      it('尝试在根节点同级插入应该抛出错误', () => {
        const { relation, parentMap } = createTestData()

        expect(() => {
          insertNodeInTree({
            currentId: ROOT,
            newId: 'newNode',
            position: 'before',
            relation,
            parentMap,
          })
        }).toThrow(`无法在根节点 ${ROOT} 的同级插入新节点，因为没有父节点`)
      })
    })

    describe('自定义root', () => {
      it('应该支持自定义root名称', () => {
        const customRoot = 'myRoot'
        const relation = {
          [customRoot]: ['node1', 'node2'],
        }
        const parentMap = {}

        const result = insertNodeInTree({
          currentId: 'node1',
          newId: 'newNode',
          position: 'after',
          relation,
          parentMap,
          root: customRoot,
        })

        expect(result.relation[customRoot]).toEqual(['node1', 'newNode', 'node2'])
      })
    })

    describe('数据不变性', () => {
      it('不应该修改原始数据', () => {
        const { relation, parentMap } = createTestData()
        const originalRelation = JSON.parse(JSON.stringify(relation))
        const originalParentMap = JSON.parse(JSON.stringify(parentMap))

        insertNodeInTree({
          currentId: 'node1',
          newId: 'newNode',
          position: 'before',
          relation,
          parentMap,
        })

        expect(relation).toEqual(originalRelation)
        expect(parentMap).toEqual(originalParentMap)
      })
    })
  })

  describe('batchInsertNodes', () => {
    it('应该批量插入多个节点', () => {
      const { relation, parentMap } = createTestData()
      const result = batchInsertNodes({
        insertions: [
          { currentId: 'node1', newId: 'new1', position: 'before' },
          { currentId: 'node2', newId: 'new2', position: 'child-first' },
          { currentId: 'node3', newId: 'new3', position: 'after' },
        ],
        relation,
        parentMap,
      })

      expect(result.relation[ROOT]).toContain('new1')
      expect(result.relation['node2']).toContain('new2')
      expect(result.relation[ROOT]).toContain('new3')
      expect(result.parentMap['new2']).toBe('node2')
    })

    it('应该按顺序执行批量插入', () => {
      const { relation, parentMap } = createTestData()
      const result = batchInsertNodes({
        insertions: [
          { currentId: 'node1', newId: 'new1', position: 'after' },
          { currentId: 'new1', newId: 'new2', position: 'after' },
        ],
        relation,
        parentMap,
      })

      expect(result.relation[ROOT]).toEqual(['node1', 'new1', 'new2', 'node2', 'node3'])
    })

    it('应该支持自定义root的批量插入', () => {
      const customRoot = 'customRoot'
      const relation = {
        [customRoot]: ['node1', 'node2'],
      }
      const parentMap = {}

      const result = batchInsertNodes({
        insertions: [{ currentId: 'node1', newId: 'new1', position: 'before' }],
        relation,
        parentMap,
        root: customRoot,
      })

      expect(result.relation[customRoot]).toEqual(['new1', 'node1', 'node2'])
    })
  })
})
