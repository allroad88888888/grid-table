import { describe, test, expect } from '@jest/globals'

import { cleanRelation } from './demo'

const Relation: Record<string, string[]> = {
  _ROOT: ['1', '2', '3', '4'],
  '1': ['1-1', '1-2', '1-3'],
  '2': ['2-1'],
  '3': ['3-1'],
  '1-1': ['1-1-1'],
}

describe('树形移除最后', () => {
  test('移除末尾', () => {
    const relation = cleanRelation(Relation, new Set(['1', '2', '2-1', '3', '1-1-1']))
    expect(relation).toEqual({
      _ROOT: ['1', '3', '4'],
      '1': ['1-1', '1-2', '1-3'],
      '3': ['3-1'],
    })
  })
})
