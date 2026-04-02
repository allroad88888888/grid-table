import { describe, test, expect } from '@jest/globals'
import { binarySearchGte } from '../utils/binarySearch'

describe('binarySearchGte', () => {
  test('空数组返回 0 (arr.length)', () => {
    expect(binarySearchGte([], 5)).toBe(0)
  })

  test('单元素 — 命中', () => {
    expect(binarySearchGte([10], 10)).toBe(0)
    expect(binarySearchGte([10], 5)).toBe(0)
  })

  test('单元素 — 未命中（target 大于所有元素）', () => {
    expect(binarySearchGte([10], 20)).toBe(1)
  })

  test('精确匹配返回第一个匹配位置', () => {
    const arr = [0, 10, 20, 30, 40, 50]
    expect(binarySearchGte(arr, 20)).toBe(2)
    expect(binarySearchGte(arr, 0)).toBe(0)
    expect(binarySearchGte(arr, 50)).toBe(5)
  })

  test('target 在两个元素之间 — 返回较大的那个索引', () => {
    const arr = [0, 10, 20, 30, 40, 50]
    expect(binarySearchGte(arr, 15)).toBe(2) // 20 >= 15
    expect(binarySearchGte(arr, 1)).toBe(1)  // 10 >= 1
    expect(binarySearchGte(arr, 45)).toBe(5) // 50 >= 45
  })

  test('target 小于所有元素 — 返回 0', () => {
    const arr = [10, 20, 30]
    expect(binarySearchGte(arr, -5)).toBe(0)
    expect(binarySearchGte(arr, 0)).toBe(0)
  })

  test('target 大于所有元素 — 返回 arr.length', () => {
    const arr = [10, 20, 30]
    expect(binarySearchGte(arr, 31)).toBe(3)
    expect(binarySearchGte(arr, 100)).toBe(3)
  })

  test('重复元素 — 返回第一个 >= target 的索引', () => {
    const arr = [0, 10, 10, 10, 20, 30]
    expect(binarySearchGte(arr, 10)).toBe(1) // 第一个 10
    expect(binarySearchGte(arr, 11)).toBe(4) // 20
  })

  test('与 findIndex 行为一致 — 累积尺寸数组场景', () => {
    // 模拟 sizeList: 每行 36px, 100 行
    const sizeList = [0]
    for (let i = 0; i < 100; i++) {
      sizeList.push(sizeList[sizeList.length - 1] + 36)
    }

    // 对各种 scrollPos 验证和 findIndex 结果一致
    const testPositions = [0, 1, 36, 37, 100, 500, 1800, 3599, 3600]
    testPositions.forEach((scrollPos) => {
      const expected = sizeList.findIndex((v) => v >= scrollPos)
      const actual = binarySearchGte(sizeList, scrollPos)
      expect(actual).toBe(expected)
    })
  })

  test('大数组正确性 — 10k 元素随机位置', () => {
    const arr: number[] = [0]
    for (let i = 1; i <= 10000; i++) {
      arr.push(arr[i - 1] + Math.floor(Math.random() * 50) + 10)
    }

    // 随机测 50 个位置
    for (let i = 0; i < 50; i++) {
      const target = Math.floor(Math.random() * arr[arr.length - 1])
      const expected = arr.findIndex((v) => v >= target)
      const actual = binarySearchGte(arr, target)
      expect(actual).toBe(expected)
    }
  })
})
