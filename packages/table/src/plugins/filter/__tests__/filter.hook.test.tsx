/**
 * Filter plugin hook integration test
 */
import { describe, test, expect, jest } from '@jest/globals'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { createStore, Provider as StoreProvider } from '@einfach/react'
import type { Store } from '@einfach/react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  rowIdShowListAtom,
  basicAtom,
} from '@grid-table/basic'
import { getColumnOptionAtomByColumnId, rowInfoMapAtom } from '../../../stateCore'
import { useFilter } from '../useFilter'
import type { FilterState, FilterValue } from '../types'

function setupStore() {
  const store = createStore()

  const rows = [
    { id: 'r1', name: '员工1', age: 30, dept: '技术部' },
    { id: 'r2', name: '员工2', age: 25, dept: '产品部' },
    { id: 'r3', name: '员工10', age: 35, dept: '技术部' },
    { id: 'r4', name: '员工4', age: 28, dept: '设计部' },
  ]

  store.setter(rowIndexListAtom, rows.map((r) => r.id))
  store.setter(columnIndexListAtom, ['name', 'age', 'dept'])

  const infoMap = new Map<string, Record<string, any>>()
  rows.forEach((r) => infoMap.set(r.id, r))
  store.setter(rowInfoMapAtom, infoMap)

  store.setter(getColumnOptionAtomByColumnId('name'), {
    dataIndex: 'name',
    key: 'name',
  })
  store.setter(getColumnOptionAtomByColumnId('age'), {
    dataIndex: 'age',
    key: 'age',
  })
  store.setter(getColumnOptionAtomByColumnId('dept'), {
    dataIndex: 'dept',
    key: 'dept',
  })

  store.getter(basicAtom)
  return store
}

function createWrapper(store: Store) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <StoreProvider store={store}>{children}</StoreProvider>
  }
}

describe('useFilter hook integration', () => {
  test('no filter → all rows visible', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    renderHook(() => useFilter(), { wrapper })

    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3', 'r4'])
  })

  test('setColumnFilter filters rows', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { result } = renderHook(() => useFilter(), { wrapper })

    act(() => {
      result.current.setColumnFilter('name', {
        type: 'text',
        operator: 'contains',
        value: '员工1',
      })
    })

    // "员工1" matches "员工1" and "员工10"
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r3'])
  })

  test('clearFilter restores all rows', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { result } = renderHook(() => useFilter(), { wrapper })

    act(() => {
      result.current.setColumnFilter('dept', {
        type: 'select',
        operator: 'include',
        value: ['技术部'],
      })
    })
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r3'])

    act(() => {
      result.current.clearFilter()
    })
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3', 'r4'])
  })

  test('controlled: onChange callback fires', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)
    const onFilterChange = jest.fn()

    const { result } = renderHook(
      () => useFilter({ filterState: new Map(), onFilterChange }),
      { wrapper },
    )

    act(() => {
      result.current.setColumnFilter('name', {
        type: 'text',
        operator: 'contains',
        value: '员工1',
      })
    })

    expect(onFilterChange).toHaveBeenCalled()
    const callArg = onFilterChange.mock.calls[0][0] as FilterState
    expect(callArg.has('name')).toBe(true)
  })

  test('controlled: external filterState syncs and filters', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const initialFilter = new Map<string, FilterValue>()

    const { rerender } = renderHook(
      (props: { filterState: FilterState }) =>
        useFilter({ filterState: props.filterState }),
      { wrapper, initialProps: { filterState: initialFilter } },
    )

    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3', 'r4'])

    // Simulate parent setting filter
    const newFilter = new Map<string, FilterValue>()
    newFilter.set('dept', { type: 'select', operator: 'include', value: ['技术部'] })
    rerender({ filterState: newFilter })

    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r3'])
  })

  test('cleanup removes interceptor on unmount', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { result, unmount } = renderHook(() => useFilter(), { wrapper })

    act(() => {
      result.current.setColumnFilter('dept', {
        type: 'select',
        operator: 'include',
        value: ['技术部'],
      })
    })
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r3'])

    unmount()

    // After unmount, interceptor removed → all rows visible
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3', 'r4'])
  })
})
