/**
 * Filter plugin integration test
 * Tests that useFilter's interceptor on rowIdShowListAtom actually filters rows
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
import { filterStateAtom } from '../state'
import { matchFilter } from '../filterUtils'
import { easyGet } from '@einfach/utils'
import type { FilterValue } from '../types'

/**
 * 模拟 useFilter 内部的 interceptor 注册逻辑
 */
function registerFilterInterceptor(store: ReturnType<typeof createStore>) {
  return store.setter(rowIdShowListAtom, (getter, prev) => {
    const currentFilterState = getter(filterStateAtom)
    if (currentFilterState.size === 0) return prev

    return prev.filter((rowId) => {
      const rowInfo = getter(rowInfoMapAtom).get(rowId)
      if (!rowInfo) return true

      for (const [columnId, filterValue] of currentFilterState) {
        const columnOption = getter(getColumnOptionAtomByColumnId(columnId))

        if (columnOption?.filterFn) {
          if (!columnOption.filterFn(rowInfo, filterValue)) {
            return false
          }
          continue
        }

        const { dataIndex } = columnOption ?? {}
        const cellValue = dataIndex ? easyGet(rowInfo, dataIndex) : undefined

        if (!matchFilter(cellValue, filterValue)) {
          return false
        }
      }
      return true
    })
  })
}

function setupStore() {
  const store = createStore()

  const rows = [
    { id: 'r1', name: '员工1', age: 30, department: '技术部' },
    { id: 'r2', name: '员工2', age: 25, department: '产品部' },
    { id: 'r3', name: '员工10', age: 35, department: '技术部' },
    { id: 'r4', name: '员工4', age: 28, department: '设计部' },
  ]

  store.setter(rowIndexListAtom, rows.map((r) => r.id))
  store.setter(columnIndexListAtom, ['name', 'age', 'department'])

  const infoMap = new Map<string, Record<string, any>>()
  rows.forEach((r) => infoMap.set(r.id, r))
  store.setter(rowInfoMapAtom, infoMap)

  store.setter(getColumnOptionAtomByColumnId('name'), {
    dataIndex: 'name',
    key: 'name',
    filterType: 'text',
  })
  store.setter(getColumnOptionAtomByColumnId('age'), {
    dataIndex: 'age',
    key: 'age',
    filterType: 'number',
  })
  store.setter(getColumnOptionAtomByColumnId('department'), {
    dataIndex: 'department',
    key: 'department',
    filterType: 'select',
  })

  store.getter(basicAtom)
  return store
}

describe('Filter integration: interceptor on rowIdShowListAtom', () => {
  test('no filter → all rows visible', () => {
    const store = setupStore()
    registerFilterInterceptor(store)

    const result = store.getter(rowIdShowListAtom)
    expect(result).toEqual(['r1', 'r2', 'r3', 'r4'])
  })

  test('text filter "contains" filters correctly', () => {
    const store = setupStore()
    registerFilterInterceptor(store)

    const filterState = new Map<string, FilterValue>()
    filterState.set('name', { type: 'text', operator: 'contains', value: '员工1' })
    store.setter(filterStateAtom, filterState)

    const result = store.getter(rowIdShowListAtom)
    // "员工1" 匹配 "员工1" 和 "员工10"
    expect(result).toEqual(['r1', 'r3'])
  })

  test('number filter "between" filters correctly', () => {
    const store = setupStore()
    registerFilterInterceptor(store)

    const filterState = new Map<string, FilterValue>()
    filterState.set('age', { type: 'number', operator: 'between', value: [26, 32] })
    store.setter(filterStateAtom, filterState)

    const result = store.getter(rowIdShowListAtom)
    // age 26-32: r1(30), r4(28)
    expect(result).toEqual(['r1', 'r4'])
  })

  test('select filter "include" filters correctly', () => {
    const store = setupStore()
    registerFilterInterceptor(store)

    const filterState = new Map<string, FilterValue>()
    filterState.set('department', { type: 'select', operator: 'include', value: ['技术部'] })
    store.setter(filterStateAtom, filterState)

    const result = store.getter(rowIdShowListAtom)
    expect(result).toEqual(['r1', 'r3'])
  })

  test('multiple filters combine with AND', () => {
    const store = setupStore()
    registerFilterInterceptor(store)

    const filterState = new Map<string, FilterValue>()
    filterState.set('department', { type: 'select', operator: 'include', value: ['技术部'] })
    filterState.set('age', { type: 'number', operator: 'gt', value: 31 })
    store.setter(filterStateAtom, filterState)

    const result = store.getter(rowIdShowListAtom)
    // 技术部 AND age > 31: only r3 (age=35)
    expect(result).toEqual(['r3'])
  })

  test('clearing filter restores all rows', () => {
    const store = setupStore()
    registerFilterInterceptor(store)

    const filterState = new Map<string, FilterValue>()
    filterState.set('name', { type: 'text', operator: 'contains', value: '员工1' })
    store.setter(filterStateAtom, filterState)
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r3'])

    // Clear
    store.setter(filterStateAtom, new Map())
    expect(store.getter(rowIdShowListAtom)).toEqual(['r1', 'r2', 'r3', 'r4'])
  })
})

describe('Filter + Sort chained interceptors', () => {
  test('filter then sort work together', () => {
    const store = setupStore()

    // 添加 sorter 到列
    store.setter(getColumnOptionAtomByColumnId('name'), {
      dataIndex: 'name',
      key: 'name',
      filterType: 'text',
      sorter: true,
    })

    // Register filter first, then sort (order matters for chaining)
    registerFilterInterceptor(store)

    // Register sort interceptor (simplified version)
    const { sortStateAtom } = require('../../../plugins/sort/state')
    store.setter(rowIdShowListAtom, (getter: any, prev: string[]) => {
      const sortState = getter(sortStateAtom)
      if (sortState.length === 0) return prev

      const sorted = [...prev]
      sorted.sort((a: string, b: string) => {
        const infoMap = getter(rowInfoMapAtom)
        for (const field of sortState) {
          const colOpt = getter(getColumnOptionAtomByColumnId(field.columnId))
          if (!colOpt?.dataIndex) continue
          const valA = easyGet(infoMap.get(a), colOpt.dataIndex)
          const valB = easyGet(infoMap.get(b), colOpt.dataIndex)
          const cmp = String(valA ?? '').localeCompare(String(valB ?? ''))
          if (cmp !== 0) return field.direction === 'asc' ? cmp : -cmp
        }
        return 0
      })
      return sorted
    })

    // Apply filter: 技术部 only
    const filterState = new Map<string, FilterValue>()
    filterState.set('department', { type: 'select', operator: 'include', value: ['技术部'] })
    store.setter(filterStateAtom, filterState)

    // Apply sort: name asc
    store.setter(sortStateAtom, [{ columnId: 'name', direction: 'asc' }])

    const result = store.getter(rowIdShowListAtom)
    // 技术部: r1(员工1), r3(员工10) → sorted by name asc: 员工1 < 员工10
    expect(result).toEqual(['r1', 'r3'])
  })
})
