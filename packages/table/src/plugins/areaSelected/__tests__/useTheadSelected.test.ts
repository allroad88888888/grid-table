import { describe, test, expect, beforeEach } from '@jest/globals'
import type { Store } from '@einfach/react';
import { createStore } from '@einfach/react'
import { columnIndexListAtom, headerRowIndexListAtom, rowIndexListAtom } from '@grid-table/basic'
import {
  areaCellIdsAtom,
  areaStartAtom,
  areaEndAtom,
  areaStartTypeAtom,
  areaEndTypeAtom,
} from '../state'
import { getCellId } from '../../../utils'

describe('useTheadLastRowColumnSelect functionality', () => {
  let store: Store
  beforeEach(() => {
    store = createStore()

    // 设置基本数据
    store.setter(columnIndexListAtom, ['column_0', 'column_1', 'column_2', 'column_3', 'column_4'])
    store.setter(rowIndexListAtom, ['row_0', 'row_1', 'row_2'])
    store.setter(headerRowIndexListAtom, ['head_row_0', 'head_row_1'])

    // 清理选择状态
    store.setter(areaStartAtom, { rowId: ' -1', columnId: '-1', cellId: '-1' })
    store.setter(areaEndAtom, { rowId: ' -1', columnId: '-1', cellId: '-1' })
    store.setter(areaStartTypeAtom, undefined)
    store.setter(areaEndTypeAtom, undefined)
  })

  test('single column selection: click thead last row should select entire column', () => {
    // 模拟点击表头最后一行（head_row_1）的某一列（column_2）
    const clickedPosition = {
      columnId: 'column_2',
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_2',
      }),
    }

    // 模拟用户点击逻辑（普通左键点击）
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    // 设置开始位置：thead 的点击位置
    store.setter(areaStartAtom, clickedPosition)

    // 设置结束位置：tbody 的最后一行，同一列
    store.setter(areaEndAtom, {
      columnId: 'column_2',
      rowId: 'row_2', // tbody 最后一行
      cellId: getCellId({
        columnId: 'column_2',
        rowId: 'row_2',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 验证选中了整列
    // thead 部分：从 head_row_1 到 head_row_1（最后一行）
    expect(cellTheadList).toEqual([[getCellId({ rowId: 'head_row_1', columnId: 'column_2' })]])

    // tbody 部分：从 row_0 到 row_2（最后一行），column_2
    expect(cellTbodyList).toEqual([
      [getCellId({ rowId: 'row_0', columnId: 'column_2' })],
      [getCellId({ rowId: 'row_1', columnId: 'column_2' })],
      [getCellId({ rowId: 'row_2', columnId: 'column_2' })],
    ])
  })

  test('multiple column selection: shift+click should select column range', () => {
    // 模拟 Shift+点击 选择多列

    // 第一次点击 column_1
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    store.setter(areaStartAtom, {
      columnId: 'column_1',
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_1',
      }),
    })

    // Shift+点击 column_3
    store.setter(areaEndAtom, {
      columnId: 'column_3',
      rowId: 'row_2', // tbody 最后一行
      cellId: getCellId({
        columnId: 'column_3',
        rowId: 'row_2',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 验证选中了从 column_1 到 column_3 的列范围
    // thead 部分：head_row_1 行，column_1 到 column_3
    expect(cellTheadList).toEqual([
      [
        getCellId({ rowId: 'head_row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_3' }),
      ],
    ])

    // tbody 部分：row_0 到 row_2，column_1 到 column_3
    expect(cellTbodyList).toEqual([
      [
        getCellId({ rowId: 'row_0', columnId: 'column_1' }),
        getCellId({ rowId: 'row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'row_0', columnId: 'column_3' }),
      ],
      [
        getCellId({ rowId: 'row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'row_1', columnId: 'column_3' }),
      ],
      [
        getCellId({ rowId: 'row_2', columnId: 'column_1' }),
        getCellId({ rowId: 'row_2', columnId: 'column_2' }),
        getCellId({ rowId: 'row_2', columnId: 'column_3' }),
      ],
    ])
  })

  test('first column selection', () => {
    // 测试选择第一列
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    store.setter(areaStartAtom, {
      columnId: 'column_0',
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_0',
      }),
    })

    store.setter(areaEndAtom, {
      columnId: 'column_0',
      rowId: 'row_2',
      cellId: getCellId({
        columnId: 'column_0',
        rowId: 'row_2',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    expect(cellTheadList).toEqual([[getCellId({ rowId: 'head_row_1', columnId: 'column_0' })]])

    expect(cellTbodyList).toEqual([
      [getCellId({ rowId: 'row_0', columnId: 'column_0' })],
      [getCellId({ rowId: 'row_1', columnId: 'column_0' })],
      [getCellId({ rowId: 'row_2', columnId: 'column_0' })],
    ])
  })

  test('last column selection', () => {
    // 测试选择最后一列
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    store.setter(areaStartAtom, {
      columnId: 'column_4',
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_4',
      }),
    })

    store.setter(areaEndAtom, {
      columnId: 'column_4',
      rowId: 'row_2',
      cellId: getCellId({
        columnId: 'column_4',
        rowId: 'row_2',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    expect(cellTheadList).toEqual([[getCellId({ rowId: 'head_row_1', columnId: 'column_4' })]])

    expect(cellTbodyList).toEqual([
      [getCellId({ rowId: 'row_0', columnId: 'column_4' })],
      [getCellId({ rowId: 'row_1', columnId: 'column_4' })],
      [getCellId({ rowId: 'row_2', columnId: 'column_4' })],
    ])
  })

  test('reverse column range selection', () => {
    // 测试反向列选择（从大到小）
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    // 从 column_3 开始
    store.setter(areaStartAtom, {
      columnId: 'column_3',
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_3',
      }),
    })

    // 到 column_1 结束
    store.setter(areaEndAtom, {
      columnId: 'column_1',
      rowId: 'row_2',
      cellId: getCellId({
        columnId: 'column_1',
        rowId: 'row_2',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 应该正确处理列的反向选择，包含 column_1, column_2, column_3
    expect(cellTheadList).toEqual([
      [
        getCellId({ rowId: 'head_row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_3' }),
      ],
    ])

    expect(cellTbodyList).toEqual([
      [
        getCellId({ rowId: 'row_0', columnId: 'column_1' }),
        getCellId({ rowId: 'row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'row_0', columnId: 'column_3' }),
      ],
      [
        getCellId({ rowId: 'row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'row_1', columnId: 'column_3' }),
      ],
      [
        getCellId({ rowId: 'row_2', columnId: 'column_1' }),
        getCellId({ rowId: 'row_2', columnId: 'column_2' }),
        getCellId({ rowId: 'row_2', columnId: 'column_3' }),
      ],
    ])
  })

  test('edge case: empty tbody', () => {
    // 测试边界情况：空的 tbody
    store.setter(rowIndexListAtom, []) // 清空 tbody

    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    store.setter(areaStartAtom, {
      columnId: 'column_1',
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_1',
      }),
    })

    // 由于 tbody 为空，这里不设置 areaEndAtom 或设置为空
    store.setter(areaEndAtom, {
      columnId: 'column_1',
      rowId: ' -1',
      cellId: '-1',
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 应该只有 thead 部分的选择
    expect(cellTheadList).toEqual([[getCellId({ rowId: 'head_row_1', columnId: 'column_1' })]])
    expect(cellTbodyList).toEqual([])
  })
})
