import { describe, test, expect } from '@jest/globals'
import { createStore, Store } from '@einfach/react'
import { columnIndexListAtom, headerRowIndexListAtom, rowIndexListAtom } from '@grid-table/basic'
import {
  areaStartAtom,
  areaEndAtom,
  areaStartTypeAtom,
  areaEndTypeAtom,
  areaSelectedTbodyCellSetAtom,
  areaSelectedTheadCellSetAtom,
  resetAreaAtom,
} from '../state'
import { getCellId } from '../../../utils'

function setupStore() {
  const store = createStore()
  store.setter(columnIndexListAtom, ['col_0', 'col_1', 'col_2', 'col_3'])
  store.setter(rowIndexListAtom, ['row_0', 'row_1', 'row_2', 'row_3'])
  store.setter(headerRowIndexListAtom, ['head_0', 'head_1'])
  return store
}

function selectTbody(
  store: Store,
  start: { row: string; col: string },
  end?: { row: string; col: string },
) {
  store.setter(areaStartTypeAtom, 'tbody')
  store.setter(areaStartAtom, {
    rowId: start.row,
    columnId: start.col,
    cellId: getCellId({ rowId: start.row, columnId: start.col }),
  })
  if (end) {
    store.setter(areaEndTypeAtom, 'tbody')
    store.setter(areaEndAtom, {
      rowId: end.row,
      columnId: end.col,
      cellId: getCellId({ rowId: end.row, columnId: end.col }),
    })
  }
}

function selectThead(
  store: Store,
  start: { row: string; col: string },
  end?: { row: string; col: string },
) {
  store.setter(areaStartTypeAtom, 'thead')
  store.setter(areaStartAtom, {
    rowId: start.row,
    columnId: start.col,
    cellId: getCellId({ rowId: start.row, columnId: start.col }),
  })
  if (end) {
    store.setter(areaEndTypeAtom, 'thead')
    store.setter(areaEndAtom, {
      rowId: end.row,
      columnId: end.col,
      cellId: getCellId({ rowId: end.row, columnId: end.col }),
    })
  }
}

describe('areaSelectedTbodyCellSetAtom', () => {
  let store: Store

  beforeEach(() => {
    store = setupStore()
  })

  test('empty when no selection', () => {
    const set = store.getter(areaSelectedTbodyCellSetAtom)
    expect(set.size).toBe(0)
  })

  test('single cell selection', () => {
    selectTbody(store, { row: 'row_0', col: 'col_0' })

    const set = store.getter(areaSelectedTbodyCellSetAtom)
    expect(set.size).toBe(1)
    expect(set.has(getCellId({ rowId: 'row_0', columnId: 'col_0' }))).toBe(true)
  })

  test('2x2 area selection', () => {
    selectTbody(
      store,
      { row: 'row_0', col: 'col_0' },
      { row: 'row_1', col: 'col_1' },
    )

    const set = store.getter(areaSelectedTbodyCellSetAtom)
    expect(set.size).toBe(4)
    expect(set.has(getCellId({ rowId: 'row_0', columnId: 'col_0' }))).toBe(true)
    expect(set.has(getCellId({ rowId: 'row_0', columnId: 'col_1' }))).toBe(true)
    expect(set.has(getCellId({ rowId: 'row_1', columnId: 'col_0' }))).toBe(true)
    expect(set.has(getCellId({ rowId: 'row_1', columnId: 'col_1' }))).toBe(true)
    // 不在选区内的 cell
    expect(set.has(getCellId({ rowId: 'row_2', columnId: 'col_0' }))).toBe(false)
  })

  test('3x4 full row selection', () => {
    selectTbody(
      store,
      { row: 'row_0', col: 'col_0' },
      { row: 'row_2', col: 'col_3' },
    )

    const set = store.getter(areaSelectedTbodyCellSetAtom)
    expect(set.size).toBe(12) // 3 rows × 4 cols
  })

  test('reverse selection (end before start)', () => {
    selectTbody(
      store,
      { row: 'row_2', col: 'col_2' },
      { row: 'row_0', col: 'col_0' },
    )

    const set = store.getter(areaSelectedTbodyCellSetAtom)
    expect(set.size).toBe(9) // 3 rows × 3 cols
    expect(set.has(getCellId({ rowId: 'row_0', columnId: 'col_0' }))).toBe(true)
    expect(set.has(getCellId({ rowId: 'row_2', columnId: 'col_2' }))).toBe(true)
  })

  test('reset clears selection', () => {
    selectTbody(
      store,
      { row: 'row_0', col: 'col_0' },
      { row: 'row_1', col: 'col_1' },
    )
    expect(store.getter(areaSelectedTbodyCellSetAtom).size).toBe(4)

    store.setter(resetAreaAtom)
    expect(store.getter(areaSelectedTbodyCellSetAtom).size).toBe(0)
  })

  test('thead selection does not affect tbody set', () => {
    selectThead(
      store,
      { row: 'head_0', col: 'col_0' },
      { row: 'head_1', col: 'col_1' },
    )

    const tbodySet = store.getter(areaSelectedTbodyCellSetAtom)
    expect(tbodySet.size).toBe(0)
  })
})

