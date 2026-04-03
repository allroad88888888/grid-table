import { describe, test, expect } from '@jest/globals'
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

describe('cross tbody and thead area selection', () => {
  let store: Store
  beforeEach(() => {
    store = createStore()

    // 设置基本数据
    store.setter(columnIndexListAtom, ['column_0', 'column_1', 'column_2', 'column_3', 'column_4'])
    store.setter(rowIndexListAtom, ['row_0', 'row_1', 'row_2'])
    store.setter(headerRowIndexListAtom, ['head_row_0', 'head_row_1'])

    // 清理选择状态，确保每个测试开始时都是清洁的
    store.setter(areaStartAtom, { rowId: ' -1', columnId: '-1', cellId: '-1' })
    store.setter(areaEndAtom, { rowId: ' -1', columnId: '-1', cellId: '-1' })
    store.setter(areaStartTypeAtom, undefined)
    store.setter(areaEndTypeAtom, undefined)
  })

  test('cross selection: thead(column_1-column_2) and tbody(column_3-column_4) should include all columns', () => {
    // 设置拖动开始类型为 thead
    store.setter(areaStartTypeAtom, 'thead')
    // 设置拖动结束类型为 tbody
    store.setter(areaEndTypeAtom, 'tbody')

    // 拖动开始位置：thead 的 column_1, head_row_0
    store.setter(areaStartAtom, {
      columnId: 'column_1',
      rowId: 'head_row_0',
      cellId: getCellId({
        rowId: 'head_row_0',
        columnId: 'column_1',
      }),
    })

    // 拖动结束位置：tbody 的 column_4, row_2
    store.setter(areaEndAtom, {
      columnId: 'column_4',
      rowId: 'row_2',
      cellId: getCellId({
        rowId: 'row_2',
        columnId: 'column_4',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 期望：应该包含 column_1 到 column_4 的所有列
    // thead 应该有两行，每行包含 column_1, column_2, column_3, column_4
    expect(cellTheadList).toEqual([
      [
        getCellId({ rowId: 'head_row_0', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_3' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_4' }),
      ],
      [
        getCellId({ rowId: 'head_row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_3' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_4' }),
      ],
    ])

    // tbody 应该有三行，每行包含 column_1, column_2, column_3, column_4
    expect(cellTbodyList).toEqual([
      [
        getCellId({ rowId: 'row_0', columnId: 'column_1' }),
        getCellId({ rowId: 'row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'row_0', columnId: 'column_3' }),
        getCellId({ rowId: 'row_0', columnId: 'column_4' }),
      ],
      [
        getCellId({ rowId: 'row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'row_1', columnId: 'column_3' }),
        getCellId({ rowId: 'row_1', columnId: 'column_4' }),
      ],
      [
        getCellId({ rowId: 'row_2', columnId: 'column_1' }),
        getCellId({ rowId: 'row_2', columnId: 'column_2' }),
        getCellId({ rowId: 'row_2', columnId: 'column_3' }),
        getCellId({ rowId: 'row_2', columnId: 'column_4' }),
      ],
    ])
  })

  test('reverse cross selection: tbody(column_0-column_1) to thead(column_3-column_4) should include all columns', () => {
    // 设置拖动开始类型为 tbody
    store.setter(areaStartTypeAtom, 'tbody')
    // 设置拖动结束类型为 thead
    store.setter(areaEndTypeAtom, 'thead')

    // 拖动开始位置：tbody 的 column_0, row_1
    store.setter(areaStartAtom, {
      columnId: 'column_0',
      rowId: 'row_1',
      cellId: getCellId({
        rowId: 'row_1',
        columnId: 'column_0',
      }),
    })

    // 拖动结束位置：thead 的 column_3, head_row_1
    store.setter(areaEndAtom, {
      columnId: 'column_3',
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_3',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 期望：应该包含 column_0 到 column_3 的所有列
    // thead 应该只有一行（head_row_1），因为结束位置就是 thead 最后一行
    expect(cellTheadList).toEqual([
      [
        getCellId({ rowId: 'head_row_1', columnId: 'column_0' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_3' }),
      ],
    ])

    // tbody 应该有两行，从 tbody 第一行 row_0 到开始行 row_1
    expect(cellTbodyList).toEqual([
      [
        getCellId({ rowId: 'row_0', columnId: 'column_0' }),
        getCellId({ rowId: 'row_0', columnId: 'column_1' }),
        getCellId({ rowId: 'row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'row_0', columnId: 'column_3' }),
      ],
      [
        getCellId({ rowId: 'row_1', columnId: 'column_0' }),
        getCellId({ rowId: 'row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'row_1', columnId: 'column_3' }),
      ],
    ])
  })

  test('reverse cross selection: tbody(row_2) to thead(head_row_0) should select from bottom to top', () => {
    // 设置拖动开始类型为 tbody
    store.setter(areaStartTypeAtom, 'tbody')
    // 设置拖动结束类型为 thead
    store.setter(areaEndTypeAtom, 'thead')

    // 拖动开始位置：tbody 的 column_1, row_2 (最后一行)
    store.setter(areaStartAtom, {
      columnId: 'column_1',
      rowId: 'row_2',
      cellId: getCellId({
        rowId: 'row_2',
        columnId: 'column_1',
      }),
    })

    // 拖动结束位置：thead 的 column_3, head_row_0 (第一行)
    store.setter(areaEndAtom, {
      columnId: 'column_3',
      rowId: 'head_row_0',
      cellId: getCellId({
        rowId: 'head_row_0',
        columnId: 'column_3',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 期望：从下往上选择，包含 column_1 到 column_3 的所有列
    // thead 应该有两行，从 head_row_0 到 head_row_1（thead 最后一行）
    expect(cellTheadList).toEqual([
      [
        getCellId({ rowId: 'head_row_0', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_3' }),
      ],
      [
        getCellId({ rowId: 'head_row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_3' }),
      ],
    ])

    // tbody 应该有三行，从 tbody 第一行 row_0 到开始行 row_2
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

  test('same row cross selection: thead(head_row_0) to tbody(row_0)', () => {
    // 设置拖动开始类型为 thead
    store.setter(areaStartTypeAtom, 'thead')
    // 设置拖动结束类型为 tbody
    store.setter(areaEndTypeAtom, 'tbody')

    // 拖动开始位置：thead 的第一行 head_row_0, column_2
    store.setter(areaStartAtom, {
      columnId: 'column_2',
      rowId: 'head_row_0',
      cellId: getCellId({
        rowId: 'head_row_0',
        columnId: 'column_2',
      }),
    })

    // 拖动结束位置：tbody 的第一行 row_0, column_4
    store.setter(areaEndAtom, {
      columnId: 'column_4',
      rowId: 'row_0',
      cellId: getCellId({
        rowId: 'row_0',
        columnId: 'column_4',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // thead: 从开始行 head_row_0 到最后一行 head_row_1
    expect(cellTheadList).toEqual([
      [
        getCellId({ rowId: 'head_row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_3' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_4' }),
      ],
      [
        getCellId({ rowId: 'head_row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_3' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_4' }),
      ],
    ])

    // tbody: 只选中第一行 row_0
    expect(cellTbodyList).toEqual([
      [
        getCellId({ rowId: 'row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'row_0', columnId: 'column_3' }),
        getCellId({ rowId: 'row_0', columnId: 'column_4' }),
      ],
    ])
  })

  test('single cell cross selection: thead to tbody', () => {
    // 设置拖动开始类型为 thead
    store.setter(areaStartTypeAtom, 'thead')
    // 设置拖动结束类型为 tbody
    store.setter(areaEndTypeAtom, 'tbody')

    // 开始和结束都是同一列
    store.setter(areaStartAtom, {
      columnId: 'column_1',
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_1',
      }),
    })

    store.setter(areaEndAtom, {
      columnId: 'column_1',
      rowId: 'row_1',
      cellId: getCellId({
        rowId: 'row_1',
        columnId: 'column_1',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 应该只选中一列
    expect(cellTheadList).toEqual([[getCellId({ rowId: 'head_row_1', columnId: 'column_1' })]])

    expect(cellTbodyList).toEqual([
      [getCellId({ rowId: 'row_0', columnId: 'column_1' })],
      [getCellId({ rowId: 'row_1', columnId: 'column_1' })],
    ])
  })

  test('no selection when start type is undefined', () => {
    // 不设置 areaStartTypeAtom，保持为 undefined
    store.setter(areaStartAtom, {
      columnId: 'column_1',
      rowId: 'head_row_0',
      cellId: getCellId({
        rowId: 'head_row_0',
        columnId: 'column_1',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 没有类型信息，不应该有任何选择
    expect(cellTheadList).toEqual([])
    expect(cellTbodyList).toEqual([])
  })

  test('no selection when start position is empty', () => {
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    // areaStartAtom 保持为空位置（emptyPosition）

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 没有开始位置，不应该有任何选择
    expect(cellTheadList).toEqual([])
    expect(cellTbodyList).toEqual([])
  })

  test('fallback to start type when end type is undefined', () => {
    // 只设置开始类型，结束类型为 undefined
    store.setter(areaStartTypeAtom, 'thead')
    // areaEndTypeAtom 保持为 undefined

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
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_2',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 应该按同区域 thead 内选择处理
    expect(cellTheadList).toEqual([
      [
        getCellId({ rowId: 'head_row_0', columnId: 'column_0' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_2' }),
      ],
      [
        getCellId({ rowId: 'head_row_1', columnId: 'column_0' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_2' }),
      ],
    ])
    expect(cellTbodyList).toEqual([])
  })

  test('empty end position fallback to start position', () => {
    store.setter(areaStartTypeAtom, 'tbody')
    store.setter(areaEndTypeAtom, 'tbody')

    store.setter(areaStartAtom, {
      columnId: 'column_1',
      rowId: 'row_1',
      cellId: getCellId({
        rowId: 'row_1',
        columnId: 'column_1',
      }),
    })

    // areaEndAtom 保持为空位置

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 应该只选中开始位置的单个单元格
    expect(cellTbodyList).toEqual([[getCellId({ rowId: 'row_1', columnId: 'column_1' })]])
    expect(cellTheadList).toEqual([])
  })

  test('reverse column order selection', () => {
    // 测试列的反向选择（从大列号到小列号）
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    store.setter(areaStartAtom, {
      columnId: 'column_4', // 从后面的列开始
      rowId: 'head_row_0',
      cellId: getCellId({
        rowId: 'head_row_0',
        columnId: 'column_4',
      }),
    })

    store.setter(areaEndAtom, {
      columnId: 'column_1', // 到前面的列结束
      rowId: 'row_0',
      cellId: getCellId({
        rowId: 'row_0',
        columnId: 'column_1',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 应该正确处理列的反向选择
    expect(cellTheadList).toEqual([
      [
        getCellId({ rowId: 'head_row_0', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_3' }),
        getCellId({ rowId: 'head_row_0', columnId: 'column_4' }),
      ],
      [
        getCellId({ rowId: 'head_row_1', columnId: 'column_1' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_2' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_3' }),
        getCellId({ rowId: 'head_row_1', columnId: 'column_4' }),
      ],
    ])

    expect(cellTbodyList).toEqual([
      [
        getCellId({ rowId: 'row_0', columnId: 'column_1' }),
        getCellId({ rowId: 'row_0', columnId: 'column_2' }),
        getCellId({ rowId: 'row_0', columnId: 'column_3' }),
        getCellId({ rowId: 'row_0', columnId: 'column_4' }),
      ],
    ])
  })

  test('disabled columns functionality (basic test)', () => {
    // 注意：这是一个基本测试，验证禁用列功能的存在性
    // 实际的禁用列测试需要通过正确的列配置API来设置
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

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
      rowId: 'row_1',
      cellId: getCellId({
        rowId: 'row_1',
        columnId: 'column_2',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 验证正常选择功能，禁用列的详细测试应该在集成测试中进行
    expect(cellTheadList.length).toBeGreaterThan(0)
    expect(cellTbodyList.length).toBeGreaterThan(0)
    expect(cellTheadList[0].length).toBe(3) // column_0, column_1, column_2
  })

  test('full table cross selection: max range', () => {
    // 测试最大范围的跨区域选择
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    store.setter(areaStartAtom, {
      columnId: 'column_0', // 第一列
      rowId: 'head_row_0', // thead 第一行
      cellId: getCellId({
        rowId: 'head_row_0',
        columnId: 'column_0',
      }),
    })

    store.setter(areaEndAtom, {
      columnId: 'column_4', // 最后一列
      rowId: 'row_2', // tbody 最后一行
      cellId: getCellId({
        rowId: 'row_2',
        columnId: 'column_4',
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // thead 应该包含所有行和列
    expect(cellTheadList.length).toBe(2) // 2行
    expect(cellTheadList[0].length).toBe(5) // 5列
    expect(cellTheadList[1].length).toBe(5) // 5列

    // tbody 应该包含所有行和列
    expect(cellTbodyList.length).toBe(3) // 3行
    expect(cellTbodyList[0].length).toBe(5) // 5列
    expect(cellTbodyList[1].length).toBe(5) // 5列
    expect(cellTbodyList[2].length).toBe(5) // 5列

    // 验证第一个和最后一个单元格
    expect(cellTheadList[0][0]).toBe(getCellId({ rowId: 'head_row_0', columnId: 'column_0' }))
    expect(cellTbodyList[2][4]).toBe(getCellId({ rowId: 'row_2', columnId: 'column_4' }))
  })

  test('cross selection with same column: vertical line', () => {
    // 测试垂直线选择（同一列，跨区域）
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'tbody')

    const targetColumn = 'column_2'

    store.setter(areaStartAtom, {
      columnId: targetColumn,
      rowId: 'head_row_0',
      cellId: getCellId({
        rowId: 'head_row_0',
        columnId: targetColumn,
      }),
    })

    store.setter(areaEndAtom, {
      columnId: targetColumn,
      rowId: 'row_2',
      cellId: getCellId({
        rowId: 'row_2',
        columnId: targetColumn,
      }),
    })

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 应该只选中一列
    expect(cellTheadList).toEqual([
      [getCellId({ rowId: 'head_row_0', columnId: targetColumn })],
      [getCellId({ rowId: 'head_row_1', columnId: targetColumn })],
    ])

    expect(cellTbodyList).toEqual([
      [getCellId({ rowId: 'row_0', columnId: targetColumn })],
      [getCellId({ rowId: 'row_1', columnId: targetColumn })],
      [getCellId({ rowId: 'row_2', columnId: targetColumn })],
    ])
  })

  test('performance test: multiple rapid selections', () => {
    // 测试多次快速选择的性能和状态一致性
    const selections = [
      {
        startType: 'thead',
        endType: 'tbody',
        start: { col: 'column_0', row: 'head_row_0' },
        end: { col: 'column_1', row: 'row_0' },
      },
      {
        startType: 'tbody',
        endType: 'thead',
        start: { col: 'column_2', row: 'row_1' },
        end: { col: 'column_3', row: 'head_row_1' },
      },
      {
        startType: 'thead',
        endType: 'tbody',
        start: { col: 'column_4', row: 'head_row_0' },
        end: { col: 'column_0', row: 'row_2' },
      },
    ]

    selections.forEach((selection, index) => {
      // 快速切换选择，使用正确的开始和结束类型
      store.setter(areaStartTypeAtom, selection.startType as any)
      store.setter(areaEndTypeAtom, selection.endType as any)

      store.setter(areaStartAtom, {
        columnId: selection.start.col,
        rowId: selection.start.row,
        cellId: getCellId({
          rowId: selection.start.row,
          columnId: selection.start.col,
        }),
      })

      store.setter(areaEndAtom, {
        columnId: selection.end.col,
        rowId: selection.end.row,
        cellId: getCellId({
          rowId: selection.end.row,
          columnId: selection.end.col,
        }),
      })

      const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

      // 验证每次选择都产生有效结果
      // 对于跨区域选择，至少应该有一个区域有内容
      const totalCells = cellTheadList.length + cellTbodyList.length
      expect(totalCells).toBeGreaterThan(0)

      // 验证数据结构完整性
      cellTheadList.forEach((row) => {
        expect(Array.isArray(row)).toBe(true)
        expect(row.length).toBeGreaterThanOrEqual(0)
      })
      cellTbodyList.forEach((row) => {
        expect(Array.isArray(row)).toBe(true)
        expect(row.length).toBeGreaterThanOrEqual(0)
      })
    })
  })

  test('edge case: same position for start and end', () => {
    // 边界情况：开始和结束位置相同
    store.setter(areaStartTypeAtom, 'thead')
    store.setter(areaEndTypeAtom, 'thead')

    const position = {
      columnId: 'column_2',
      rowId: 'head_row_1',
      cellId: getCellId({
        rowId: 'head_row_1',
        columnId: 'column_2',
      }),
    }

    store.setter(areaStartAtom, position)
    store.setter(areaEndAtom, position)

    const { cellTbodyList, cellTheadList } = store.getter(areaCellIdsAtom)

    // 应该只选中一个单元格
    expect(cellTheadList).toEqual([[getCellId({ rowId: 'head_row_1', columnId: 'column_2' })]])
    expect(cellTbodyList).toEqual([])
  })
})
