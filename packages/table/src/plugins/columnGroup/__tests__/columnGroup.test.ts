import { describe, test, expect } from '@jest/globals'
import { getMaxDepth, flattenColumns, buildHeaderGrid } from '../utils'
import type { GroupColumnType } from '../types'

const twoLevelColumns: GroupColumnType[] = [
  {
    title: '基本信息',
    key: 'basic',
    children: [
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '年龄', dataIndex: 'age', key: 'age' },
    ],
  },
  { title: '得分', dataIndex: 'score', key: 'score' },
]

const threeLevelColumns: GroupColumnType[] = [
  {
    title: 'A',
    key: 'a',
    children: [
      {
        title: 'A1',
        key: 'a1',
        children: [
          { title: 'A1a', dataIndex: 'a1a', key: 'a1a' },
          { title: 'A1b', dataIndex: 'a1b', key: 'a1b' },
        ],
      },
      { title: 'A2', dataIndex: 'a2', key: 'a2' },
    ],
  },
  { title: 'B', dataIndex: 'b', key: 'b' },
]

describe('getMaxDepth', () => {
  test('flat columns = depth 1', () => {
    const cols: GroupColumnType[] = [
      { title: 'A', key: 'a' },
      { title: 'B', key: 'b' },
    ]
    expect(getMaxDepth(cols)).toBe(1)
  })

  test('two-level columns = depth 2', () => {
    expect(getMaxDepth(twoLevelColumns)).toBe(2)
  })

  test('three-level columns = depth 3', () => {
    expect(getMaxDepth(threeLevelColumns)).toBe(3)
  })
})

describe('flattenColumns', () => {
  test('flat columns return as-is', () => {
    const cols: GroupColumnType[] = [
      { title: 'A', key: 'a', dataIndex: 'a' },
      { title: 'B', key: 'b', dataIndex: 'b' },
    ]
    expect(flattenColumns(cols)).toHaveLength(2)
  })

  test('two-level returns leaf columns', () => {
    const leaves = flattenColumns(twoLevelColumns)
    expect(leaves).toHaveLength(3)
    expect(leaves[0].key).toBe('name')
    expect(leaves[1].key).toBe('age')
    expect(leaves[2].key).toBe('score')
  })

  test('three-level returns leaf columns', () => {
    const leaves = flattenColumns(threeLevelColumns)
    expect(leaves).toHaveLength(4)
    expect(leaves.map((l) => l.key)).toEqual(['a1a', 'a1b', 'a2', 'b'])
  })
})

describe('buildHeaderGrid', () => {
  test('two-level grid layout', () => {
    const grid = buildHeaderGrid(twoLevelColumns)
    expect(grid).toHaveLength(2)

    // Row 0: [基本信息(colSpan=2), 得分(rowSpan=2)]
    expect(grid[0]).toHaveLength(2)
    expect(grid[0][0].column.title).toBe('基本信息')
    expect(grid[0][0].colSpan).toBe(2)
    expect(grid[0][0].rowSpan).toBe(1)
    expect(grid[0][1].column.title).toBe('得分')
    expect(grid[0][1].colSpan).toBe(1)
    expect(grid[0][1].rowSpan).toBe(2)

    // Row 1: [姓名, 年龄]
    expect(grid[1]).toHaveLength(2)
    expect(grid[1][0].column.title).toBe('姓名')
    expect(grid[1][1].column.title).toBe('年龄')
  })

  test('three-level grid layout', () => {
    const grid = buildHeaderGrid(threeLevelColumns)
    expect(grid).toHaveLength(3)

    // Row 0: [A(colSpan=3), B(rowSpan=3)]
    expect(grid[0][0].colSpan).toBe(3)
    expect(grid[0][1].rowSpan).toBe(3)

    // Row 1: [A1(colSpan=2), A2(rowSpan=2)]
    expect(grid[1][0].colSpan).toBe(2)
    expect(grid[1][1].rowSpan).toBe(2)

    // Row 2: [A1a, A1b]
    expect(grid[2]).toHaveLength(2)
  })

  test('colStart indices are correct', () => {
    const grid = buildHeaderGrid(twoLevelColumns)
    // 基本信息 starts at 0
    expect(grid[0][0].colStart).toBe(0)
    // 得分 starts at 2
    expect(grid[0][1].colStart).toBe(2)
    // 姓名 starts at 0
    expect(grid[1][0].colStart).toBe(0)
    // 年龄 starts at 1
    expect(grid[1][1].colStart).toBe(1)
  })
})
