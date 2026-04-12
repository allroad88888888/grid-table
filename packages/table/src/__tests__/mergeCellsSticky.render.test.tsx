import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useEffect, useMemo, useState } from 'react'
import { createStore } from '@einfach/react'
import Table from '../TableExcel'
import type { ColumnType } from '../types/column'
import { tbodyMergeCellListAtom } from '../components'
import { getCellId } from '../utils/getCellId'

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.ResizeObserver = (jest.fn() as any).mockImplementation((callback: ResizeObserverCallback) => ({
    observe: jest.fn(() => {
      callback(
        [{ contentRect: { width: 600, height: 120 } } as unknown as ResizeObserverEntry],
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

type DemoRow = {
  id: string
  rowLabel: string
  scene: string
  owner: string
  phase: string
}

const columns: ColumnType[] = [
  { title: '行号', dataIndex: 'rowLabel', key: 'rowLabel', width: 72, fixed: 'left' },
  { title: '场景', dataIndex: 'scene', key: 'scene', width: 240, fixed: 'left' },
  { title: '负责人', dataIndex: 'owner', key: 'owner', width: 180, fixed: 'left' },
  { title: '阶段', dataIndex: 'phase', key: 'phase', width: 140 },
]

function MergeStickyApp() {
  const [store] = useState(() => createStore())
  const rows = useMemo<DemoRow[]>(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        id: `row-${index + 1}`,
        rowLabel: `${index + 1}`,
        scene: index === 0 ? 'MERGED-STICKY-CONTENT' : `scene-${index + 1}`,
        owner: index === 0 ? 'anchor-owner' : `owner-${index + 1}`,
        phase: `phase-${index + 1}`,
      })),
    [],
  )

  useEffect(() => {
    store.setter(tbodyMergeCellListAtom, [
      {
        cellId: getCellId({ rowId: rows[0].id, columnId: 'scene' }),
        rowIdList: rows.slice(1, 5).map((row) => row.id),
        colIdList: ['owner'],
      },
    ])
  }, [rows, store])

  return (
    <Table
      store={store}
      style={{ width: 600, height: 120 }}
      columns={columns}
      dataSource={rows}
      idProp="id"
      rowHeight={40}
      stickyMergeCell={true}
      showHorizontalBorder={true}
      showVerticalBorder={true}
    />
  )
}

describe('sticky merge render', () => {
  test('overflow merge renders content eagerly and applies tbody viewport sticky vars', async () => {
    render(<MergeStickyApp />)

    let stickyContent: Element | null = null
    await waitFor(() => {
      stickyContent = document.querySelector('.grid-table-cell--sticky-merge')
      expect(stickyContent).not.toBeNull()
    })

    const stickyElement = stickyContent as unknown as HTMLElement | null
    if (!stickyElement) {
      throw new Error('sticky merge cell was not rendered as an HTMLElement')
    }
    expect(stickyElement).toHaveTextContent('MERGED-STICKY-CONTENT')
    expect(stickyElement).toHaveStyle('--grid-merge-sticky-top: 40px')

    const stickyHeight = Number.parseInt(
      stickyElement.style.getPropertyValue('--grid-merge-sticky-height'),
      10,
    )
    expect(stickyHeight).toBeGreaterThan(0)
    expect(stickyHeight).toBeLessThan(120)
  })
})
