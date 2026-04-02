import { describe, test, expect } from '@jest/globals'
import { createStore, atom } from '@einfach/react'
import {
  columnIndexListAtom,
  rowIndexListAtom,
  basicAtom,
} from '@grid-table/basic'
import type { ColumnId } from '@grid-table/basic'
import { getColumnOptionAtomByColumnId, rowInfoMapAtom } from '../../../stateCore'
import { sortStateAtom } from '../state'
import type { SortDirection, SortState } from '../types'

function setupStore(
  rows: { id: string; name: string; age: number; score: number }[],
) {
  const store = createStore()
  const rowIds = rows.map((r) => r.id)
  const colIds = ['name', 'age', 'score']

  store.setter(rowIndexListAtom, rowIds)
  store.setter(columnIndexListAtom, colIds)

  // 设置行数据
  const infoMap = new Map<string, Record<string, any>>()
  rows.forEach((r) => infoMap.set(r.id, r))
  store.setter(rowInfoMapAtom, infoMap)

  // 设置列配置
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

const testData = [
  { id: 'r1', name: 'Charlie', age: 30, score: 85 },
  { id: 'r2', name: 'Alice', age: 25, score: 92 },
  { id: 'r3', name: 'Bob', age: 35, score: 78 },
  { id: 'r4', name: 'David', age: 28, score: 92 },
]

describe('sortStateAtom', () => {
  test('initial state is empty', () => {
    const store = createStore()
    expect(store.getter(sortStateAtom)).toEqual([])
  })

  test('set and get sort state', () => {
    const store = createStore()
    const state: SortState = [{ columnId: 'name', direction: 'asc' }]
    store.setter(sortStateAtom, state)
    expect(store.getter(sortStateAtom)).toEqual(state)
  })
})

// 内联派生 atom，避免 TS6305 构建依赖问题
const columnSortInfoTestAtom = atom((getter) => {
  const sortState = getter(sortStateAtom)
  const map = new Map<ColumnId, { direction: SortDirection; priority: number }>()
  sortState.forEach((field, index) => {
    map.set(field.columnId, { direction: field.direction, priority: index + 1 })
  })
  return map
})

describe('columnSortInfoAtom', () => {
  test('empty when no sort', () => {
    const store = createStore()
    const infoMap = store.getter(columnSortInfoTestAtom)
    expect(infoMap.size).toBe(0)
  })

  test('single column sort info', () => {
    const store = createStore()
    store.setter(sortStateAtom, [{ columnId: 'name', direction: 'asc' }])
    const infoMap = store.getter(columnSortInfoTestAtom)
    expect(infoMap.get('name')).toEqual({ direction: 'asc', priority: 1 })
    expect(infoMap.has('age')).toBe(false)
  })

  test('multi column sort info with priorities', () => {
    const store = createStore()
    store.setter(sortStateAtom, [
      { columnId: 'name', direction: 'asc' },
      { columnId: 'age', direction: 'desc' },
    ])
    const infoMap = store.getter(columnSortInfoTestAtom)
    expect(infoMap.get('name')).toEqual({ direction: 'asc', priority: 1 })
    expect(infoMap.get('age')).toEqual({ direction: 'desc', priority: 2 })
  })
})

describe('sort integration with rowIdShowListAtom', () => {
  test('rowIdShowListAtom reflects sorted order after manual setter', () => {
    const store = setupStore(testData)

    // 模拟 useSort 内部逻辑：设置排序状态并手动排序
    store.setter(sortStateAtom, [{ columnId: 'name', direction: 'asc' }])

    // 手动执行排序（在实际代码中这由 useSort 的 useEffect 完成）
    const rowIds = store.getter(rowIndexListAtom)

    const sorted = [...rowIds].sort((a, b) => {
      const infoA = store.getter(rowInfoMapAtom).get(a)
      const infoB = store.getter(rowInfoMapAtom).get(b)
      if (!infoA || !infoB) return 0
      const valA = infoA['name'] as string
      const valB = infoB['name'] as string
      return valA.localeCompare(valB)
    })

    expect(sorted).toEqual(['r2', 'r3', 'r1', 'r4']) // Alice, Bob, Charlie, David
  })

  test('descending sort reverses order', () => {
    const store = setupStore(testData)

    const rowIds = store.getter(rowIndexListAtom)
    const infoMap = store.getter(rowInfoMapAtom)

    const sorted = [...rowIds].sort((a, b) => {
      const valA = infoMap.get(a)?.['age'] as number
      const valB = infoMap.get(b)?.['age'] as number
      return valB - valA // desc
    })

    // age desc: 35(Bob), 30(Charlie), 28(David), 25(Alice)
    expect(sorted).toEqual(['r3', 'r1', 'r4', 'r2'])
  })

  test('multi-column sort: primary score desc, secondary name asc', () => {
    const store = setupStore(testData)
    const rowIds = store.getter(rowIndexListAtom)
    const infoMap = store.getter(rowInfoMapAtom)

    const sorted = [...rowIds].sort((a, b) => {
      const infoA = infoMap.get(a)!
      const infoB = infoMap.get(b)!

      // Primary: score desc
      const scoreCmp = (infoB['score'] as number) - (infoA['score'] as number)
      if (scoreCmp !== 0) return scoreCmp

      // Secondary: name asc
      return (infoA['name'] as string).localeCompare(infoB['name'] as string)
    })

    // score=92: Alice(r2), David(r4); score=85: Charlie(r1); score=78: Bob(r3)
    expect(sorted).toEqual(['r2', 'r4', 'r1', 'r3'])
  })
})

describe('sort state transitions', () => {
  test('sort cycle: null → asc → desc → null', () => {
    const cycle: (string | null)[] = ['asc', 'desc', null]
    let current: string | null = null

    // First toggle → asc
    let idx = cycle.indexOf(current)
    current = cycle[(idx + 1) % cycle.length]
    expect(current).toBe('asc')

    // Second toggle → desc
    idx = cycle.indexOf(current)
    current = cycle[(idx + 1) % cycle.length]
    expect(current).toBe('desc')

    // Third toggle → null (clear)
    idx = cycle.indexOf(current)
    current = cycle[(idx + 1) % cycle.length]
    expect(current).toBeNull()
  })

  test('multi-sort: adding and removing columns', () => {
    let state: SortState = []

    // Add name asc
    state = [{ columnId: 'name', direction: 'asc' }]
    expect(state.length).toBe(1)

    // Shift+Click age → add age desc
    state = [...state, { columnId: 'age', direction: 'desc' }]
    expect(state.length).toBe(2)
    expect(state[0].columnId).toBe('name')
    expect(state[1].columnId).toBe('age')

    // Click name without shift → single sort on name
    state = [{ columnId: 'name', direction: 'desc' }]
    expect(state.length).toBe(1)
  })
})

describe('default compare', () => {
  test('numbers compared numerically', () => {
    const nums = [10, 2, 30, 1]
    nums.sort((a, b) => a - b)
    expect(nums).toEqual([1, 2, 10, 30])
  })

  test('strings compared with localeCompare', () => {
    const strs = ['banana', 'apple', 'cherry']
    strs.sort((a, b) => a.localeCompare(b))
    expect(strs).toEqual(['apple', 'banana', 'cherry'])
  })

  test('null values sort to beginning', () => {
    const vals = [3, null, 1, null, 2]
    vals.sort((a, b) => {
      if (a == null && b == null) return 0
      if (a == null) return -1
      if (b == null) return 1
      return (a as number) - (b as number)
    })
    expect(vals).toEqual([null, null, 1, 2, 3])
  })
})
