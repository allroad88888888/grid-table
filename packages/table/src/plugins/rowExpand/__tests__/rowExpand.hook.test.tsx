/**
 * RowExpand plugin hook integration test
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
import { rowInfoMapAtom } from '../../../stateCore'
import { getExpandRowId } from '../state'
import { useRowExpand } from '../useRowExpand'

function setupStore() {
  const store = createStore()

  const rows = [
    { id: 'r1', name: 'Alice' },
    { id: 'r2', name: 'Bob' },
    { id: 'r3', name: 'Charlie' },
  ]

  store.setter(rowIndexListAtom, rows.map((r) => r.id))
  store.setter(columnIndexListAtom, ['name'])

  const infoMap = new Map<string, Record<string, any>>()
  rows.forEach((r) => infoMap.set(r.id, r))
  store.setter(rowInfoMapAtom, infoMap)

  store.getter(basicAtom)
  return store
}

function createWrapper(store: Store) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <StoreProvider store={store}>{children}</StoreProvider>
  }
}

describe('useRowExpand hook integration', () => {
  test('no expansion initially', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    renderHook(() => useRowExpand(), { wrapper })

    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3'])
  })

  test('toggleExpand inserts expand row after target', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { result } = renderHook(() => useRowExpand(), { wrapper })

    act(() => {
      result.current.toggleExpand('r2')
    })

    const list = store.getter(rowIdShowListAtom)
    expect(list).toEqual(['r1', 'r2', getExpandRowId('r2'), 'r3'])
  })

  test('toggleExpand again collapses', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { result } = renderHook(() => useRowExpand(), { wrapper })

    // Expand
    act(() => { result.current.toggleExpand('r1') })
    expect(store.getter(rowIdShowListAtom)).toContain(getExpandRowId('r1'))

    // Collapse
    act(() => { result.current.toggleExpand('r1') })
    expect(store.getter(rowIdShowListAtom)).not.toContain(getExpandRowId('r1'))
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3'])
  })

  test('accordion mode: only one expanded at a time', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { result } = renderHook(() => useRowExpand({ accordion: true }), { wrapper })

    act(() => { result.current.toggleExpand('r1') })
    expect(store.getter(rowIdShowListAtom)).toContain(getExpandRowId('r1'))

    act(() => { result.current.toggleExpand('r2') })
    const list = store.getter(rowIdShowListAtom)
    expect(list).not.toContain(getExpandRowId('r1'))
    expect(list).toContain(getExpandRowId('r2'))
  })

  test('onExpand callback fires', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)
    const onExpand = jest.fn()

    const { result } = renderHook(
      () => useRowExpand({ onExpand }),
      { wrapper },
    )

    act(() => { result.current.toggleExpand('r1') })

    expect(onExpand).toHaveBeenCalledWith(true, 'r1', { id: 'r1', name: 'Alice' })
  })

  test('onExpandedRowsChange callback fires', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)
    const onExpandedRowsChange = jest.fn()

    const { result } = renderHook(
      () => useRowExpand({ onExpandedRowsChange }),
      { wrapper },
    )

    act(() => { result.current.toggleExpand('r1') })

    expect(onExpandedRowsChange).toHaveBeenCalledWith(['r1'])
  })

  test('controlled: external expandedRowKeys syncs', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { rerender } = renderHook(
      (props: { keys: string[] }) =>
        useRowExpand({ expandedRowKeys: props.keys }),
      { wrapper, initialProps: { keys: [] as string[] } },
    )

    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3'])

    rerender({ keys: ['r2'] })

    const list = store.getter(rowIdShowListAtom)
    expect(list).toEqual(['r1', 'r2', getExpandRowId('r2'), 'r3'])
  })

  test('cleanup removes interceptor', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    const { result, unmount } = renderHook(() => useRowExpand(), { wrapper })

    act(() => { result.current.toggleExpand('r1') })
    expect(store.getter(rowIdShowListAtom)).toContain(getExpandRowId('r1'))

    unmount()

    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3'])
  })

  test('defaultExpandedRowKeys sets initial state', () => {
    const store = setupStore()
    const wrapper = createWrapper(store)

    renderHook(
      () => useRowExpand({ defaultExpandedRowKeys: ['r1', 'r3'] }),
      { wrapper },
    )

    const list = store.getter(rowIdShowListAtom)
    expect(list).toContain(getExpandRowId('r1'))
    expect(list).toContain(getExpandRowId('r3'))
  })
})
