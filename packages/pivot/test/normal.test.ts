import { describe, test, expect } from '@jest/globals'
import { formatToTable } from './../src/format/data/formatToTable'
import mockData, { dataList } from './mock/normal.mock'

describe('pivot', () => {
  test('easy', () => {
    const res = formatToTable(mockData)
    expect(res.data).toStrictEqual(dataList)
    expect(res.columns).toStrictEqual([
      'province',
      'city',
      'column1',
      'column2',
      'column3',
      'column4',
    ])

    expect(res.columnPropTree).toStrictEqual({
      办公用品: {
        children: {
          笔: {
            children: { column3: { columnName: 'column3', label: '数量' } },
            columnName: 'sub_type',
            label: '笔',
          },
          纸张: {
            children: { column4: { columnName: 'column4', label: '数量' } },
            columnName: 'sub_type',
            label: '纸张',
          },
        },
        columnName: 'type',
        label: '办公用品',
      },
      家具: {
        children: {
          桌子: {
            children: { column1: { columnName: 'column1', label: '数量' } },
            columnName: 'sub_type',
            label: '桌子',
          },
          沙发: {
            children: { column2: { columnName: 'column2', label: '数量' } },
            columnName: 'sub_type',
            label: '沙发',
          },
        },
        columnName: 'type',
        label: '家具',
      },
    })

    expect(res.headerData).toStrictEqual([
      {
        city: '商品类别',
        column1: '家具',
        column2: '家具',
        column3: '办公用品',
        column4: '办公用品',
        province: '商品类别',
      },
      {
        city: '子类别',
        column1: '桌子',
        column2: '沙发',
        column3: '笔',
        column4: '纸张',
        province: '子类别',
      },
      {
        city: '城市',
        column1: '数量',
        column2: '数量',
        column3: '数量',
        column4: '数量',
        province: '省份',
      },
    ])

    expect(res.headerColumns).toStrictEqual(['headerColumn0', 'headerColumn1', 'headerColumn2'])

    expect(res.headerMergeCellList).toStrictEqual([
      { cellId: '0||province', colIdList: ['city'], rowIdList: [] },
      { cellId: '0||column1', colIdList: ['column2'], rowIdList: [] },
      { cellId: '0||column3', colIdList: ['column4'], rowIdList: [] },
      { cellId: '1||province', colIdList: ['city'], rowIdList: [] },
    ])

    expect(res.bodyMergeCelList).toStrictEqual([
      { cellId: '0||province', colIdList: [], rowIdList: ['1', '2', '3'] },
      { cellId: '4||province', colIdList: [], rowIdList: ['5', '6', '7'] },
    ])
  })
})
