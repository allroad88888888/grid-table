import { describe, test, expect } from '@jest/globals'

// ─── 复现 useVDelayScroll.ts / useVScroll.ts 共享的核心计算逻辑 ──
// 当前主要使用 useDelayScroll (useDelayScroll.ts:50-62)

/** 构建累积尺寸数组，与 useDelayScroll.ts:27-39 一致 */
function buildSizeList(itemCount: number, calcItemSize: (i: number) => number) {
  const sizeList = [0]
  let total = 0
  for (let i = 0; i < itemCount; i++) {
    total += calcItemSize(i)
    sizeList.push(total)
  }
  return { sizeList, totalLength: total }
}

/**
 * 当前实现：线性 findIndex + slice (useDelayScroll.ts:50-62, useVScroll.ts:47-58)
 */
function findVisibleRangeLinear(
  sizeList: number[],
  scrollPos: number,
  viewportLength: number,
  totalLength: number,
) {
  const visibleStartIndex = sizeList.findIndex((v) => v >= scrollPos)

  let visibleEndIndex: number
  if (scrollPos + viewportLength >= totalLength) {
    visibleEndIndex = sizeList.length
  } else {
    visibleEndIndex =
      sizeList.slice(visibleStartIndex).findIndex((v) => v >= scrollPos + viewportLength) +
      visibleStartIndex
  }
  return { visibleStartIndex, visibleEndIndex }
}

/**
 * 优化方案：二分查找（sizeList 单调递增）
 */
function binarySearchGte(arr: number[], target: number): number {
  let lo = 0
  let hi = arr.length - 1
  let result = arr.length
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1
    if (arr[mid] >= target) {
      result = mid
      hi = mid - 1
    } else {
      lo = mid + 1
    }
  }
  return result
}

function findVisibleRangeBinary(
  sizeList: number[],
  scrollPos: number,
  viewportLength: number,
  totalLength: number,
) {
  const visibleStartIndex = binarySearchGte(sizeList, scrollPos)

  let visibleEndIndex: number
  if (scrollPos + viewportLength >= totalLength) {
    visibleEndIndex = sizeList.length
  } else {
    visibleEndIndex = binarySearchGte(sizeList, scrollPos + viewportLength)
  }
  return { visibleStartIndex, visibleEndIndex }
}

function measure(label: string, fn: () => void): number {
  const start = performance.now()
  fn()
  const elapsed = performance.now() - start
  console.log(`  ${label}: ${elapsed.toFixed(2)}ms`)
  return elapsed
}

// ─── Tests ──────────────────────────────────────────────

describe('sizeList construction', () => {
  test.each([10_000, 100_000])('%i items — fixed row height', (count) => {
    const elapsed = measure(`build sizeList (${count})`, () => {
      const { sizeList, totalLength } = buildSizeList(count, () => 36)
      expect(sizeList.length).toBe(count + 1)
      expect(totalLength).toBe(count * 36)
    })
    expect(elapsed).toBeLessThan(count === 100_000 ? 100 : 20)
  })

  test.each([10_000, 100_000])('%i items — variable row height', (count) => {
    const heights = Array.from({ length: count }, (_, i) => 30 + (i % 5) * 10)
    const elapsed = measure(`build sizeList variable (${count})`, () => {
      buildSizeList(count, (i) => heights[i])
    })
    expect(elapsed).toBeLessThan(count === 100_000 ? 100 : 20)
  })
})

