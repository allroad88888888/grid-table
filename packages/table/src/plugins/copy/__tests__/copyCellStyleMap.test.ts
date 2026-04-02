import { describe, test, expect } from '@jest/globals'
import { createStore, Store } from '@einfach/react'
import type { CSSProperties } from 'react'
import type { CellId } from '@grid-table/basic'
import {
  copyCellTbodyStyleMapAtom,
  copyCellTheadStyleMapAtom,
} from '../state'
import { createCopyBorderStyle, COPY_BORDER_WIDTH, COPY_BORDER_STYLE, COPY_BORDER_COLOR } from '../copyUtils'
import { getCellId } from '../../../utils'

describe('copyCellStyleMap atoms', () => {
  let store: Store

  beforeEach(() => {
    store = createStore()
  })

  test('initial state is empty Map', () => {
    expect(store.getter(copyCellTbodyStyleMapAtom).size).toBe(0)
    expect(store.getter(copyCellTheadStyleMapAtom).size).toBe(0)
  })

  test('can set and read tbody style map', () => {
    const cellId = getCellId({ rowId: 'r0', columnId: 'c0' }) as CellId
    const styleMap = new Map<CellId, CSSProperties>([[cellId, { borderTopWidth: '2px' }]])
    store.setter(copyCellTbodyStyleMapAtom, styleMap)

    const result = store.getter(copyCellTbodyStyleMapAtom)
    expect(result.size).toBe(1)
    expect(result.get(cellId)).toEqual({ borderTopWidth: '2px' })
  })

  test('can set and read thead style map', () => {
    const cellId = getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId
    const styleMap = new Map<CellId, CSSProperties>([[cellId, { borderLeftWidth: '2px' }]])
    store.setter(copyCellTheadStyleMapAtom, styleMap)

    const result = store.getter(copyCellTheadStyleMapAtom)
    expect(result.size).toBe(1)
    expect(result.get(cellId)).toEqual({ borderLeftWidth: '2px' })
  })

  test('tbody and thead maps are independent', () => {
    const tbodyCellId = getCellId({ rowId: 'r0', columnId: 'c0' }) as CellId
    const theadCellId = getCellId({ rowId: 'h0', columnId: 'c0' }) as CellId

    store.setter(
      copyCellTbodyStyleMapAtom,
      new Map<CellId, CSSProperties>([[tbodyCellId, { borderTopWidth: '2px' }]]),
    )
    store.setter(
      copyCellTheadStyleMapAtom,
      new Map<CellId, CSSProperties>([[theadCellId, { borderLeftWidth: '2px' }]]),
    )

    expect(store.getter(copyCellTbodyStyleMapAtom).has(tbodyCellId)).toBe(true)
    expect(store.getter(copyCellTbodyStyleMapAtom).has(theadCellId)).toBe(false)
    expect(store.getter(copyCellTheadStyleMapAtom).has(theadCellId)).toBe(true)
    expect(store.getter(copyCellTheadStyleMapAtom).has(tbodyCellId)).toBe(false)
  })

  test('clearing sets empty Map', () => {
    const cellId = getCellId({ rowId: 'r0', columnId: 'c0' }) as CellId
    store.setter(
      copyCellTbodyStyleMapAtom,
      new Map<CellId, CSSProperties>([[cellId, { borderTopWidth: '2px' }]]),
    )
    expect(store.getter(copyCellTbodyStyleMapAtom).size).toBe(1)

    store.setter(copyCellTbodyStyleMapAtom, new Map())
    expect(store.getter(copyCellTbodyStyleMapAtom).size).toBe(0)
  })
})

