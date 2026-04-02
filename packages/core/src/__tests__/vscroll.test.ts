import { describe, test, expect } from '@jest/globals'
import { binarySearchGte } from '../utils/binarySearch'

/**
 * 复现 useDelayScroll / useVScroll 的可见区域计算逻辑
 * 优化后的版本（二分查找）
 */
function buildSizeList(itemCount: number, calcItemSize: (i: number) => number) {
  const sizeList = [0]
  let total = 0
  for (let i = 0; i < itemCount; i++) {
    total += calcItemSize(i)
    sizeList.push(total)
  }
  return { sizeList, totalLength: total }
}

function findVisibleRange(
  sizeList: number[],
  totalLength: number,
  scrollPos: number,
  viewportLength: number,
  overscanCount: number,
  itemCount: number,
) {
  if (!itemCount || viewportLength === 0) {
    return { startIndex: -1, endIndex: -1 }
  }

  const visibleStartIndex = binarySearchGte(sizeList, scrollPos)

  let visibleEndIndex: number
  if (scrollPos + viewportLength >= totalLength) {
    visibleEndIndex = sizeList.length
  } else {
    visibleEndIndex = binarySearchGte(sizeList, scrollPos + viewportLength)
  }

  return {
    startIndex: Math.max(0, visibleStartIndex - overscanCount),
    endIndex: Math.min(itemCount, visibleEndIndex + overscanCount),
  }
}

/**
 * 旧实现（线性 findIndex + slice）用于对比验证
 */
function findVisibleRangeOld(
  sizeList: number[],
  totalLength: number,
  scrollPos: number,
  viewportLength: number,
  overscanCount: number,
  itemCount: number,
) {
  if (!itemCount || viewportLength === 0) {
    return { startIndex: -1, endIndex: -1 }
  }

  const visibleStartIndex = sizeList.findIndex((v) => v >= scrollPos)

  let visibleEndIndex: number
  if (scrollPos + viewportLength >= totalLength) {
    visibleEndIndex = sizeList.length
  } else {
    visibleEndIndex =
      sizeList.slice(visibleStartIndex).findIndex((v) => v >= scrollPos + viewportLength) +
      visibleStartIndex
  }

  return {
    startIndex: Math.max(0, visibleStartIndex - overscanCount),
    endIndex: Math.min(itemCount, visibleEndIndex + overscanCount),
  }
}

// ─── 固定行高场景 ────────────────────────────────────────
describe('findVisibleRange — fixed row height', () => {
  const ROW_HEIGHT = 36
  const ITEM_COUNT = 1000
  const VIEWPORT = 800
  const OVERSCAN = 10

  let sizeList: number[]
  let totalLength: number

  beforeAll(() => {
    const r = buildSizeList(ITEM_COUNT, () => ROW_HEIGHT)
    sizeList = r.sizeList
    totalLength = r.totalLength
  })

  test('scrollPos = 0 (顶部)', () => {
    const result = findVisibleRange(sizeList, totalLength, 0, VIEWPORT, OVERSCAN, ITEM_COUNT)
    expect(result.startIndex).toBe(0)
    // 800 / 36 ≈ 22 行可见 + 10 overscan
    expect(result.endIndex).toBeGreaterThanOrEqual(22)
    expect(result.endIndex).toBeLessThanOrEqual(35)
    expect(result).toEqual(
      findVisibleRangeOld(sizeList, totalLength, 0, VIEWPORT, OVERSCAN, ITEM_COUNT),
    )
  })

  test('scrollPos = 中间位置', () => {
    const scrollPos = 500 * ROW_HEIGHT // 滚到第 500 行
    const result = findVisibleRange(
      sizeList,
      totalLength,
      scrollPos,
      VIEWPORT,
      OVERSCAN,
      ITEM_COUNT,
    )
    expect(result.startIndex).toBe(490)
    expect(result).toEqual(
      findVisibleRangeOld(sizeList, totalLength, scrollPos, VIEWPORT, OVERSCAN, ITEM_COUNT),
    )
  })

  test('scrollPos = 接近底部', () => {
    const scrollPos = totalLength - VIEWPORT
    const result = findVisibleRange(
      sizeList,
      totalLength,
      scrollPos,
      VIEWPORT,
      OVERSCAN,
      ITEM_COUNT,
    )
    expect(result.endIndex).toBe(ITEM_COUNT)
    expect(result).toEqual(
      findVisibleRangeOld(sizeList, totalLength, scrollPos, VIEWPORT, OVERSCAN, ITEM_COUNT),
    )
  })

  test('scrollPos = 超过底部', () => {
    // 实际场景中浏览器会 clamp scrollPos，不会超过 totalLength - viewport
    // 旧实现此时 findIndex 返回 -1 导致 startIndex=0（bug）
    // 新实现返回尾部区域（更合理）
    const scrollPos = totalLength + 100
    const result = findVisibleRange(
      sizeList,
      totalLength,
      scrollPos,
      VIEWPORT,
      OVERSCAN,
      ITEM_COUNT,
    )
    expect(result.endIndex).toBe(ITEM_COUNT)
    // 新实现：startIndex 应在尾部附近
    expect(result.startIndex).toBeGreaterThan(ITEM_COUNT - OVERSCAN - 30)
  })

  test('scrollPos = 非行高整数倍', () => {
    const scrollPos = 500.5
    const result = findVisibleRange(
      sizeList,
      totalLength,
      scrollPos,
      VIEWPORT,
      OVERSCAN,
      ITEM_COUNT,
    )
    expect(result).toEqual(
      findVisibleRangeOld(sizeList, totalLength, scrollPos, VIEWPORT, OVERSCAN, ITEM_COUNT),
    )
  })
})

