import type { BuiltinAggregation } from './types'

/**
 * 内置聚合函数
 */
export function computeAggregation(
  type: BuiltinAggregation,
  values: unknown[],
): number | string {
  const nums = values
    .map((v) => Number(v))
    .filter((n) => !Number.isNaN(n))

  switch (type) {
    case 'sum':
      return nums.reduce((acc, n) => acc + n, 0)
    case 'avg':
      return nums.length > 0 ? nums.reduce((acc, n) => acc + n, 0) / nums.length : 0
    case 'count':
      return values.filter((v) => v != null && v !== '').length
    case 'min':
      return nums.length > 0 ? Math.min(...nums) : 0
    case 'max':
      return nums.length > 0 ? Math.max(...nums) : 0
    default:
      return ''
  }
}
