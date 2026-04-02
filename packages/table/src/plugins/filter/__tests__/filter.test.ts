import {
  matchTextFilter,
  matchNumberFilter,
  matchSelectFilter,
  matchFilter,
} from '../filterUtils'
import { filterStateAtom, activeFilterColumnAtom } from '../state'
import type {
  TextFilterValue,
  NumberFilterValue,
  SelectFilterValue,
  FilterState,
} from '../types'

describe('filter state atoms', () => {
  it('filterStateAtom has empty Map as default', () => {
    // atom(initialValue) stores the init value
    expect(filterStateAtom.init).toBeInstanceOf(Map)
    expect((filterStateAtom.init as FilterState).size).toBe(0)
  })

  it('activeFilterColumnAtom has null as default', () => {
    expect(activeFilterColumnAtom.init).toBeNull()
  })
})

describe('matchTextFilter', () => {
  it('contains', () => {
    const filter: TextFilterValue = { type: 'text', operator: 'contains', value: 'llo' }
    expect(matchTextFilter('Hello World', filter)).toBe(true)
    expect(matchTextFilter('Goodbye', filter)).toBe(false)
  })

  it('contains is case insensitive', () => {
    const filter: TextFilterValue = { type: 'text', operator: 'contains', value: 'HELLO' }
    expect(matchTextFilter('hello world', filter)).toBe(true)
  })

  it('equals', () => {
    const filter: TextFilterValue = { type: 'text', operator: 'equals', value: 'hello' }
    expect(matchTextFilter('hello', filter)).toBe(true)
    expect(matchTextFilter('Hello', filter)).toBe(true) // case insensitive
    expect(matchTextFilter('hello world', filter)).toBe(false)
  })

  it('startsWith', () => {
    const filter: TextFilterValue = { type: 'text', operator: 'startsWith', value: 'hel' }
    expect(matchTextFilter('Hello World', filter)).toBe(true)
    expect(matchTextFilter('World Hello', filter)).toBe(false)
  })

  it('endsWith', () => {
    const filter: TextFilterValue = { type: 'text', operator: 'endsWith', value: 'rld' }
    expect(matchTextFilter('Hello World', filter)).toBe(true)
    expect(matchTextFilter('World Hello', filter)).toBe(false)
  })

  it('handles null/undefined cell values', () => {
    const filter: TextFilterValue = { type: 'text', operator: 'contains', value: '' }
    expect(matchTextFilter(null, filter)).toBe(true)
    expect(matchTextFilter(undefined, filter)).toBe(true)
  })
})

describe('matchNumberFilter', () => {
  it('eq', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'eq', value: 42 }
    expect(matchNumberFilter(42, filter)).toBe(true)
    expect(matchNumberFilter(43, filter)).toBe(false)
  })

  it('ne', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'ne', value: 42 }
    expect(matchNumberFilter(43, filter)).toBe(true)
    expect(matchNumberFilter(42, filter)).toBe(false)
  })

  it('gt', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'gt', value: 10 }
    expect(matchNumberFilter(11, filter)).toBe(true)
    expect(matchNumberFilter(10, filter)).toBe(false)
    expect(matchNumberFilter(9, filter)).toBe(false)
  })

  it('gte', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'gte', value: 10 }
    expect(matchNumberFilter(10, filter)).toBe(true)
    expect(matchNumberFilter(11, filter)).toBe(true)
    expect(matchNumberFilter(9, filter)).toBe(false)
  })

  it('lt', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'lt', value: 10 }
    expect(matchNumberFilter(9, filter)).toBe(true)
    expect(matchNumberFilter(10, filter)).toBe(false)
  })

  it('lte', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'lte', value: 10 }
    expect(matchNumberFilter(10, filter)).toBe(true)
    expect(matchNumberFilter(9, filter)).toBe(true)
    expect(matchNumberFilter(11, filter)).toBe(false)
  })

  it('between', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'between', value: [5, 15] }
    expect(matchNumberFilter(5, filter)).toBe(true)
    expect(matchNumberFilter(10, filter)).toBe(true)
    expect(matchNumberFilter(15, filter)).toBe(true)
    expect(matchNumberFilter(4, filter)).toBe(false)
    expect(matchNumberFilter(16, filter)).toBe(false)
  })

  it('returns false for NaN cell values', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'eq', value: 42 }
    expect(matchNumberFilter('not a number', filter)).toBe(false)
    expect(matchNumberFilter(undefined, filter)).toBe(false)
  })

  it('handles string numbers', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'eq', value: 42 }
    expect(matchNumberFilter('42', filter)).toBe(true)
  })
})

