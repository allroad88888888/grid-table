import { describe, expect, it } from '@jest/globals'
import { distributeColumnWidths } from '../utils'

describe('distributeColumnWidths', () => {
  it('应该正确处理空列数组', () => {
    const result = distributeColumnWidths([], 1000, 50)
    expect(result).toEqual([])
  })

  it('应该正确处理所有列都有宽度的情况', () => {
    const columns = [{ width: 100 }, { width: 150 }, { width: 200 }]
    const result = distributeColumnWidths(columns, 1000, 50)
    expect(result).toEqual([100, 150, 200])
  })

  it('应该正确处理所有列都没有宽度的情况', () => {
    const columns = [{}, {}, {}]
    const result = distributeColumnWidths(columns, 300, 50)
    // 300 / 3 = 100，大于最小宽度 50
    expect(result).toEqual([100, 100, 100])
  })

  it('应该正确处理部分列有宽度的情况', () => {
    const columns = [
      { width: 100 }, // 固定宽度
      {}, // 灵活宽度
      { width: 150 }, // 固定宽度
      {}, // 灵活宽度
    ]
    // 容器宽度 1000，固定宽度 100 + 150 = 250
    // 剩余宽度 750，分配给 2 列，每列 375
    const result = distributeColumnWidths(columns, 1000, 50)
    expect(result).toEqual([100, 375, 150, 375])
  })

  it('当分配宽度小于最小宽度时应该使用最小宽度', () => {
    const columns = [{ width: 100 }, {}, {}, {}]
    // 容器宽度 200，固定宽度 100，剩余 100 分配给 3 列
    // 每列约 33.33，小于最小宽度 50，所以使用 50
    const result = distributeColumnWidths(columns, 200, 50)
    expect(result).toEqual([100, 50, 50, 50])
  })

  it('当固定宽度总和大于等于容器宽度时应该保持现有逻辑', () => {
    const columns = [{ width: 300 }, {}, { width: 400 }]
    // 固定宽度总和 700，大于容器宽度 500
    const result = distributeColumnWidths(columns, 500, 50)
    expect(result).toEqual([300, 50, 400])
  })

  it('应该正确处理只有一列没有宽度的情况', () => {
    const columns = [{ width: 100 }, { width: 200 }, {}]
    // 容器宽度 500，固定宽度 300，剩余 200 全部给最后一列
    const result = distributeColumnWidths(columns, 500, 50)
    expect(result).toEqual([100, 200, 200])
  })

  it('应该处理 width 为 0 的情况', () => {
    const columns = [
      { width: 0 }, // 应该被当作没有宽度
      { width: 100 },
      {},
    ]
    // width 为 0 和 undefined 都应该被当作灵活列
    const result = distributeColumnWidths(columns, 400, 50)
    // 固定宽度 100，剩余 300 分配给 2 列，每列 150
    expect(result).toEqual([150, 100, 150])
  })
})
