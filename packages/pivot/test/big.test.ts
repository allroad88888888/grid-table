import { describe, test, expect } from '@jest/globals'
import { formatToTable } from './../src/format/data/formatToTable'
import mockData, { columns, headerData } from './mock/big.mock'

describe('pivot', () => {
  test('easy', () => {
    const res = formatToTable(mockData)

    expect(res.columns).toStrictEqual(columns)

    expect(res.columnPropTree).toStrictEqual({
      '2024': {
        children: {
          '1': {
            children: { column1: { columnName: 'column1', label: 'sum_of_amount' } },
            columnName: '月',
            label: '1',
          },
          '10': {
            children: { column2: { columnName: 'column2', label: 'sum_of_amount' } },
            columnName: '月',
            label: '10',
          },
          '11': {
            children: { column3: { columnName: 'column3', label: 'sum_of_amount' } },
            columnName: '月',
            label: '11',
          },
          '12': {
            children: { column4: { columnName: 'column4', label: 'sum_of_amount' } },
            columnName: '月',
            label: '12',
          },
          '2': {
            children: { column5: { columnName: 'column5', label: 'sum_of_amount' } },
            columnName: '月',
            label: '2',
          },
          '3': {
            children: { column6: { columnName: 'column6', label: 'sum_of_amount' } },
            columnName: '月',
            label: '3',
          },
          '4': {
            children: { column7: { columnName: 'column7', label: 'sum_of_amount' } },
            columnName: '月',
            label: '4',
          },
          '5': {
            children: { column8: { columnName: 'column8', label: 'sum_of_amount' } },
            columnName: '月',
            label: '5',
          },
          '6': {
            children: { column9: { columnName: 'column9', label: 'sum_of_amount' } },
            columnName: '月',
            label: '6',
          },
          '7': {
            children: { column10: { columnName: 'column10', label: 'sum_of_amount' } },
            columnName: '月',
            label: '7',
          },
          '8': {
            children: { column11: { columnName: 'column11', label: 'sum_of_amount' } },
            columnName: '月',
            label: '8',
          },
          '9': {
            children: { column12: { columnName: 'column12', label: 'sum_of_amount' } },
            columnName: '月',
            label: '9',
          },
        },
        columnName: '财年',
        label: '2024',
      },
      '2025': {
        children: {
          '1': {
            children: { column13: { columnName: 'column13', label: 'sum_of_amount' } },
            columnName: '月',
            label: '1',
          },
          '10': {
            children: { column14: { columnName: 'column14', label: 'sum_of_amount' } },
            columnName: '月',
            label: '10',
          },
          '11': {
            children: { column15: { columnName: 'column15', label: 'sum_of_amount' } },
            columnName: '月',
            label: '11',
          },
          '12': {
            children: { column16: { columnName: 'column16', label: 'sum_of_amount' } },
            columnName: '月',
            label: '12',
          },
          '2': {
            children: { column17: { columnName: 'column17', label: 'sum_of_amount' } },
            columnName: '月',
            label: '2',
          },
          '3': {
            children: { column18: { columnName: 'column18', label: 'sum_of_amount' } },
            columnName: '月',
            label: '3',
          },
          '4': {
            children: { column19: { columnName: 'column19', label: 'sum_of_amount' } },
            columnName: '月',
            label: '4',
          },
          '5': {
            children: { column20: { columnName: 'column20', label: 'sum_of_amount' } },
            columnName: '月',
            label: '5',
          },
          '6': {
            children: { column21: { columnName: 'column21', label: 'sum_of_amount' } },
            columnName: '月',
            label: '6',
          },
          '7': {
            children: { column22: { columnName: 'column22', label: 'sum_of_amount' } },
            columnName: '月',
            label: '7',
          },
          '8': {
            children: { column23: { columnName: 'column23', label: 'sum_of_amount' } },
            columnName: '月',
            label: '8',
          },
          '9': {
            children: { column24: { columnName: 'column24', label: 'sum_of_amount' } },
            columnName: '月',
            label: '9',
          },
        },
        columnName: '财年',
        label: '2025',
      },
    })

    expect(res.headerData).toStrictEqual(headerData)

    expect(res.headerColumns).toStrictEqual(['headerColumn0', 'headerColumn1', 'headerColumn2'])

    expect(res.headerMergeCellList).toStrictEqual([
      {
        cellId: '0||岗位编号',
        colIdList: ['岗位名称', '员工编号', '员工姓名', '入职时间', '离职时间'],
        rowIdList: [],
      },
      {
        cellId: '0||column1',
        colIdList: [
          'column2',
          'column3',
          'column4',
          'column5',
          'column6',
          'column7',
          'column8',
          'column9',
          'column10',
          'column11',
          'column12',
        ],
        rowIdList: [],
      },
      {
        cellId: '0||column13',
        colIdList: [
          'column14',
          'column15',
          'column16',
          'column17',
          'column18',
          'column19',
          'column20',
          'column21',
          'column22',
          'column23',
          'column24',
        ],
        rowIdList: [],
      },
      {
        cellId: '1||岗位编号',
        colIdList: ['岗位名称', '员工编号', '员工姓名', '入职时间', '离职时间'],
        rowIdList: [],
      },
    ])

    expect(res.bodyMergeCelList).toStrictEqual([])
  })
})
