import { describe, expect, it } from '@jest/globals'
import { distributeByFlexGrow } from '../utils'

describe('distributeByFlexGrow', () => {
  it('should distribute remaining space based on flexGrow values', () => {
    // 测试基本的 flexGrow 分配
    const currentWidths = [50, 50, 50] // 当前总宽度 150
    const flexGrowList = [1, 2, 1] // flexGrow 比例
    const totalWidth = 240 // 目标总宽度，剩余 90 像素

    const result = distributeByFlexGrow(currentWidths, flexGrowList, totalWidth)
    // flexGrow 总和为 4，剩余 90 像素
    // 第一列: 50 + (1/4) * 90 = 72.5 -> 73
    // 第二列: 50 + (2/4) * 90 = 95
    // 第三列: 50 + (1/4) * 90 = 72.5 -> 72 (调整保证总和)
    expect(result).toEqual([73, 95, 72])
  })

  it('should handle flexGrow value of 0 (no growth)', () => {
    const currentWidths = [50, 50, 50]
    const flexGrowList = [0, 1, 2] // 第一列不参与放大
    const totalWidth = 240 // 剩余 90 像素

    const result = distributeByFlexGrow(currentWidths, flexGrowList, totalWidth)
    // 总 flexGrow = 0 + 1 + 2 = 3，但第一列 flexGrow=0 不参与
    // 第一列: 50 + 0 = 50
    // 第二列: 50 + (1/3) * 90 = 80
    // 第三列: 50 + (2/3) * 90 = 110
    expect(result).toEqual([50, 80, 110])
  })

  it('should use default flexGrow of 1 when not specified', () => {
    const currentWidths = [30, 40, 50]
    const flexGrowList = [undefined, 1, 2] as any[]
    const totalWidth = 180 // 剩余 60 像素

    const result = distributeByFlexGrow(currentWidths, flexGrowList, totalWidth)
    // 使用默认值 1 for undefined
    // 总 flexGrow = 1 + 1 + 2 = 4
    // 第一列: 30 + (1/4) * 60 = 45
    // 第二列: 40 + (1/4) * 60 = 55
    // 第三列: 50 + (2/4) * 60 = 80
    expect(result).toEqual([45, 55, 80])
  })

  it('should return original widths when current total >= target', () => {
    const currentWidths = [50, 50, 50] // 总宽度 150
    const flexGrowList = [1, 1, 1]
    const totalWidth = 150 // 没有剩余空间

    const result = distributeByFlexGrow(currentWidths, flexGrowList, totalWidth)
    expect(result).toEqual([50, 50, 50])
  })

  it('should return original widths when current total > target', () => {
    const currentWidths = [50, 50, 50] // 总宽度 150
    const flexGrowList = [1, 1, 1]
    const totalWidth = 120 // 目标宽度小于当前总宽度

    const result = distributeByFlexGrow(currentWidths, flexGrowList, totalWidth)
    expect(result).toEqual([50, 50, 50])
  })

  it('should handle all flexGrow values being 0', () => {
    const currentWidths = [30, 40, 50]
    const flexGrowList = [0, 0, 0]
    const totalWidth = 180 // 剩余 60 像素

    const result = distributeByFlexGrow(currentWidths, flexGrowList, totalWidth)
    // 当所有 flexGrow 都为 0 时，平均分配剩余空间
    // 每列增加 60/3 = 20
    expect(result).toEqual([50, 60, 70])
  })

  it('should ensure minimum width of 1', () => {
    const currentWidths = [1, 1, 1]
    const flexGrowList = [1, 1, 1]
    const totalWidth = 6 // 剩余 3 像素

    const result = distributeByFlexGrow(currentWidths, flexGrowList, totalWidth)
    // 每列增加 1 像素
    expect(result).toEqual([2, 2, 2])
  })

  it('should handle unequal flexGrow values correctly', () => {
    const currentWidths = [40, 60]
    const flexGrowList = [3, 1] // 3:1 的比例
    const totalWidth = 200 // 剩余 100 像素

    const result = distributeByFlexGrow(currentWidths, flexGrowList, totalWidth)
    // 总 flexGrow = 4
    // 第一列: 40 + (3/4) * 100 = 115
    // 第二列: 60 + (1/4) * 100 = 85
    expect(result).toEqual([115, 85])
  })

  it('should throw error when arrays have different lengths', () => {
    const currentWidths = [50, 50]
    const flexGrowList = [1, 1, 1] // 长度不匹配

    expect(() => {
      distributeByFlexGrow(currentWidths, flexGrowList, 200)
    }).toThrow('currentWidths 和 flexGrowList 长度必须相同')
  })
})
