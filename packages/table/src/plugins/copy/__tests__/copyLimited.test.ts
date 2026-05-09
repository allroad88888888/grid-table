import { describe, test, expect } from '@jest/globals'
import { getTotalSelectedCells, hasSelectedAreas } from '../copyUtils'
import type { CopyAreas } from '../types'

describe('copy gating under isLimited (20M cell selection)', () => {
  const limitedAreas: CopyAreas = {
    cellTbodyList: [],
    cellTheadList: [],
    totalCellCount: 20_000_000,
    isLimited: true,
  }

  test('getTotalSelectedCells 透传 totalCellCount 而不是看空 list 长度', () => {
    expect(getTotalSelectedCells(limitedAreas)).toBe(20_000_000)
  })

  test('hasSelectedAreas 在 isLimited 下仍然识别为有选区', () => {
    expect(hasSelectedAreas(limitedAreas)).toBe(true)
  })

  test('未提供 totalCellCount 时回退到累加 cell 数（不再误用 row 数）', () => {
    const areas: CopyAreas = {
      cellTbodyList: [
        ['r0|c0', 'r0|c1', 'r0|c2'],
        ['r1|c0', 'r1|c1', 'r1|c2'],
      ],
      cellTheadList: [['h0|c0', 'h0|c1', 'h0|c2']],
    }
    // 旧实现返回 3（list 长度合计），正确值是 9
    expect(getTotalSelectedCells(areas)).toBe(9)
  })

  test('空选区都不算有选区', () => {
    expect(hasSelectedAreas(null)).toBe(false)
    expect(hasSelectedAreas(undefined)).toBe(false)
    expect(
      hasSelectedAreas({
        cellTbodyList: [],
        cellTheadList: [],
      }),
    ).toBe(false)
    expect(
      hasSelectedAreas({
        cellTbodyList: [],
        cellTheadList: [],
        totalCellCount: 0,
        isLimited: false,
      }),
    ).toBe(false)
  })
})
