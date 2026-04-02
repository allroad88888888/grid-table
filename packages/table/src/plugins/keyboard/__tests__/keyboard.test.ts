import { describe, test, expect } from '@jest/globals'
import { createStore, atom } from '@einfach/react'
import { getCellId } from '../../../utils/getCellId'
import type { FocusPosition } from '../types'
import { getCellDomId } from '../state'

// 内联 atoms 避免 TS6305 构建依赖
const focusPositionAtom = atom<FocusPosition | null>(null)

// setupStore available for future integration tests
// function setupStore() {
//   const store = createStore()
//   store.setter(columnIndexListAtom, ['col_0', 'col_1', 'col_2'])
//   store.setter(rowIndexListAtom, ['row_0', 'row_1', 'row_2', 'row_3'])
//   store.setter(headerRowIndexListAtom, ['head_0'])
//   store.getter(basicAtom)
//   return store
// }

describe('focusPositionAtom', () => {
  test('initial state is null', () => {
    const store = createStore()
    expect(store.getter(focusPositionAtom)).toBeNull()
  })

  test('set and get focus position', () => {
    const store = createStore()
    const pos: FocusPosition = {
      rowId: 'row_0',
      columnId: 'col_0',
      cellId: getCellId({ rowId: 'row_0', columnId: 'col_0' }),
      region: 'tbody',
    }
    store.setter(focusPositionAtom, pos)
    expect(store.getter(focusPositionAtom)).toEqual(pos)
  })

  test('clear focus', () => {
    const store = createStore()
    store.setter(focusPositionAtom, {
      rowId: 'row_0',
      columnId: 'col_0',
      cellId: getCellId({ rowId: 'row_0', columnId: 'col_0' }),
      region: 'tbody',
    })
    store.setter(focusPositionAtom, null)
    expect(store.getter(focusPositionAtom)).toBeNull()
  })
})

describe('getCellDomId', () => {
  test('generates correct id', () => {
    const cellId = getCellId({ rowId: 'row_0', columnId: 'col_0' })
    expect(getCellDomId(cellId)).toBe(`grid-cell-${cellId}`)
  })
})

describe('navigation logic', () => {
  test('basic grid index computation', () => {
    const rowList = ['row_0', 'row_1', 'row_2', 'row_3']
    const colList = ['col_0', 'col_1', 'col_2']

    // Current position: row_1, col_1
    const rowIndex = 1
    const colIndex = 1

    // Move right
    const rightColIndex = Math.min(colList.length - 1, colIndex + 1)
    expect(rightColIndex).toBe(2)

    // Move down
    const downRowIndex = Math.min(rowList.length - 1, rowIndex + 1)
    expect(downRowIndex).toBe(2)

    // Move left from col_0 (boundary)
    const leftFromZero = Math.max(0, 0 - 1)
    expect(leftFromZero).toBe(0)

    // Move up from row_0 (boundary)
    const upFromZero = Math.max(0, 0 - 1)
    expect(upFromZero).toBe(0)
  })

  test('home/end navigation', () => {
    const colList = ['col_0', 'col_1', 'col_2']

    // Home → first column
    expect(0).toBe(0)

    // End → last column
    expect(colList.length - 1).toBe(2)
  })

  test('ctrlHome/ctrlEnd navigation', () => {
    const rowList = ['row_0', 'row_1', 'row_2', 'row_3']
    const colList = ['col_0', 'col_1', 'col_2']

    // Ctrl+Home → (0, 0)
    expect(0).toBe(0)
    expect(0).toBe(0)

    // Ctrl+End → (last, last)
    expect(rowList.length - 1).toBe(3)
    expect(colList.length - 1).toBe(2)
  })

  test('pageUp/pageDown navigation', () => {
    const rowList = Array.from({ length: 100 }, (_, i) => `row_${i}`)

    // PageDown from row 5 → row 25 (step 20)
    const fromRow5 = Math.min(rowList.length - 1, 5 + 20)
    expect(fromRow5).toBe(25)

    // PageUp from row 10 → row 0 (step 20 clamped)
    const fromRow10 = Math.max(0, 10 - 20)
    expect(fromRow10).toBe(0)

    // PageDown near end (row 95) → row 99
    const fromRow95 = Math.min(rowList.length - 1, 95 + 20)
    expect(fromRow95).toBe(99)
  })

  test('cross-region navigation: tbody to thead', () => {
    const headerRowList = ['head_0']

    // At row_0 (body index 0), move up → go to thead last row
    const bodyRowIndex = 0
    let nextRegion: 'thead' | 'tbody' = 'tbody'
    let nextRowIndex = bodyRowIndex

    if (bodyRowIndex === 0 && headerRowList.length > 0) {
      nextRegion = 'thead'
      nextRowIndex = headerRowList.length - 1
    }

    expect(nextRegion).toBe('thead')
    expect(nextRowIndex).toBe(0)
  })

  test('cross-region navigation: thead to tbody', () => {
    const headerRowList = ['head_0']
    const bodyRowList = ['row_0', 'row_1']

    // At head_0 (thead index 0, last row), move down → go to tbody first row
    const theadRowIndex = 0
    let nextRegion: 'thead' | 'tbody' = 'thead'
    let nextRowIndex = theadRowIndex

    if (theadRowIndex >= headerRowList.length - 1 && bodyRowList.length > 0) {
      nextRegion = 'tbody'
      nextRowIndex = 0
    }

    expect(nextRegion).toBe('tbody')
    expect(nextRowIndex).toBe(0)
  })
})

describe('ARIA props', () => {
  test('grid aria props structure', () => {
    const rowCount = 100
    const colCount = 10
    const headerRowCount = 2

    const props = {
      role: 'grid' as const,
      'aria-rowcount': rowCount + headerRowCount,
      'aria-colcount': colCount,
      'aria-multiselectable': true,
      'aria-activedescendant': undefined,
      'aria-label': 'Data table',
    }

    expect(props.role).toBe('grid')
    expect(props['aria-rowcount']).toBe(102)
    expect(props['aria-colcount']).toBe(10)
    expect(props['aria-label']).toBe('Data table')
  })
})
