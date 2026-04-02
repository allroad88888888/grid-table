/**
 * 在单调递增数组中查找第一个 >= target 的元素索引
 * sizeList 是累积尺寸数组，天然有序，适合二分查找
 * 复杂度 O(log n)，替代 findIndex 的 O(n)
 */
export function binarySearchGte(arr: number[], target: number): number {
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
