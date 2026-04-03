/**
 * Sort plugin integration test
 * Tests that useSort's interceptor on rowIdShowListAtom actually reorders rows
 * when sortStateAtom changes - simulating the real runtime behavior.
 */
import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  rowIdShowListAtom,
  basicAtom,
} from '@grid-table/basic'
import { getColumnOptionAtomByColumnId, rowInfoMapAtom } from '../../../stateCore'
import { sortStateAtom } from '../state'
import { easyGet } from '@einfach/utils'

/**
 * 模拟 useSort 内部的 interceptor 注册逻辑
 * 这是 useSort.ts 第 51-98 行的核心代码
 */
function registerSortInterceptor(store: ReturnType<typeof createStore>) {
  return store.setter(rowIdShowListAtom, (getter, prev) => {
    const sortState = getter(sortStateAtom)
    if (sortState.length === 0) return prev

    const sortableFields = sortState.filter((f) => {
      const opt = getter(getColumnOptionAtomByColumnId(f.columnId))
      return !!opt?.sorter
    })
    if (sortableFields.length === 0) return prev

    const sorted = [...prev]

    sorted.sort((rowIdA, rowIdB) => {
      for (const field of sortState) {
        const columnOption = getter(getColumnOptionAtomByColumnId(field.columnId))
        if (!columnOption?.sorter) continue

        const { dataIndex } = columnOption
        let cmp: number

        if (typeof columnOption.sorter === 'function') {
          const rowInfoA = getter(rowInfoMapAtom).get(rowIdA)
          const rowInfoB = getter(rowInfoMapAtom).get(rowIdB)
          if (!rowInfoA || !rowInfoB) continue
          cmp = (columnOption.sorter as (a: unknown, b: unknown) => number)(rowInfoA, rowInfoB)
        } else {
          const valA = dataIndex
            ? easyGet(getter(rowInfoMapAtom).get(rowIdA), dataIndex)
            : undefined
          const valB = dataIndex
            ? easyGet(getter(rowInfoMapAtom).get(rowIdB), dataIndex)
            : undefined
          cmp = defaultCompare(valA, valB)
        }

        if (cmp !== 0) {
          return field.direction === 'asc' ? cmp : -cmp
        }
      }
      return 0
    })

    return sorted
  })
}

function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1

  const numA = Number(a)
  const numB = Number(b)
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
    return numA - numB
  }

  return String(a).localeCompare(String(b))
}

function setupStore() {
  const store = createStore()

  const rows = [
    { id: 'r1', name: 'Charlie', age: 30, score: 85 },
    { id: 'r2', name: 'Alice', age: 25, score: 92 },
    { id: 'r3', name: 'Bob', age: 35, score: 78 },
    { id: 'r4', name: 'David', age: 28, score: 92 },
  ]

  const rowIds = rows.map((r) => r.id)
  store.setter(rowIndexListAtom, rowIds)
  store.setter(columnIndexListAtom, ['name', 'age', 'score'])

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
  store.setter(getColumnOptionAtomByColumnId('score'), {
    dataIndex: 'score',
    sorter: true,
    key: 'score',
  })

  // 触发 basicAtom 初始化
  store.getter(basicAtom)

  return store
}

describe('Sort integration: interceptor on rowIdShowListAtom', () => {
  test('rowIdShowListAtom returns original order when no sort', () => {
    const store = setupStore()
    registerSortInterceptor(store)

    const result = store.getter(rowIdShowListAtom)
    expect(result).toEqual(['r1', 'r2', 'r3', 'r4'])
  })

  test('rowIdShowListAtom sorts ascending when sortStateAtom is set', () => {
    const store = setupStore()
    registerSortInterceptor(store)

    // 设置排序 → name asc
    store.setter(sortStateAtom, [{ columnId: 'name', direction: 'asc' }])

    const result = store.getter(rowIdShowListAtom)
    // Alice, Bob, Charlie, David
    expect(result).toEqual(['r2', 'r3', 'r1', 'r4'])
  })

  test('rowIdShowListAtom sorts descending', () => {
    const store = setupStore()
    registerSortInterceptor(store)

    store.setter(sortStateAtom, [{ columnId: 'age', direction: 'desc' }])

    const result = store.getter(rowIdShowListAtom)
    // age desc: 35(r3), 30(r1), 28(r4), 25(r2)
    expect(result).toEqual(['r3', 'r1', 'r4', 'r2'])
  })

  test('clearing sort restores original order', () => {
    const store = setupStore()
    registerSortInterceptor(store)

    store.setter(sortStateAtom, [{ columnId: 'name', direction: 'asc' }])
    expect(store.getter(rowIdShowListAtom)).toEqual(['r2', 'r3', 'r1', 'r4'])

    // Clear sort
    store.setter(sortStateAtom, [])
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3', 'r4'])
  })

  test('multi-column sort works correctly', () => {
    const store = setupStore()
    registerSortInterceptor(store)

    // Primary: score desc, Secondary: name asc
    store.setter(sortStateAtom, [
      { columnId: 'score', direction: 'desc' },
      { columnId: 'name', direction: 'asc' },
    ])

    const result = store.getter(rowIdShowListAtom)
    // score=92: Alice(r2), David(r4); score=85: Charlie(r1); score=78: Bob(r3)
    expect(result).toEqual(['r2', 'r4', 'r1', 'r3'])
  })

  test('sort updates when data changes', () => {
    const store = setupStore()
    registerSortInterceptor(store)

    store.setter(sortStateAtom, [{ columnId: 'name', direction: 'asc' }])
    expect(store.getter(rowIdShowListAtom)).toEqual(['r2', 'r3', 'r1', 'r4'])

    // 添加新数据
    const newRows = [
      { id: 'r1', name: 'Charlie', age: 30, score: 85 },
      { id: 'r2', name: 'Alice', age: 25, score: 92 },
      { id: 'r5', name: 'Aaron', age: 20, score: 99 },
    ]
    const newInfoMap = new Map<string, Record<string, any>>()
    newRows.forEach((r) => newInfoMap.set(r.id, r))
    store.setter(rowInfoMapAtom, newInfoMap)
    store.setter(rowIndexListAtom, ['r1', 'r2', 'r5'])

    const result = store.getter(rowIdShowListAtom)
    // Aaron, Alice, Charlie
    expect(result).toEqual(['r5', 'r2', 'r1'])
  })

  test('sort ignores non-sortable columns', () => {
    const store = setupStore()

    // Override 'name' to be non-sortable
    store.setter(getColumnOptionAtomByColumnId('name'), {
      dataIndex: 'name',
      key: 'name',
      // no sorter!
    })

    registerSortInterceptor(store)

    store.setter(sortStateAtom, [{ columnId: 'name', direction: 'asc' }])

    // Should not sort since 'name' has no sorter
    const result = store.getter(rowIdShowListAtom)
    expect(result).toEqual(['r1', 'r2', 'r3', 'r4'])
  })
})