describe('createCopyBorderStyle', () => {
  test('top-left corner: has top + left borders', () => {
    const style = createCopyBorderStyle({
      currentRowIndex: 0,
      totalRowLength: 3,
      columnIndex: 0,
      columnLength: 3,
      prevStyle: {},
    })

    expect(style.borderTopWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderTopStyle).toBe(COPY_BORDER_STYLE)
    expect(style.borderTopColor).toBe(COPY_BORDER_COLOR)
    expect(style.borderLeftWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderLeftStyle).toBe(COPY_BORDER_STYLE)
    expect(style.borderLeftColor).toBe(COPY_BORDER_COLOR)
    // no bottom/right borders
    expect(style.borderBottomWidth).toBeUndefined()
    expect(style.borderRightWidth).toBeUndefined()
  })

  test('top-right corner: has top + right borders', () => {
    const style = createCopyBorderStyle({
      currentRowIndex: 0,
      totalRowLength: 3,
      columnIndex: 2,
      columnLength: 3,
      prevStyle: {},
    })

    expect(style.borderTopWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderRightWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderBottomWidth).toBeUndefined()
    expect(style.borderLeftWidth).toBeUndefined()
  })

  test('bottom-left corner: has bottom + left borders', () => {
    const style = createCopyBorderStyle({
      currentRowIndex: 2,
      totalRowLength: 3,
      columnIndex: 0,
      columnLength: 3,
      prevStyle: {},
    })

    expect(style.borderBottomWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderLeftWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderTopWidth).toBeUndefined()
    expect(style.borderRightWidth).toBeUndefined()
  })

  test('bottom-right corner: has bottom + right borders', () => {
    const style = createCopyBorderStyle({
      currentRowIndex: 2,
      totalRowLength: 3,
      columnIndex: 2,
      columnLength: 3,
      prevStyle: {},
    })

    expect(style.borderBottomWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderRightWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderTopWidth).toBeUndefined()
    expect(style.borderLeftWidth).toBeUndefined()
  })

  test('inner cell: no border at all', () => {
    const style = createCopyBorderStyle({
      currentRowIndex: 1,
      totalRowLength: 3,
      columnIndex: 1,
      columnLength: 3,
      prevStyle: {},
    })

    expect(style.borderTopWidth).toBeUndefined()
    expect(style.borderBottomWidth).toBeUndefined()
    expect(style.borderLeftWidth).toBeUndefined()
    expect(style.borderRightWidth).toBeUndefined()
  })

  test('single cell (1x1): has all four borders', () => {
    const style = createCopyBorderStyle({
      currentRowIndex: 0,
      totalRowLength: 1,
      columnIndex: 0,
      columnLength: 1,
      prevStyle: {},
    })

    expect(style.borderTopWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderBottomWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderLeftWidth).toBe(COPY_BORDER_WIDTH)
    expect(style.borderRightWidth).toBe(COPY_BORDER_WIDTH)
  })

  test('prevStyle is preserved', () => {
    const style = createCopyBorderStyle({
      currentRowIndex: 0,
      totalRowLength: 1,
      columnIndex: 0,
      columnLength: 1,
      prevStyle: { backgroundColor: 'red' },
    })

    expect(style.backgroundColor).toBe('red')
    expect(style.borderTopWidth).toBe(COPY_BORDER_WIDTH)
  })
})

describe('batch copy style computation performance', () => {
  test('100x100 batch computation is fast', () => {
    const rowCount = 100
    const colCount = 100
    const totalRowLength = rowCount

    const start = performance.now()
    const tbodyMap = new Map<CellId, CSSProperties>()

    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < colCount; c++) {
        const cellId = getCellId({ rowId: `r_${r}`, columnId: `c_${c}` }) as CellId
        const style = createCopyBorderStyle({
          currentRowIndex: r,
          totalRowLength,
          columnIndex: c,
          columnLength: colCount,
          prevStyle: {},
        })
        tbodyMap.set(cellId, style)
      }
    }

    const elapsed = performance.now() - start
    console.log(`  batch copy style 100×100: ${elapsed.toFixed(2)}ms`)

    expect(tbodyMap.size).toBe(10000)
    expect(elapsed).toBeLessThan(200)
  })
})