describe('findIndex linear vs binary search', () => {
  const ITEM_COUNT = 100_000
  const ROW_HEIGHT = 36
  const VIEWPORT = 800

  let sizeList: number[]
  let totalLength: number

  beforeAll(() => {
    const result = buildSizeList(ITEM_COUNT, () => ROW_HEIGHT)
    sizeList = result.sizeList
    totalLength = result.totalLength
  })

  test('correctness: binary search matches linear search', () => {
    const positions = [0, 1000, totalLength / 2, totalLength - VIEWPORT, totalLength - 1]
    positions.forEach((scrollPos) => {
      const linear = findVisibleRangeLinear(sizeList, scrollPos, VIEWPORT, totalLength)
      const binary = findVisibleRangeBinary(sizeList, scrollPos, VIEWPORT, totalLength)
      expect(binary).toEqual(linear)
    })
  })

  test.each(['beginning', 'middle', 'end'] as const)(
    'single call at %s — linear vs binary',
    (position) => {
    const scrollPos =
      position === 'beginning'
        ? 0
        : position === 'middle'
          ? totalLength / 2
          : totalLength - VIEWPORT

    const linearTime = measure(`linear findIndex (${position})`, () => {
      for (let i = 0; i < 100; i++) {
        findVisibleRangeLinear(sizeList, scrollPos, VIEWPORT, totalLength)
      }
    })

    const binaryTime = measure(`binary search   (${position})`, () => {
      for (let i = 0; i < 100; i++) {
        findVisibleRangeBinary(sizeList, scrollPos, VIEWPORT, totalLength)
      }
    })

    const speedup = linearTime / Math.max(binaryTime, 0.01)
    console.log(`  speedup: ${speedup.toFixed(1)}x`)
  },
  )

  test('slice() allocation overhead at 100k items', () => {
    const scrollPos = totalLength / 2
    const startIndex = binarySearchGte(sizeList, scrollPos)

    // 方案 A: slice + findIndex (当前实现)
    const sliceTime = measure('slice + findIndex × 100', () => {
      for (let i = 0; i < 100; i++) {
        sizeList.slice(startIndex).findIndex((v) => v >= scrollPos + VIEWPORT)
      }
    })

    // 方案 B: 直接从 startIndex 开始 findIndex（无拷贝）
    const noSliceTime = measure('direct findIndex × 100', () => {
      for (let i = 0; i < 100; i++) {
        for (let j = startIndex; j < sizeList.length; j++) {
          if (sizeList[j] >= scrollPos + VIEWPORT) break
        }
      }
    })

    // 方案 C: 二分查找（无拷贝）
    const binaryTime = measure('binary search    × 100', () => {
      for (let i = 0; i < 100; i++) {
        binarySearchGte(sizeList, scrollPos + VIEWPORT)
      }
    })

    console.log(
      `  slice overhead vs no-slice: ${((sliceTime - noSliceTime) / Math.max(sliceTime, 0.01) * 100).toFixed(0)}%`,
    )
    console.log(
      `  slice overhead vs binary:   ${((sliceTime - binaryTime) / Math.max(sliceTime, 0.01) * 100).toFixed(0)}%`,
    )
  })

  test('连续滚动模拟: 1000 次 scroll at 100k items', () => {
    // 模拟从顶部滚到底部的连续滚动
    const scrollPositions = Array.from({ length: 1000 }, (_, i) => (totalLength * i) / 1000)

    const linearTime = measure('linear × 1000 scrolls', () => {
      scrollPositions.forEach((pos) => {
        findVisibleRangeLinear(sizeList, pos, VIEWPORT, totalLength)
      })
    })

    const binaryTime = measure('binary × 1000 scrolls', () => {
      scrollPositions.forEach((pos) => {
        findVisibleRangeBinary(sizeList, pos, VIEWPORT, totalLength)
      })
    })

    const speedup = linearTime / Math.max(binaryTime, 0.01)
    console.log(`  speedup: ${speedup.toFixed(1)}x`)
    // 二分查找应该快很多
    expect(binaryTime).toBeLessThan(linearTime)
  })
})

describe('variable row height — worst case for linear', () => {
  test('100k items, variable height, scroll to middle', () => {
    const heights = Array.from({ length: 100_000 }, (_, i) => 20 + (i % 10) * 8)
    const { sizeList, totalLength } = buildSizeList(100_000, (i) => heights[i])
    const scrollPos = totalLength / 2
    const VIEWPORT = 800

    const linearTime = measure('linear (variable, middle)', () => {
      for (let i = 0; i < 100; i++) {
        findVisibleRangeLinear(sizeList, scrollPos, VIEWPORT, totalLength)
      }
    })

    const binaryTime = measure('binary (variable, middle)', () => {
      for (let i = 0; i < 100; i++) {
        findVisibleRangeBinary(sizeList, scrollPos, VIEWPORT, totalLength)
      }
    })

    const speedup = linearTime / Math.max(binaryTime, 0.01)
    console.log(`  speedup: ${speedup.toFixed(1)}x`)
    expect(binaryTime).toBeLessThan(linearTime)
  })
})
