import { describe, test, expect } from '@jest/globals'
import { formatToTable } from './../src/format/data/formatToTable'
import mockData, { dataList } from './mock/single-population-proportion.mock'

describe('pivot', () => {
  test('easy', () => {
    const res = formatToTable({
      fields: {
        rows: ['type', 'job'],
        columns: ['age', 'city'],
        values: ['count'],
        valueInCols: true,
      },
      meta: [
        {
          field: 'type',
          name: '类别',
        },
        {
          field: 'job',
          name: '职业',
        },
        {
          field: 'age',
          name: '年龄分布',
        },
        {
          field: 'city',
          name: '所在城市',
        },
        {
          field: 'count',
          name: '数值',
        },
      ],
      data: mockData.data,
    })
    expect(res.data).toStrictEqual(dataList)

    expect(res.headerData).toStrictEqual([
      {
        column1: '18岁以下',
        column10: '36岁到40岁',
        column2: '18岁以下',
        column3: '19岁到25岁',
        column4: '19岁到25岁',
        column5: '26岁到30岁',
        column6: '26岁到30岁',
        column7: '30岁到35岁',
        column8: '30岁到35岁',
        column9: '36岁到40岁',
        job: '年龄分布',
        type: '年龄分布',
      },
      {
        column1: '一二线城市',
        column10: '三四线城市',
        column2: '三四线城市',
        column3: '一二城市',
        column4: '三四线城市',
        column5: '一二城市',
        column6: '三四线城市',
        column7: '一二线城市',
        column8: '三四线城市',
        column9: '一二线城市',
        job: '所在城市',
        type: '所在城市',
      },
      {
        column1: '数值',
        column10: '数值',
        column2: '数值',
        column3: '数值',
        column4: '数值',
        column5: '数值',
        column6: '数值',
        column7: '数值',
        column8: '数值',
        column9: '数值',
        job: '职业',
        type: '类别',
      },
    ])
    expect(res.columns).toStrictEqual([
      'type',
      'job',
      'column1',
      'column2',
      'column3',
      'column4',
      'column5',
      'column6',
      'column7',
      'column8',
      'column9',
      'column10',
    ])

    expect(res.columnPropTree).toStrictEqual({
      '18岁以下': {
        children: {
          一二线城市: {
            children: { column1: { columnName: 'column1', label: '数值' } },
            columnName: 'city',
            label: '一二线城市',
          },
          三四线城市: {
            children: { column2: { columnName: 'column2', label: '数值' } },
            columnName: 'city',
            label: '三四线城市',
          },
        },
        columnName: 'age',
        label: '18岁以下',
      },
      '19岁到25岁': {
        children: {
          一二城市: {
            children: { column3: { columnName: 'column3', label: '数值' } },
            columnName: 'city',
            label: '一二城市',
          },
          三四线城市: {
            children: { column4: { columnName: 'column4', label: '数值' } },
            columnName: 'city',
            label: '三四线城市',
          },
        },
        columnName: 'age',
        label: '19岁到25岁',
      },
      '26岁到30岁': {
        children: {
          一二城市: {
            children: { column5: { columnName: 'column5', label: '数值' } },
            columnName: 'city',
            label: '一二城市',
          },
          三四线城市: {
            children: { column6: { columnName: 'column6', label: '数值' } },
            columnName: 'city',
            label: '三四线城市',
          },
        },
        columnName: 'age',
        label: '26岁到30岁',
      },
      '30岁到35岁': {
        children: {
          一二线城市: {
            children: { column7: { columnName: 'column7', label: '数值' } },
            columnName: 'city',
            label: '一二线城市',
          },
          三四线城市: {
            children: { column8: { columnName: 'column8', label: '数值' } },
            columnName: 'city',
            label: '三四线城市',
          },
        },
        columnName: 'age',
        label: '30岁到35岁',
      },
      '36岁到40岁': {
        children: {
          一二线城市: {
            children: { column9: { columnName: 'column9', label: '数值' } },
            columnName: 'city',
            label: '一二线城市',
          },
          三四线城市: {
            children: { column10: { columnName: 'column10', label: '数值' } },
            columnName: 'city',
            label: '三四线城市',
          },
        },
        columnName: 'age',
        label: '36岁到40岁',
      },
    })

    expect(res.headerColumns).toStrictEqual(['headerColumn0', 'headerColumn1', 'headerColumn2'])

    expect(res.headerMergeCellList).toStrictEqual([
      { cellId: '0||type', colIdList: ['job'], rowIdList: [] },
      { cellId: '0||column1', colIdList: ['column2'], rowIdList: [] },
      { cellId: '0||column3', colIdList: ['column4'], rowIdList: [] },
      { cellId: '0||column5', colIdList: ['column6'], rowIdList: [] },
      { cellId: '0||column7', colIdList: ['column8'], rowIdList: [] },
      { cellId: '0||column9', colIdList: ['column10'], rowIdList: [] },
      { cellId: '1||type', colIdList: ['job'], rowIdList: [] },
    ])

    expect(res.bodyMergeCelList).toStrictEqual([
      { cellId: '0||type', colIdList: [], rowIdList: ['1', '2', '3'] },
      { cellId: '4||type', colIdList: [], rowIdList: ['5', '6', '7'] },
      { cellId: '8||type', colIdList: [], rowIdList: ['9', '10', '11'] },
    ])
  })
})
