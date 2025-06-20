import { format } from '../format'
import type { Relation, DataTodoProps } from '../../types'

describe('format', () => {
  const baseProps: Required<DataTodoProps> = {
    root: 'root',
    expendLevel: 2,
    minLengthExpandAll: 100,
    keepTopDisabled: false,
    isTiling: false,
    disabledIds: [],
    showRoot: false,
  }

  it('基本树结构', () => {
    const relation: Relation = {
      root: ['a', 'b', 'c'],
      a: ['aa', 'ab', 'ac'],
      b: ['ba', 'bb', 'bc'],
      c: ['ca', 'cb', 'cc'],
    }
    const result = format(relation, baseProps)
    expect(result.allIds).toEqual([
      'a',
      'aa',
      'ab',
      'ac',
      'b',
      'ba',
      'bb',
      'bc',
      'c',
      'ca',
      'cb',
      'cc',
    ])
  })
})
