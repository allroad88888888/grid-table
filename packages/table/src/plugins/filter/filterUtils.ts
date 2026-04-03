import type { FilterValue, NumberFilterValue, SelectFilterValue, TextFilterValue } from './types'

/**
 * 文本过滤匹配
 */
export function matchTextFilter(cellValue: unknown, filter: TextFilterValue): boolean {
  const text = String(cellValue ?? '').toLowerCase()
  const filterText = filter.value.toLowerCase()

  switch (filter.operator) {
    case 'contains':
      return text.includes(filterText)
    case 'equals':
      return text === filterText
    case 'startsWith':
      return text.startsWith(filterText)
    case 'endsWith':
      return text.endsWith(filterText)
    default:
      return true
  }
}

/**
 * 数字过滤匹配
 */
export function matchNumberFilter(cellValue: unknown, filter: NumberFilterValue): boolean {
  const num = Number(cellValue)
  if (Number.isNaN(num)) return false

  const filterValue = filter.value

  switch (filter.operator) {
    case 'eq':
      return num === filterValue
    case 'ne':
      return num !== filterValue
    case 'gt':
      return num > (filterValue as number)
    case 'gte':
      return num >= (filterValue as number)
    case 'lt':
      return num < (filterValue as number)
    case 'lte':
      return num <= (filterValue as number)
    case 'between': {
      if (!Array.isArray(filterValue) || filterValue.length < 2) return false
      const [min, max] = filterValue
      if (min == null || max == null) return false
      const lo = Math.min(min, max)
      const hi = Math.max(min, max)
      return num >= lo && num <= hi
    }
    default:
      return true
  }
}

/**
 * 选择过滤匹配
 */
export function matchSelectFilter(cellValue: unknown, filter: SelectFilterValue): boolean {
  if (filter.value.length === 0) return true
  return filter.value.includes(cellValue)
}

/**
 * 根据 FilterValue 类型分发到对应匹配函数
 */
export function matchFilter(cellValue: unknown, filter: FilterValue): boolean {
  switch (filter.type) {
    case 'text':
      return matchTextFilter(cellValue, filter)
    case 'number':
      return matchNumberFilter(cellValue, filter)
    case 'select':
      return matchSelectFilter(cellValue, filter)
    default:
      return true
  }
}
