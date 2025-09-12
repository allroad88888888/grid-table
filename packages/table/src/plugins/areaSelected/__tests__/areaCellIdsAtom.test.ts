import { describe, test, expect } from '@jest/globals'
import { createStore, Store } from '@einfach/react'
import { columnIndexListAtom, headerRowIndexListAtom, rowIndexListAtom } from '@grid-table/basic'
import {
  areaCellIdsAtom,
  areaEndTypeAtom,
  areaStartTypeAtom,
  areaStartAtom,
  areaEndAtom,
} from '../state'
import { getCellId } from '../../../utils'

describe('get area cellIds', () => {
  let store: Store
  beforeEach(() => {
    store = createStore()

    store.setter(columnIndexListAtom, ['column_0', 'column_1', 'column_2'])
    store.setter(rowIndexListAtom, ['row_0', 'row_1', 'row_2'])
    store.setter(headerRowIndexListAtom, ['head_row_0', 'head_row_1', 'head_row_2'])
  })

  test('only one tbody cell ', () => {
    store.setter(areaStartTypeAtom, 'tbody')
    store.setter(areaStartAtom, {
      columnId: 'column_0',
      rowId: 'row_0',
      cellId: getCellId({
        rowId: 'row_0',
        columnId: 'column_0',
      }),
    })

    const { cellTbodyList } = store.getter(areaCellIdsAtom)

    expect(cellTbodyList).toEqual([
      [
        getCellId({
          rowId: 'row_0',
          columnId: 'column_0',
        }),
      ],
    ])
  })

  test('only one thead cell ', () => {
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaStartAtom, {
      columnId: 'column_0',
      rowId: 'head_row_0',
      cellId: getCellId({
        rowId: 'head_row_0',
        columnId: 'column_0',
      }),
    })

    const { cellTheadList } = store.getter(areaCellIdsAtom)

    expect(cellTheadList).toEqual([
      [
        getCellId({
          rowId: 'head_row_0',
          columnId: 'column_0',
        }),
      ],
    ])
  })

  test('more tbody cell ', () => {
    store.setter(areaStartTypeAtom, 'tbody')
    store.setter(areaEndTypeAtom, 'tbody')
    store.setter(areaStartAtom, {
      columnId: 'column_0',
      rowId: 'row_0',
      cellId: getCellId({
        rowId: 'row_0',
        columnId: 'column_0',
      }),
    })

    store.setter(areaEndAtom, {
      columnId: 'column_2',
      rowId: 'row_2',
      cellId: getCellId({
        rowId: 'row_2',
        columnId: 'column_2',
      }),
    })

    const { cellTbodyList } = store.getter(areaCellIdsAtom)

    expect(cellTbodyList).toEqual([
      [
        getCellId({
          rowId: 'row_0',
          columnId: 'column_0',
        }),
        getCellId({
          rowId: 'row_0',
          columnId: 'column_1',
        }),
        getCellId({
          rowId: 'row_0',
          columnId: 'column_2',
        }),
      ],
      [
        getCellId({
          rowId: 'row_1',
          columnId: 'column_0',
        }),
        getCellId({
          rowId: 'row_1',
          columnId: 'column_1',
        }),
        getCellId({
          rowId: 'row_1',
          columnId: 'column_2',
        }),
      ],
      [
        getCellId({
          rowId: 'row_2',
          columnId: 'column_0',
        }),
        getCellId({
          rowId: 'row_2',
          columnId: 'column_1',
        }),
        getCellId({
          rowId: 'row_2',
          columnId: 'column_2',
        }),
      ],
    ])
  })

  test('more thead cell ', () => {
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'thead')
    store.setter(areaStartAtom, {
      columnId: 'column_0',
      rowId: 'head_row_0',
      cellId: getCellId({
        rowId: 'head_row_0',
        columnId: 'column_0',
      }),
    })

    store.setter(areaEndAtom, {
      columnId: 'column_2',
      rowId: 'head_row_2',
      cellId: getCellId({
        rowId: 'head_row_2',
        columnId: 'column_2',
      }),
    })

    const { cellTheadList } = store.getter(areaCellIdsAtom)

    expect(cellTheadList).toEqual([
      [
        getCellId({
          rowId: 'head_row_0',
          columnId: 'column_0',
        }),
        getCellId({
          rowId: 'head_row_0',
          columnId: 'column_1',
        }),
        getCellId({
          rowId: 'head_row_0',
          columnId: 'column_2',
        }),
      ],
      [
        getCellId({
          rowId: 'head_row_1',
          columnId: 'column_0',
        }),
        getCellId({
          rowId: 'head_row_1',
          columnId: 'column_1',
        }),
        getCellId({
          rowId: 'head_row_1',
          columnId: 'column_2',
        }),
      ],
      [
        getCellId({
          rowId: 'head_row_2',
          columnId: 'column_0',
        }),
        getCellId({
          rowId: 'head_row_2',
          columnId: 'column_1',
        }),
        getCellId({
          rowId: 'head_row_2',
          columnId: 'column_2',
        }),
      ],
    ])
  })
})
