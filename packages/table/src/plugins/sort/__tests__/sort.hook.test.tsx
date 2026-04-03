/**
 * Sort plugin hook integration test
 * Uses renderHook to test useSort in a real React + Store environment
 */
import { describe, test, expect } from '@jest/globals'
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
import { sortStateAtom, sortToggleAtom } from '../state'
import { useSort } from '../useSort'
import type { SortState } from '../types'

function setupStore() {
  const store = createStore()

  const rows = [
    { id: 'r1', name: 'Charlie', age: 30 },
    { id: 'r2', name: 'Alice', age: 25 },
    { id: 'r3', name: 'Bob', age: 35 },
  ]

  store.setter(rowIndexListAtom, rows.map((r) => r.id))
  store.setter(columnIndexListAtom, ['name', 'age'])

  const infoMap = new Map<string, Record<string, any>>()
  rows.forEach((r) => infoMap.set(r.id, r))
  store.setter(rowInfoMapAtom, infoMap)

  store.setter(getColumnOptionAtomByColumnId('name'), {
    dataIndex: 'name',
    sorter: true,
    key: 'name',
  })
  store.setter(getColumnOptionAtomByColumnId('age'), {
    dataIndex: 'age',
    sorter: true,
    key: 'age',
  })

  store.getter(basicAtom)
  return store
}

function createWrapper(store: Store) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <StoreProvider store={store}>{children}</StoreProvider>
  }
}

describe('useSort hook integration', () => {
  test('registers interceptor on mount', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    renderHook(() => useSort(), { wrapper })

    // Initially no sort → original order
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3'])
  })

  test('uncontrolled: toggleSort changes sort state and reorders', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { result } = renderHook(() => useSort(), { wrapper })

    act(() => {
      result.current.toggleSort('name', false)
    })

    // After toggle: name asc → Alice, Bob, Charlie
    expect(store.getter(sortStateAtom)).toEqual([{ columnId: 'name', direction: 'asc' }])
    expect(store.getter(rowIdShowListAtom)).toEqual(['r2', 'r3', 'r1'])
  })

  test('uncontrolled: toggle cycle asc → desc → null', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { result } = renderHook(() => useSort(), { wrapper })

    // First toggle: asc
    act(() => { result.current.toggleSort('name', false) })
    expect(store.getter(sortStateAtom)[0]?.direction).toBe('asc')

    // Second toggle: desc
    act(() => { result.current.toggleSort('name', false) })
    expect(store.getter(sortStateAtom)[0]?.direction).toBe('desc')

    // Third toggle: clear
    act(() => { result.current.toggleSort('name', false) })
    expect(store.getter(sortStateAtom)).toEqual([])
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3'])
  })

  test('controlled: onChange callback fires', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)
    const onSortChange = jest.fn()

    const { result } = renderHook(
      () => useSort({ sortState: [], onSortChange }),
      { wrapper },
    )

    act(() => { result.current.toggleSort('name', false) })

    expect(onSortChange).toHaveBeenCalledWith(
      [{ columnId: 'name', direction: 'asc' }],
      [],
    )
  })

  test('controlled: external sortState syncs to atom and reorders', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { rerender } = renderHook(
      (props: { sortState: SortState }) => useSort({ sortState: props.sortState }),
      { wrapper, initialProps: { sortState: [] as SortState } },
    )

    // Simulate parent setting sort state
    rerender({ sortState: [{ columnId: 'name', direction: 'asc' }] })

    // After rerender, useEffect syncs to atom
    expect(store.getter(sortStateAtom)).toEqual([{ columnId: 'name', direction: 'asc' }])
    expect(store.getter(rowIdShowListAtom)).toEqual(['r2', 'r3', 'r1'])
  })

  test('sortToggleAtom is set on mount and cleared on unmount', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    expect(store.getter(sortToggleAtom)).toBeNull()

    const { unmount } = renderHook(() => useSort(), { wrapper })

    expect(store.getter(sortToggleAtom)).not.toBeNull()
    expect(typeof store.getter(sortToggleAtom)).toBe('function')

    unmount()

    expect(store.getter(sortToggleAtom)).toBeNull()
  })

  test('sortToggleAtom function sorts correctly when called', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    renderHook(() => useSort(), { wrapper })

    // Simulate what CellThead does
    const toggle = store.getter(sortToggleAtom)
    expect(toggle).not.toBeNull()

    act(() => {
      toggle!('age', false)
    })

    // age asc: 25(r2), 30(r1), 35(r3)
    expect(store.getter(rowIdShowListAtom)).toEqual(['r2', 'r1', 'r3'])
  })

  test('cleanup removes interceptor on unmount', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { unmount } = renderHook(() => useSort(), { wrapper })

    // Apply sort
    act(() => {
      store.setter(sortStateAtom, [{ columnId: 'name', direction: 'asc' }])
    })
    expect(store.getter(rowIdShowListAtom)).toEqual(['r2', 'r3', 'r1'])

    // Unmount → interceptor cleanup
    unmount()

    // After unmount, the interceptor should be removed → original order restored
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3'])
  })
})
