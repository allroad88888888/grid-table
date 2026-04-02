import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/react'
import {
  expandedRowKeysAtom,
  getExpandRowId,
  isExpandRowId,
  getParentRowId,
  EXPAND_ROW_PREFIX,
} from '../state'
import type { RowId } from '@grid-table/basic'

describe('expandedRowKeysAtom', () => {
  test('initial state is empty set', () => {
    const store = createStore()
    const keys = store.getter(expandedRowKeysAtom)
    expect(keys.size).toBe(0)
  })

  test('set and get expanded keys', () => {
    const store = createStore()
    const keys = new Set<RowId>(['r1', 'r3'])
    store.setter(expandedRowKeysAtom, keys)
    expect(store.getter(expandedRowKeysAtom)).toEqual(keys)
    expect(store.getter(expandedRowKeysAtom).has('r1')).toBe(true)
    expect(store.getter(expandedRowKeysAtom).has('r2')).toBe(false)
    expect(store.getter(expandedRowKeysAtom).has('r3')).toBe(true)
  })

  test('clear expanded keys', () => {
    const store = createStore()
    store.setter(expandedRowKeysAtom, new Set<RowId>(['r1', 'r2']))
    store.setter(expandedRowKeysAtom, new Set<RowId>())
    expect(store.getter(expandedRowKeysAtom).size).toBe(0)
  })
})

describe('getExpandRowId', () => {
  test('prefixes row id with expand prefix', () => {
    expect(getExpandRowId('r1')).toBe(`${EXPAND_ROW_PREFIX}r1`)
  })

  test('works with various row id formats', () => {
    expect(getExpandRowId('row-123')).toBe(`${EXPAND_ROW_PREFIX}row-123`)
    expect(getExpandRowId('0')).toBe(`${EXPAND_ROW_PREFIX}0`)
  })
})

describe('isExpandRowId', () => {
  test('returns true for expand row ids', () => {
    expect(isExpandRowId(`${EXPAND_ROW_PREFIX}r1`)).toBe(true)
    expect(isExpandRowId(getExpandRowId('r2'))).toBe(true)
  })

  test('returns false for normal row ids', () => {
    expect(isExpandRowId('r1')).toBe(false)
    expect(isExpandRowId('row-123')).toBe(false)
    expect(isExpandRowId('')).toBe(false)
  })
})

describe('getParentRowId', () => {
  test('extracts parent row id from expand row id', () => {
    expect(getParentRowId(getExpandRowId('r1'))).toBe('r1')
    expect(getParentRowId(`${EXPAND_ROW_PREFIX}row-123`)).toBe('row-123')
  })
})

describe('row list with expanded rows', () => {
  test('inserts expand row ids after expanded rows', () => {
    const rowIds: RowId[] = ['r1', 'r2', 'r3', 'r4']
    const expandedKeys = new Set<RowId>(['r1', 'r3'])

    const result: RowId[] = []
    for (const rowId of rowIds) {
      result.push(rowId)
      if (expandedKeys.has(rowId)) {
        result.push(getExpandRowId(rowId))
      }
    }

    expect(result).toEqual([
      'r1',
      getExpandRowId('r1'),
      'r2',
      'r3',
      getExpandRowId('r3'),
      'r4',
    ])
  })

  test('no expansion when expanded keys are empty', () => {
    const rowIds: RowId[] = ['r1', 'r2', 'r3']
    const expandedKeys = new Set<RowId>()

    const result: RowId[] = []
    for (const rowId of rowIds) {
      result.push(rowId)
      if (expandedKeys.has(rowId)) {
        result.push(getExpandRowId(rowId))
      }
    }

    expect(result).toEqual(['r1', 'r2', 'r3'])
  })

  test('all rows expanded', () => {
    const rowIds: RowId[] = ['r1', 'r2']
    const expandedKeys = new Set<RowId>(['r1', 'r2'])

    const result: RowId[] = []
    for (const rowId of rowIds) {
      result.push(rowId)
      if (expandedKeys.has(rowId)) {
        result.push(getExpandRowId(rowId))
      }
    }

    expect(result).toEqual([
      'r1',
      getExpandRowId('r1'),
      'r2',
      getExpandRowId('r2'),
    ])
  })
})

describe('accordion mode', () => {
  test('only one expanded at a time', () => {
    const store = createStore()

    // Expand r1
    store.setter(expandedRowKeysAtom, new Set<RowId>(['r1']))
    expect(store.getter(expandedRowKeysAtom).has('r1')).toBe(true)

    // Accordion: expand r2, should replace r1
    store.setter(expandedRowKeysAtom, new Set<RowId>(['r2']))
    expect(store.getter(expandedRowKeysAtom).has('r1')).toBe(false)
    expect(store.getter(expandedRowKeysAtom).has('r2')).toBe(true)
    expect(store.getter(expandedRowKeysAtom).size).toBe(1)
  })
})

describe('toggle expand/collapse', () => {
  test('toggle adds key when not present', () => {
    const store = createStore()
    const currentKeys = store.getter(expandedRowKeysAtom)
    expect(currentKeys.has('r1')).toBe(false)

    const nextKeys = new Set(currentKeys)
    nextKeys.add('r1')
    store.setter(expandedRowKeysAtom, nextKeys)
    expect(store.getter(expandedRowKeysAtom).has('r1')).toBe(true)
  })

  test('toggle removes key when present', () => {
    const store = createStore()
    store.setter(expandedRowKeysAtom, new Set<RowId>(['r1', 'r2']))

    const currentKeys = store.getter(expandedRowKeysAtom)
    const nextKeys = new Set(currentKeys)
    nextKeys.delete('r1')
    store.setter(expandedRowKeysAtom, nextKeys)

    expect(store.getter(expandedRowKeysAtom).has('r1')).toBe(false)
    expect(store.getter(expandedRowKeysAtom).has('r2')).toBe(true)
  })
})

describe('empty state', () => {
  test('empty row list produces empty result', () => {
    const rowIds: RowId[] = []
    const expandedKeys = new Set<RowId>(['r1'])

    const result: RowId[] = []
    for (const rowId of rowIds) {
      result.push(rowId)
      if (expandedKeys.has(rowId)) {
        result.push(getExpandRowId(rowId))
      }
    }

    expect(result).toEqual([])
  })

  test('expanded key not in row list has no effect', () => {
    const rowIds: RowId[] = ['r1', 'r2']
    const expandedKeys = new Set<RowId>(['r99'])

    const result: RowId[] = []
    for (const rowId of rowIds) {
      result.push(rowId)
      if (expandedKeys.has(rowId)) {
        result.push(getExpandRowId(rowId))
      }
    }

    expect(result).toEqual(['r1', 'r2'])
  })
})