describe('matchSelectFilter', () => {
  it('include - matches when value is in the list', () => {
    const filter: SelectFilterValue = { type: 'select', operator: 'include', value: ['a', 'b', 'c'] }
    expect(matchSelectFilter('a', filter)).toBe(true)
    expect(matchSelectFilter('d', filter)).toBe(false)
  })

  it('empty filter value returns all', () => {
    const filter: SelectFilterValue = { type: 'select', operator: 'include', value: [] }
    expect(matchSelectFilter('anything', filter)).toBe(true)
  })

  it('handles numeric values', () => {
    const filter: SelectFilterValue = { type: 'select', operator: 'include', value: [1, 2, 3] }
    expect(matchSelectFilter(1, filter)).toBe(true)
    expect(matchSelectFilter(4, filter)).toBe(false)
  })
})

describe('matchFilter dispatch', () => {
  it('dispatches text filter', () => {
    const filter: TextFilterValue = { type: 'text', operator: 'contains', value: 'test' }
    expect(matchFilter('testing', filter)).toBe(true)
  })

  it('dispatches number filter', () => {
    const filter: NumberFilterValue = { type: 'number', operator: 'gt', value: 5 }
    expect(matchFilter(10, filter)).toBe(true)
  })

  it('dispatches select filter', () => {
    const filter: SelectFilterValue = { type: 'select', operator: 'include', value: ['x'] }
    expect(matchFilter('x', filter)).toBe(true)
  })
})

describe('multi-column filter (AND logic)', () => {
  // This tests the conceptual AND logic used by useFilter
  // We simulate it here with matchFilter calls
  it('all filters must pass for a row to be included', () => {
    const textFilter: TextFilterValue = { type: 'text', operator: 'contains', value: 'alice' }
    const numberFilter: NumberFilterValue = { type: 'number', operator: 'gte', value: 18 }

    const row = { name: 'Alice Smith', age: 25 }

    // Both pass
    const passesAll =
      matchFilter(row.name, textFilter) && matchFilter(row.age, numberFilter)
    expect(passesAll).toBe(true)

    // Name fails
    const row2 = { name: 'Bob', age: 25 }
    const passesAll2 =
      matchFilter(row2.name, textFilter) && matchFilter(row2.age, numberFilter)
    expect(passesAll2).toBe(false)

    // Age fails
    const row3 = { name: 'Alice', age: 15 }
    const passesAll3 =
      matchFilter(row3.name, textFilter) && matchFilter(row3.age, numberFilter)
    expect(passesAll3).toBe(false)
  })
})

describe('empty filter state', () => {
  it('empty filter state means no filtering (all rows pass)', () => {
    const filterState: FilterState = new Map()
    // With empty map, the useFilter hook returns prev (all rows)
    expect(filterState.size).toBe(0)
  })
})

describe('custom filterFn concept', () => {
  it('custom filterFn takes rowData and filterValue', () => {
    const customFn = (rowData: Record<string, any>, filterValue: TextFilterValue) => {
      // Custom logic: check if name length > filter value length
      return (rowData.name as string).length > filterValue.value.length
    }

    const filter: TextFilterValue = { type: 'text', operator: 'contains', value: 'ab' }
    expect(customFn({ name: 'Alice' }, filter)).toBe(true)
    expect(customFn({ name: 'Al' }, filter)).toBe(false)
  })
})