describe('areaSelectedTheadCellSetAtom', () => {
  let store: Store

  beforeEach(() => {
    store = setupStore()
  })

  test('empty when no selection', () => {
    const set = store.getter(areaSelectedTheadCellSetAtom)
    expect(set.size).toBe(0)
  })

  test('single thead cell selection', () => {
    selectThead(store, { row: 'head_0', col: 'col_0' })

    const set = store.getter(areaSelectedTheadCellSetAtom)
    expect(set.size).toBe(1)
    expect(set.has(getCellId({ rowId: 'head_0', columnId: 'col_0' }))).toBe(true)
  })

  test('2x2 thead area selection', () => {
    selectThead(
      store,
      { row: 'head_0', col: 'col_0' },
      { row: 'head_1', col: 'col_1' },
    )

    const set = store.getter(areaSelectedTheadCellSetAtom)
    expect(set.size).toBe(4)
  })

  test('tbody selection does not affect thead set', () => {
    selectTbody(
      store,
      { row: 'row_0', col: 'col_0' },
      { row: 'row_1', col: 'col_1' },
    )

    const theadSet = store.getter(areaSelectedTheadCellSetAtom)
    expect(theadSet.size).toBe(0)
  })
})

describe('cross-region selection sets', () => {
  let store: Store

  beforeEach(() => {
    store = setupStore()
  })

  test('thead to tbody: both sets populated', () => {
    // 从 thead 开始，到 tbody 结束
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaStartAtom, {
      rowId: 'head_0',
      columnId: 'col_0',
      cellId: getCellId({ rowId: 'head_0', columnId: 'col_0' }),
    })
    store.setter(areaEndTypeAtom, 'tbody')
    store.setter(areaEndAtom, {
      rowId: 'row_1',
      columnId: 'col_1',
      cellId: getCellId({ rowId: 'row_1', columnId: 'col_1' }),
    })

    const theadSet = store.getter(areaSelectedTheadCellSetAtom)
    const tbodySet = store.getter(areaSelectedTbodyCellSetAtom)

    // thead: head_0 ~ head_1, col_0 ~ col_1 = 2×2 = 4
    expect(theadSet.size).toBe(4)
    // tbody: row_0 ~ row_1, col_0 ~ col_1 = 2×2 = 4
    expect(tbodySet.size).toBe(4)
  })

  test('tbody to thead: both sets populated', () => {
    store.setter(areaStartTypeAtom, 'tbody')
    store.setter(areaStartAtom, {
      rowId: 'row_1',
      columnId: 'col_0',
      cellId: getCellId({ rowId: 'row_1', columnId: 'col_0' }),
    })
    store.setter(areaEndTypeAtom, 'thead')
    store.setter(areaEndAtom, {
      rowId: 'head_1',
      columnId: 'col_1',
      cellId: getCellId({ rowId: 'head_1', columnId: 'col_1' }),
    })

    const theadSet = store.getter(areaSelectedTheadCellSetAtom)
    const tbodySet = store.getter(areaSelectedTbodyCellSetAtom)

    // thead: head_1 ~ head_1, col_0 ~ col_1 = 1×2 = 2
    expect(theadSet.size).toBe(2)
    // tbody: row_0 ~ row_1, col_0 ~ col_1 = 2×2 = 4
    expect(tbodySet.size).toBe(4)
  })
})

describe('selection change correctness', () => {
  let store: Store

  beforeEach(() => {
    store = setupStore()
  })

  test('changing selection updates the set correctly', () => {
    // 第一次选择
    selectTbody(
      store,
      { row: 'row_0', col: 'col_0' },
      { row: 'row_0', col: 'col_1' },
    )
    let set = store.getter(areaSelectedTbodyCellSetAtom)
    expect(set.size).toBe(2)
    expect(set.has(getCellId({ rowId: 'row_0', columnId: 'col_0' }))).toBe(true)
    expect(set.has(getCellId({ rowId: 'row_0', columnId: 'col_1' }))).toBe(true)

    // 第二次选择不同区域
    selectTbody(
      store,
      { row: 'row_2', col: 'col_2' },
      { row: 'row_3', col: 'col_3' },
    )
    set = store.getter(areaSelectedTbodyCellSetAtom)
    expect(set.size).toBe(4)
    // 旧选区不再存在
    expect(set.has(getCellId({ rowId: 'row_0', columnId: 'col_0' }))).toBe(false)
    // 新选区存在
    expect(set.has(getCellId({ rowId: 'row_2', columnId: 'col_2' }))).toBe(true)
    expect(set.has(getCellId({ rowId: 'row_3', columnId: 'col_3' }))).toBe(true)
  })
})

describe('performance: Set atom vs per-cell setter', () => {
  test('large selection: Set atom is built efficiently', () => {
    const rowCount = 100
    const colCount = 100
    const rows = Array.from({ length: rowCount }, (_, i) => `r_${i}`)
    const cols = Array.from({ length: colCount }, (_, i) => `c_${i}`)

    const store = createStore()
    store.setter(rowIndexListAtom, rows)
    store.setter(columnIndexListAtom, cols)
    store.setter(headerRowIndexListAtom, ['h_0'])

    selectTbody(
      store,
      { row: 'r_0', col: 'c_0' },
      { row: `r_${rowCount - 1}`, col: `c_${colCount - 1}` },
    )

    const start = performance.now()
    const set = store.getter(areaSelectedTbodyCellSetAtom)
    const elapsed = performance.now() - start

    expect(set.size).toBe(rowCount * colCount)
    console.log(`  areaSelectedTbodyCellSetAtom (${rowCount}×${colCount}): ${elapsed.toFixed(2)}ms`)
    expect(elapsed).toBeLessThan(500)
  })
})
