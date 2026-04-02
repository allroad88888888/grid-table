import { describe, test, expect } from '@jest/globals'
import { computeAggregation } from '../aggregations'

describe('computeAggregation', () => {
  const values = [10, 20, 30, 40, 50]

  test('sum', () => {
    expect(computeAggregation('sum', values)).toBe(150)
  })

  test('avg', () => {
    expect(computeAggregation('avg', values)).toBe(30)
  })

  test('count', () => {
    expect(computeAggregation('count', values)).toBe(5)
  })

  test('count excludes null/empty', () => {
    expect(computeAggregation('count', [1, null, '', undefined, 3])).toBe(2)
  })

  test('min', () => {
    expect(computeAggregation('min', values)).toBe(10)
  })

  test('max', () => {
    expect(computeAggregation('max', values)).toBe(50)
  })

  test('handles string numbers', () => {
    expect(computeAggregation('sum', ['10', '20', '30'])).toBe(60)
  })

  test('ignores non-numeric values', () => {
    expect(computeAggregation('sum', [10, 'abc', 20, null])).toBe(30)
  })

  test('empty array', () => {
    expect(computeAggregation('sum', [])).toBe(0)
    expect(computeAggregation('avg', [])).toBe(0)
    expect(computeAggregation('count', [])).toBe(0)
    expect(computeAggregation('min', [])).toBe(0)
    expect(computeAggregation('max', [])).toBe(0)
  })
})
