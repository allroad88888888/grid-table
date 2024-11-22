import { describe, test, expect } from '@jest/globals'

import { removeTop } from './buildTreeByService'

const Relation: Record<string, string[]> = {
  _ROOT: ['1'],
  '1': ['1-1'],
  '1-1': ['1-1-1', '1-1-2'],
  '1-1-1': ['1-1-1-1'],
}

describe('树形移除头部', () => {
  test('移除头部，禁用', () => {
    const relation = removeTop(Relation, new Set(['1', '1-1', '1-1-1']), false)
    expect(relation).toEqual({
      _ROOT: ['1-1-1', '1-1-2'],
      '1-1-1': ['1-1-1-1'],
    })
    const demo = { '1-1': ['1-1-1', '1-1-2'], '1-1-1': ['1-1-1-1'] }
  })
  test('移除头部，不禁用', () => {
    const relation = removeTop(Relation, new Set(['1', '1-1', '1-1-1']), true)
    expect(relation).toEqual({
      _ROOT: ['1'],
      '1': ['1-1'],
      '1-1': ['1-1-1', '1-1-2'],
      '1-1-1': ['1-1-1-1'],
    })
  })
})
