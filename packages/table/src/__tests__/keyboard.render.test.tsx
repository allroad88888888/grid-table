/**
 * Keyboard plugin render integration test
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import { createStore, Provider as StoreProvider, useAtomValue } from '@einfach/react'
import Table from '../TableExcel'
import type { ColumnType } from '../types/column'
import { focusPositionAtom } from '../plugins/keyboard/state'
import type { Store } from '@einfach/react'

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
  { title: 'Col A', dataIndex: 'a', width: 100, key: 'a' },
  { title: 'Col B', dataIndex: 'b', width: 100, key: 'b' },
  { title: 'Col C', dataIndex: 'c', width: 100, key: 'c' },
]

const dataSource = [
  { id: '1', a: 'A1', b: 'B1', c: 'C1' },
  { id: '2', a: 'A2', b: 'B2', c: 'C2' },
  { id: '3', a: 'A3', b: 'B3', c: 'C3' },
]

function FocusDisplay({ store }: { store: Store }) {
  const focus = useAtomValue(focusPositionAtom, { store })
  return (
    <div data-testid="focus-display">
      {focus ? `${focus.rowId}|${focus.columnId}|${focus.region}` : 'none'}
    </div>
  )
}

function KeyboardApp() {
  const [store] = React.useState(() => createStore())

  return (
    <StoreProvider store={store}>
      <FocusDisplay store={store} />
      <Table
        style={{ width: 600, height: 400 }}
        columns={columns}
        dataSource={dataSource}
        idProp="id"
        store={store}
        enableKeyboard
        rowHeight={36}
        cellDefaultWidth={100}
        enableIntersectionRender={false}
      />
    </StoreProvider>
  )
}

describe('Keyboard plugin render tests', () => {
  test('renders table with data-grid-table attribute', async () => {
    render(<KeyboardApp />)

    await waitFor(() => {
      const table = document.querySelector('[data-grid-table]')
      expect(table).toBeTruthy()
    })
  })

  test('focus display shows none initially', async () => {
    const { getByTestId } = render(<KeyboardApp />)

    expect(getByTestId('focus-display').textContent).toBe('none')
  })

  test('ArrowDown navigates to first cell when no focus', async () => {
    const { getByTestId } = render(<KeyboardApp />)

    await waitFor(() => {
      expect(document.querySelectorAll('.grid-table-cell').length).toBeGreaterThan(0)
    })

    // 先让表格获得焦点
    const table = document.querySelector('[data-grid-table]') as HTMLElement
    act(() => { table.focus() })

    // 按下方向键
    act(() => {
      fireEvent.keyDown(document, { key: 'ArrowDown' })
    })

    await waitFor(() => {
      const text = getByTestId('focus-display').textContent
      expect(text).not.toBe('none')
    })
  })

  test('Escape clears focus', async () => {
    const { getByTestId } = render(<KeyboardApp />)

    await waitFor(() => {
      expect(document.querySelectorAll('.grid-table-cell').length).toBeGreaterThan(0)
    })

    const table = document.querySelector('[data-grid-table]') as HTMLElement
    act(() => { table.focus() })

    // 先导航到一个位置
    act(() => { fireEvent.keyDown(document, { key: 'ArrowDown' }) })
    await waitFor(() => {
      expect(getByTestId('focus-display').textContent).not.toBe('none')
    })

    // Escape 清除
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }) })
    await waitFor(() => {
      expect(getByTestId('focus-display').textContent).toBe('none')
    })
  })

  test('ArrowRight changes column', async () => {
    const { getByTestId } = render(<KeyboardApp />)

    await waitFor(() => {
      expect(document.querySelectorAll('.grid-table-cell').length).toBeGreaterThan(0)
    })

    const table = document.querySelector('[data-grid-table]') as HTMLElement
    act(() => { table.focus() })

    // 先到第一个位置
    act(() => { fireEvent.keyDown(document, { key: 'ArrowDown' }) })
    await waitFor(() => {
      expect(getByTestId('focus-display').textContent).not.toBe('none')
    })

    const text1 = getByTestId('focus-display').textContent!

    // 向右移动
    act(() => { fireEvent.keyDown(document, { key: 'ArrowRight' }) })

    await waitFor(() => {
      const text2 = getByTestId('focus-display').textContent!
      expect(text2).not.toBe(text1)
      expect(text2).not.toBe('none')
    })
  })
})
