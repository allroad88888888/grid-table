import { getIdsByLevel } from '../getIdsByLevel'

describe('getIdsByLevel', () => {
  it('正常树结构', () => {
    const relation = {
      a: ['b', 'c'],
      b: ['d'],
      c: [],
      d: [],
    }
    // 0层: a（有子节点）
    expect(getIdsByLevel(0, relation, 'a')).toEqual(['a'])
    // 0-1层: a, b（都有子节点，c没有子节点不包含）
    expect(getIdsByLevel(1, relation, 'a')).toEqual(['a', 'b'])
    // 0-2层: a, b（d是叶子节点不包含）
    expect(getIdsByLevel(2, relation, 'a')).toEqual(['a', 'b'])
  })

  it('多根节点（指定不同root）', () => {
    const relation = {
      a: ['b'],
      c: ['d', 'e'],
      b: [],
      d: [],
      e: ['f'],
      f: [],
    }
    // 以a为root: 只有a有子节点
    expect(getIdsByLevel(0, relation, 'a')).toEqual(['a'])
    expect(getIdsByLevel(1, relation, 'a')).toEqual(['a'])

    // 以c为root: c和e有子节点
    expect(getIdsByLevel(0, relation, 'c')).toEqual(['c'])
    expect(getIdsByLevel(1, relation, 'c')).toEqual(['c', 'e'])
    expect(getIdsByLevel(2, relation, 'c')).toEqual(['c', 'e'])
  })

  it('深层嵌套结构', () => {
    const relation = {
      a: ['b'],
      b: ['c'],
      c: ['d'],
      d: ['e'],
      e: [],
    }
    // 每层只有一个父节点
    expect(getIdsByLevel(0, relation, 'a')).toEqual(['a'])
    expect(getIdsByLevel(1, relation, 'a')).toEqual(['a', 'b'])
    expect(getIdsByLevel(2, relation, 'a')).toEqual(['a', 'b', 'c'])
    expect(getIdsByLevel(3, relation, 'a')).toEqual(['a', 'b', 'c', 'd'])
    expect(getIdsByLevel(4, relation, 'a')).toEqual(['a', 'b', 'c', 'd'])
  })

  it('所有节点都是叶子节点', () => {
    const relation = {
      a: [],
      b: [],
      c: [],
    }
    // 没有任何节点有子节点
    expect(getIdsByLevel(0, relation, 'a')).toEqual([])
    expect(getIdsByLevel(1, relation, 'a')).toEqual([])
  })

  it('空树', () => {
    expect(getIdsByLevel(0, {}, 'a')).toEqual([])
    expect(getIdsByLevel(1, {}, 'a')).toEqual([])
  })

  it('负层级', () => {
    const relation = {
      a: ['b'],
      b: [],
    }
    expect(getIdsByLevel(-1, relation, 'a')).toEqual([])
  })

  it('根节点不存在', () => {
    const relation = {
      a: ['b'],
      b: [],
    }
    expect(getIdsByLevel(0, relation, 'x')).toEqual([])
  })

  it('混合结构', () => {
    const relation = {
      a: ['b', 'c', 'd'],
      b: ['e', 'f'],
      c: [],
      d: ['g'],
      e: [],
      f: [],
      g: ['h'],
      h: [],
    }
    // 0层: a
    expect(getIdsByLevel(0, relation, 'a')).toEqual(['a'])
    // 0-1层: a, b, d（c没有子节点）
    expect(getIdsByLevel(1, relation, 'a')).toEqual(['a', 'b', 'd'])
    // 0-2层: a, b, d, g（e,f,h都是叶子节点）
    expect(getIdsByLevel(2, relation, 'a')).toEqual(['a', 'b', 'd', 'g'])
    // 0-3层: 同上，h是叶子节点
    expect(getIdsByLevel(3, relation, 'a')).toEqual(['a', 'b', 'd', 'g'])
  })
})
