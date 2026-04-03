/**
 * Filter plugin render integration test
 * Uses @testing-library/react to render actual TableExcel and test filter interaction
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { render, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useState, useCallback } from 'react'
import Table from '../TableExcel'
import type { ColumnType } from '../types/column'
import type { FilterState, FilterValue } from '../plugins/filter/types'

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.ResizeObserver = (jest.fn() as any).mockImplementation((callback: ResizeObserverCallback) => ({
    observe: jest.fn((element: Element) => {
      callback(
        [{ contentRect: { width: 600, height: 400 } } as unknown as ResizeObserverEntry],
        {} as ResizeObserver,
      )
    }),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })) as unknown as typeof ResizeObserver

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.IntersectionObserver = (jest.fn() as any).mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: () => [],
  })) as unknown as typeof IntersectionObserver
})

const columns: ColumnType[] = [
  { title: 'Name', dataIndex: 'name', width: 120, key: 'name' },
  { title: 'Age', dataIndex: 'age', width: 80, key: 'age' },
  { title: 'Dept', dataIndex: 'dept', width: 120, key: 'dept' },
]

const dataSource = [
  { id: '1', name: 'Alice', age: 25, dept: 'Tech' },
  { id: '2', name: 'Bob', age: 30, dept: 'Sales' },
  { id: '3', name: 'Charlie', age: 35, dept: 'Tech' },
  { id: '4', name: 'David', age: 28, dept: 'HR' },
  { id: '5', name: 'Eve', age: 22, dept: 'Tech' },
]

function FilterApp() {
  const [filterState, setFilterState] = useState<FilterState>(new Map())

  const applyDeptFilter = useCallback((dept: string) => {
    const next = new Map<string, FilterValue>()
    next.set('dept', { type: 'select', operator: 'include', value: [dept] })
    setFilterState(next)
  }, [])

  const applyNameFilter = useCallback((keyword: string) => {
    const next = new Map<string, FilterValue>(filterState)
    next.set('name', { type: 'text', operator: 'contains', value: keyword })
    setFilterState(next)
  }, [filterState])

  const clearFilter = useCallback(() => {
    setFilterState(new Map())
  }, [])

  return (
    <div>
      <div data-testid="filter-count">{filterState.size}</div>
      <button data-testid="filter-tech" onClick={() => applyDeptFilter('Tech')}>
        Filter Tech
      </button>
      <button data-testid="filter-name-a" onClick={() => applyNameFilter('A')}>
        Filter Name A
      </button>
      <button data-testid="filter-clear" onClick={() => clearFilter()}>
        Clear
      </button>
      <Table
        style={{ width: 600, height: 400 }}
        columns={columns}
        dataSource={dataSource}
        idProp="id"
        filter={{ state: filterState, onChange: setFilterState }}
        rowHeight={36}
        cellDefaultWidth={100}
        enableIntersectionRender={false}
      />
    </div>
  )
}

describe('Filter plugin render tests', () => {
  test('renders all rows initially', async () => {
    render(<FilterApp />)

    await waitFor(() => {
      // 5 rows × 3 columns = 15 cells
      const cells = document.querySelectorAll('.grid-table-cell')
      expect(cells.length).toBe(15)
    })
  })

  test('filter by dept reduces visible rows', async () => {
    const { getByTestId } = render(<FilterApp />)

    await waitFor(() => {
      expect(document.querySelectorAll('.grid-table-cell').length).toBe(15)
    })

    // 过滤只显示 Tech 部门（Alice, Charlie, Eve → 3 行）
    act(() => {
      getByTestId('filter-tech').click()
    })

    await waitFor(() => {
      // 3 rows × 3 columns = 9 cells
      const cells = document.querySelectorAll('.grid-table-cell')
      expect(cells.length).toBe(9)
    })
  })

  test('filter count updates in UI', async () => {
    const { getByTestId } = render(<FilterApp />)

    expect(getByTestId('filter-count').textContent).toBe('0')

    await waitFor(() => {
      expect(document.querySelectorAll('.grid-table-cell').length).toBe(15)
    })

    act(() => {
      getByTestId('filter-tech').click()
    })

    await waitFor(() => {
      expect(getByTestId('filter-count').textContent).toBe('1')
    })
  })

  test('clear filter restores all rows', async () => {
    const { getByTestId } = render(<FilterApp />)

    await waitFor(() => {
      expect(document.querySelectorAll('.grid-table-cell').length).toBe(15)
    })

    // 过滤
    act(() => { getByTestId('filter-tech').click() })
    await waitFor(() => {
      expect(document.querySelectorAll('.grid-table-cell').length).toBe(9)
    })

    // 清除
    act(() => { getByTestId('filter-clear').click() })
    await waitFor(() => {
      expect(document.querySelectorAll('.grid-table-cell').length).toBe(15)
    })
  })

  test('filtered rows contain correct data', async () => {
    const { getByTestId } = render(<FilterApp />)

    await waitFor(() => {
      expect(document.querySelectorAll('.grid-table-cell').length).toBe(15)
    })

    act(() => { getByTestId('filter-tech').click() })

    await waitFor(() => {
      const cells = document.querySelectorAll('.grid-table-cell')
      const texts = Array.from(cells).map((c) => c.textContent?.trim())
      // Tech 部门的人：Alice(25,Tech), Charlie(35,Tech), Eve(22,Tech)
      expect(texts).toContain('Alice')
      expect(texts).toContain('Charlie')
      expect(texts).toContain('Eve')
      expect(texts).not.toContain('Bob')
      expect(texts).not.toContain('David')
    })
  })
})
