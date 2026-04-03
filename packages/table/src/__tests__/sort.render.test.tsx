/**
 * Sort plugin render integration test
 * Uses @testing-library/react to render actual TableExcel and test sort interaction
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useState, useCallback } from 'react'
import Table from '../TableExcel'
import type { ColumnType } from '../types/column'
import type { SortState } from '../plugins/sort/types'

// Mock ResizeObserver 让 VGridTable 能获取到容器尺寸
beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.ResizeObserver = (jest.fn() as any).mockImplementation((callback: ResizeObserverCallback) => ({
    observe: jest.fn((element: Element) => {
      // 立即回调一个合理的容器尺寸，触发单元格渲染
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
  { title: 'Name', dataIndex: 'name', width: 120, key: 'name', sorter: true },
  { title: 'Age', dataIndex: 'age', width: 80, key: 'age', sorter: true },
  { title: 'City', dataIndex: 'city', width: 120, key: 'city' },
]

const dataSource = [
  { id: '1', name: 'Charlie', age: 30, city: 'Beijing' },
  { id: '2', name: 'Alice', age: 25, city: 'Shanghai' },
  { id: '3', name: 'Bob', age: 35, city: 'Shenzhen' },
]

function SortControlledApp({ onSortChangeSpy }: { onSortChangeSpy: jest.Mock }) {
  const [sortState, setSortState] = useState<SortState>([])

  const onSortChange = useCallback(
    (next: SortState) => {
      setSortState(next)
      onSortChangeSpy(next)
    },
    [onSortChangeSpy],
  )

  return (
    <div>
      <div data-testid="sort-state">{JSON.stringify(sortState)}</div>
      <Table
        style={{ width: 600, height: 400 }}
        columns={columns}
        dataSource={dataSource}
        idProp="id"
        sort={{ state: sortState, onChange: onSortChange }}
        rowHeight={36}
        cellDefaultWidth={100}
        enableIntersectionRender={false}
      />
    </div>
  )
}

function SortUncontrolledApp() {
  return (
    <Table
      style={{ width: 600, height: 400 }}
      columns={columns}
      dataSource={dataSource}
      idProp="id"
      sort={{}}
      rowHeight={36}
      cellDefaultWidth={100}
    />
  )
}

describe('Sort plugin render tests', () => {
  test('renders sortable headers with data-testid and data-sortable', async () => {
    render(<SortUncontrolledApp />)

    await waitFor(() => {
      const sortableHeaders = document.querySelectorAll('[data-sortable="true"]')
      expect(sortableHeaders.length).toBe(2) // Name + Age are sortable
    })

    // City 没有 sorter，不应有 data-sortable
    const cityHeader = document.querySelector('[data-testid="thead-cell-city"]')
    expect(cityHeader).toBeTruthy()
    expect(cityHeader?.getAttribute('data-sortable')).toBeNull()
  })

  test('renders sort icon on sortable headers', async () => {
    render(<SortUncontrolledApp />)

    await waitFor(() => {
      const sortIcons = document.querySelectorAll('[data-testid="sort-icon"]')
      expect(sortIcons.length).toBe(2)
    })
  })

  test('controlled: clicking sortable header fires onChange', async () => {
    const spy = jest.fn()
    render(<SortControlledApp onSortChangeSpy={spy} />)

    await waitFor(() => {
      expect(document.querySelectorAll('[data-sortable="true"]').length).toBe(2)
    })

    // 点击 Name 表头
    const nameHeader = document.querySelector('[data-testid="thead-cell-name"]')!
    act(() => {
      fireEvent.click(nameHeader)
    })

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith([{ columnId: 'name', direction: 'asc' }])
    })
  })

  test('controlled: sort state displayed in UI', async () => {
    const spy = jest.fn()
    const { getByTestId } = render(<SortControlledApp onSortChangeSpy={spy} />)

    await waitFor(() => {
      expect(document.querySelectorAll('[data-sortable="true"]').length).toBe(2)
    })

    // 初始状态
    expect(getByTestId('sort-state').textContent).toBe('[]')

    // 点击 Name 表头
    const nameHeader = document.querySelector('[data-testid="thead-cell-name"]')!
    act(() => {
      fireEvent.click(nameHeader)
    })

    await waitFor(() => {
      const stateText = getByTestId('sort-state').textContent!
      expect(stateText).toContain('asc')
      expect(stateText).toContain('name')
    })
  })

  test('controlled: second click changes to desc', async () => {
    const spy = jest.fn()
    const { getByTestId } = render(<SortControlledApp onSortChangeSpy={spy} />)

    await waitFor(() => {
      expect(document.querySelectorAll('[data-sortable="true"]').length).toBe(2)
    })

    const nameHeader = document.querySelector('[data-testid="thead-cell-name"]')!

    // 第一次点击 → asc
    act(() => { fireEvent.click(nameHeader) })
    await waitFor(() => {
      expect(getByTestId('sort-state').textContent).toContain('asc')
    })

    // 第二次点击 → desc
    act(() => { fireEvent.click(nameHeader) })
    await waitFor(() => {
      expect(getByTestId('sort-state').textContent).toContain('desc')
    })
  })

  test('controlled: third click clears sort', async () => {
    const spy = jest.fn()
    const { getByTestId } = render(<SortControlledApp onSortChangeSpy={spy} />)

    await waitFor(() => {
      expect(document.querySelectorAll('[data-sortable="true"]').length).toBe(2)
    })

    const nameHeader = document.querySelector('[data-testid="thead-cell-name"]')!

    // asc → desc → clear
    act(() => { fireEvent.click(nameHeader) })
    await waitFor(() => expect(getByTestId('sort-state').textContent).toContain('asc'))
    act(() => { fireEvent.click(nameHeader) })
    await waitFor(() => expect(getByTestId('sort-state').textContent).toContain('desc'))
    act(() => { fireEvent.click(nameHeader) })

    await waitFor(() => {
      expect(getByTestId('sort-state').textContent).toBe('[]')
    })
  })

  test('uncontrolled: sort icon direction changes after click', async () => {
    render(<SortUncontrolledApp />)

    await waitFor(() => {
      expect(document.querySelectorAll('[data-sortable="true"]').length).toBe(2)
    })

    const nameHeader = document.querySelector('[data-testid="thead-cell-name"]')!

    // 初始无排序方向
    const nameIcon = nameHeader.querySelector('[data-testid="sort-icon"]')
    expect(nameIcon?.getAttribute('data-direction')).toBeNull()

    act(() => { fireEvent.click(nameHeader) })

    await waitFor(() => {
      const icon = nameHeader.querySelector('[data-testid="sort-icon"]')
      expect(icon?.getAttribute('data-direction')).toBe('asc')
    })
  })

  test('sortable header click calls stopPropagation to prevent area selection conflict', async () => {
    const spy = jest.fn()
    render(<SortControlledApp onSortChangeSpy={spy} />)

    await waitFor(() => {
      expect(document.querySelectorAll('[data-sortable="true"]').length).toBe(2)
    })

    const nameHeader = document.querySelector('[data-testid="thead-cell-name"]')!

    // 验证 click 事件的 stopPropagation 被调用
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    const stopPropSpy = jest.spyOn(clickEvent, 'stopPropagation')

    act(() => { nameHeader.dispatchEvent(clickEvent) })

    await waitFor(() => {
      expect(spy).toHaveBeenCalled()
      expect(stopPropSpy).toHaveBeenCalled()
    })
  })

  test('non-sortable column click does not trigger sort', async () => {
    const spy = jest.fn()
    render(<SortControlledApp onSortChangeSpy={spy} />)

    await waitFor(() => {
      expect(document.querySelector('[data-testid="thead-cell-city"]')).toBeTruthy()
    })

    const cityHeader = document.querySelector('[data-testid="thead-cell-city"]')!
    act(() => { fireEvent.click(cityHeader) })

    // spy 不应被调用
    expect(spy).not.toHaveBeenCalled()
  })
})