// ─── 可变行高场景 ────────────────────────────────────────
describe('findVisibleRange — variable row height', () => {
  const ITEM_COUNT = 5000
  const VIEWPORT = 600
  const OVERSCAN = 5

  let sizeList: number[]
  let totalLength: number

  beforeAll(() => {
    // 行高在 20-80 之间变化
    const r = buildSizeList(ITEM_COUNT, (i) => 20 + (i % 7) * 10)
    sizeList = r.sizeList
    totalLength = r.totalLength
  })

  test('顶部、中部、底部 — 与旧实现完全一致', () => {
    const positions = [0, totalLength * 0.25, totalLength * 0.5, totalLength * 0.75, totalLength - VIEWPORT]
    positions.forEach((scrollPos) => {
      const newResult = findVisibleRange(
        sizeList,
        totalLength,
        scrollPos,
        VIEWPORT,
        OVERSCAN,
        ITEM_COUNT,
      )
      const oldResult = findVisibleRangeOld(
        sizeList,
        totalLength,
        scrollPos,
        VIEWPORT,
        OVERSCAN,
        ITEM_COUNT,
      )
      expect(newResult).toEqual(oldResult)
    })
  })

  test('连续滚动 200 个位置 — 全部一致', () => {
    for (let i = 0; i < 200; i++) {
      const scrollPos = (totalLength * i) / 200
      const newResult = findVisibleRange(
        sizeList,
        totalLength,
        scrollPos,
        VIEWPORT,
        OVERSCAN,
        ITEM_COUNT,
      )
      const oldResult = findVisibleRangeOld(
        sizeList,
        totalLength,
        scrollPos,
        VIEWPORT,
        OVERSCAN,
        ITEM_COUNT,
      )
      expect(newResult).toEqual(oldResult)
    }
  })
})

// ─── 边界情况 ────────────────────────────────────────────
describe('findVisibleRange — edge cases', () => {
  test('itemCount = 0', () => {
    const result = findVisibleRange([], 0, 0, 800, 10, 0)
    expect(result).toEqual({ startIndex: -1, endIndex: -1 })
  })

  test('viewportLength = 0', () => {
    const { sizeList, totalLength } = buildSizeList(10, () => 36)
    const result = findVisibleRange(sizeList, totalLength, 0, 0, 10, 10)
    expect(result).toEqual({ startIndex: -1, endIndex: -1 })
  })

  test('itemCount = 1', () => {
    const { sizeList, totalLength } = buildSizeList(1, () => 36)
    const result = findVisibleRange(sizeList, totalLength, 0, 800, 10, 1)
    expect(result.startIndex).toBe(0)
    expect(result.endIndex).toBe(1)
  })

  test('viewport 大于所有内容', () => {
    const { sizeList, totalLength } = buildSizeList(5, () => 36)
    // viewport 800 > 5*36 = 180
    const result = findVisibleRange(sizeList, totalLength, 0, 800, 10, 5)
    expect(result.startIndex).toBe(0)
    expect(result.endIndex).toBe(5)
  })

  test('overscan = 0', () => {
    const { sizeList, totalLength } = buildSizeList(100, () => 36)
    const result = findVisibleRange(sizeList, totalLength, 360, 360, 0, 100)
    const old = findVisibleRangeOld(sizeList, totalLength, 360, 360, 0, 100)
    expect(result).toEqual(old)
    // 360/36 = 第 10 行开始, 可见 10 行
    expect(result.startIndex).toBe(10)
    expect(result.endIndex).toBe(20)
  })
})

// ─── 100k 大规模一致性 ──────────────────────────────────
describe('findVisibleRange — 100k items consistency', () => {
  test('100k items, 50 个随机滚动位置全部与旧实现一致', () => {
    const ITEM_COUNT = 100_000
    const { sizeList, totalLength } = buildSizeList(ITEM_COUNT, (i) => 30 + (i % 5) * 10)

    for (let i = 0; i < 50; i++) {
      const scrollPos = Math.random() * totalLength
      const newResult = findVisibleRange(sizeList, totalLength, scrollPos, 800, 10, ITEM_COUNT)
      const oldResult = findVisibleRangeOld(
        sizeList,
        totalLength,
        scrollPos,
        800,
        10,
        ITEM_COUNT,
      )
      expect(newResult).toEqual(oldResult)
    }
  })
})
