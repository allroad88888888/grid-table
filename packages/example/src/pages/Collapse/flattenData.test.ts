import { flattenData } from './format'

// 独立的测试数据，避免依赖外部 mock 文件，使测试更独立和清晰
const TEST_DATA = [
  {
    id: 1,
    name: 'Order-001',
    status: 'pending',
    items: [
      { itemId: 'A1', price: 10 },
      { itemId: 'A2', price: 20 },
    ],
    logs: [
      { logId: 'L1', message: 'Created' },
    ],
  },
  {
    id: 2,
    name: 'Order-002',
    status: 'completed',
    items: [], // 空数组
    logs: [],  // 空数组
  },
  {
    id: 3,
    name: 'Order-003',
    status: 'shipped',
    items: [
      { itemId: 'B1', price: 100 },
    ],
    logs: [
      { logId: 'L2', message: 'Packed' },
      { logId: 'L3', message: 'Shipped' },
      { logId: 'L4', message: 'Delivered' },
    ],
  },
]

describe('flattenData Comprehensive Tests', () => {
  
  describe('Basic Functionality', () => {
    it('should correctly flatten nested arrays into multiple rows', () => {
      // Order-001: items(2), logs(1) -> max 2 rows
      const result = flattenData([TEST_DATA[0]], ['items', 'logs'])
      
      expect(result.data).toHaveLength(2)
      
      // Check Row 1: Contains item[0] and log[0]
      expect(result.data[0]).toMatchObject({
        id: 1,
        'items||itemId': 'A1',
        'logs||logId': 'L1'
      })
      
      // Check Row 2: Contains item[1], log exhausted (undefined)
      expect(result.data[1]).toMatchObject({
        id: 1,
        'items||itemId': 'A2'
      })
      expect(result.data[1]['logs||logId']).toBeUndefined()
    })

    it('should handle empty arrays by preserving one row with undefined nested fields', () => {
      // Order-002: items(0), logs(0) -> max 1 row (preserved)
      const result = flattenData([TEST_DATA[1]], ['items', 'logs'])
      
      expect(result.data).toHaveLength(1)
      expect(result.data[0]).toMatchObject({
        id: 2,
        name: 'Order-002',
        status: 'completed'
      })
      // Ensure nested fields are not present
      expect(result.data[0]['items||itemId']).toBeUndefined()
    })

    it('should align data based on index', () => {
      // Order-003: items(1), logs(3) -> max 3 rows
      const result = flattenData([TEST_DATA[2]], ['items', 'logs'])
      
      expect(result.data).toHaveLength(3)
      
      // Row 1: item[0], log[0]
      expect(result.data[0]['items||itemId']).toBe('B1')
      expect(result.data[0]['logs||logId']).toBe('L2')
      
      // Row 2: item exhausted, log[1]
      expect(result.data[1]['items||itemId']).toBeUndefined()
      expect(result.data[1]['logs||logId']).toBe('L3')
      
      // Row 3: item exhausted, log[2]
      expect(result.data[2]['items||itemId']).toBeUndefined()
      expect(result.data[2]['logs||logId']).toBe('L4')
    })
  })

  describe('Column Collection', () => {
    it('should collect all unique column names including generated nested columns', () => {
      const result = flattenData(TEST_DATA, ['items', 'logs'])
      
      const cols = result.columns
      
      // Base columns
      expect(cols).toContain('id')
      expect(cols).toContain('name')
      expect(cols).toContain('status')
      
      // Nested columns from items
      expect(cols).toContain('items||itemId')
      expect(cols).toContain('items||price')
      
      // Nested columns from logs
      expect(cols).toContain('logs||logId')
      expect(cols).toContain('logs||message')
      
      // Original array columns should be removed
      expect(cols).not.toContain('items')
      expect(cols).not.toContain('logs')
    })
  })

  describe('Edge Cases', () => {
    it('should handle non-array values in arrayKeys gracefully', () => {
      const weirdData = [{
        id: 99,
        notAnArray: "I am a string", // Should be treated as empty array
        items: [{ val: 1 }]
      }]
      
      // @ts-ignore: Testing runtime robustness
      const result = flattenData(weirdData, ['notAnArray', 'items'])
      
      expect(result.data).toHaveLength(1)
      expect(result.data[0]['items||val']).toBe(1)
      // "notAnArray" was treated as empty array, so no columns generated for it
      const keys = Object.keys(result.data[0])
      expect(keys.some(k => k.includes('notAnArray'))).toBe(false)
    })

    it('should handle primitive values in arrays', () => {
      const primitiveData = [{
        id: 100,
        tags: ['urgent', 'high-priority']
      }]
      
      const result = flattenData(primitiveData, ['tags'])
      
      expect(result.data).toHaveLength(2)
      // Default behavior for primitives is { Key: value }
      expect(result.data[0]['tags']).toBe('urgent')
      expect(result.data[1]['tags']).toBe('high-priority')
      
      expect(result.columns).toContain('tags')
    })
    
    it('should handle null values in arrays gracefully', () => {
      const nullData = [{
        id: 101,
        items: [null, { val: 2 }]
      }]
      
      const result = flattenData(nullData, ['items'])
      
      expect(result.data).toHaveLength(2)
      // Null item -> treated as object but keys iteration empty -> no props added
      // But optimize implementation logic: if typeof object && !== null
      // So null falls to else -> { items: null } ? No, typeof null is 'object'.
      // Let's check implementation: if (typeof item === 'object' && item !== null)
      // Else -> mergedParts = { [keyStr]: item }
      // So null should result in { items: null }
      
      expect(result.data[0]['items']).toBeNull()
      expect(result.data[1]['items||val']).toBe(2)
    })
  })

  describe('Columns Option', () => {
    it('should only return specified columns when columns option is provided', () => {
      const result = flattenData([TEST_DATA[0]], ['items', 'logs'], {
        columns: ['id', 'items||price']
      })
      
      expect(result.data).toHaveLength(2)
      
      // Row 1 should only have id and items||price
      const row0Keys = Object.keys(result.data[0])
      expect(row0Keys).toHaveLength(2)
      expect(row0Keys).toContain('id')
      expect(row0Keys).toContain('items||price')
      expect(row0Keys).not.toContain('name')
      expect(row0Keys).not.toContain('items||itemId')
      expect(row0Keys).not.toContain('logs||logId')
      
      expect(result.columns).toHaveLength(2)
      expect(result.columns).toContain('id')
      expect(result.columns).toContain('items||price')
    })

    it('should return partial columns if some requested columns do not exist', () => {
      const result = flattenData([TEST_DATA[0]], ['items', 'logs'], {
        columns: ['id', 'non_existent_column']
      })
      
      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toHaveProperty('id')
      expect(result.data[0]).not.toHaveProperty('non_existent_column')
      
      // columns returned should only contain found columns
      expect(result.columns).toHaveLength(1)
      expect(result.columns).toContain('id')
      expect(result.columns).not.toContain('non_existent_column')
    })
  })
})
