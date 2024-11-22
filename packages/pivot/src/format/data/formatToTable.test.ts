import { describe, test, expect } from '@jest/globals'
import { formatToTable } from './formatToTable'
import { mockDataConfig } from './easy.mock'
import { getCellId } from '@grid-table/view'

describe('pivot', () => {
  test('easy', () => {
    const res = formatToTable(mockDataConfig)
    expect(res.data).toStrictEqual([
      {
        city: '杭州市',
        column1: 7789,
        column2: 5343,
        column3: 945,
        column4: 1343,
        province: '浙江省',
      },
      {
        city: '绍兴市',
        column1: 2367,
        column2: 632,
        column3: 1304,
        column4: 1354,
        province: '浙江省',
      },
      {
        city: '宁波市',
        column1: 3877,
        column2: 7234,
        column3: 1145,
        column4: 1523,
        province: '浙江省',
      },
      {
        city: '舟山市',
        column1: 4342,
        column2: 834,
        column3: 1432,
        column4: 1634,
        province: '浙江省',
      },
      {
        city: '成都市',
        column1: 1723,
        column2: 2451,
        column3: 2335,
        column4: 4004,
        province: '四川省',
      },
      {
        city: '绵阳市',
        column1: 1822,
        column2: 2244,
        column3: 245,
        column4: 3077,
        province: '四川省',
      },
      {
        city: '南充市',
        column1: 1943,
        column2: 2333,
        column3: 2457,
        column4: 3551,
        province: '四川省',
      },
      {
        city: '乐山市',
        column1: 2330,
        column2: 2445,
        column3: 2458,
        column4: 352,
        province: '四川省',
      },
    ])

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
        city: '省份',
        column1: '数量',
        column2: '数量',
        column3: '数量',
        column4: '数量',
        province: '城市',
      },
    ])
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
        label: '办公用品',
        columnName: 'type',
        children: {
          笔: {
            label: '笔',
            columnName: 'sub_type',
            children: { column3: { label: '数量', columnName: 'column3' } },
          },
          纸张: {
            label: '纸张',
            columnName: 'sub_type',
            children: { column4: { label: '数量', columnName: 'column4' } },
          },
        },
      },
      家具: {
        label: '家具',
        columnName: 'type',
        children: {
          桌子: {
            label: '桌子',
            columnName: 'sub_type',
            children: { column1: { label: '数量', columnName: 'column1' } },
          },
          沙发: {
            label: '沙发',
            columnName: 'sub_type',

            children: { column2: { label: '数量', columnName: 'column2' } },
          },
        },
      },
    })

    expect(res.headerColumns).toStrictEqual(['headerColumn0', 'headerColumn1', 'headerColumn2'])

    expect(res.headerMergeCellList).toStrictEqual([
      {
        cellId: getCellId({
          rowId: '0',
          columnId: 'province',
        }),
        colIdList: ['city'],
      },
      {
        cellId: getCellId({
          rowId: '0',
          columnId: 'column1',
        }),
        colIdList: ['column2'],
      },
      {
        cellId: getCellId({
          rowId: '0',
          columnId: 'column3',
        }),
        colIdList: ['column4'],
      },
    ])

    expect(res.bodyMergeCelList).toStrictEqual([
      {
        cellId: getCellId({
          rowId: '0',
          columnId: 'province',
        }),
        rowIdList: ['1', '2', '3'],
      },
      {
        cellId: getCellId({
          rowId: '4',
          columnId: 'province',
        }),
        rowIdList: ['5', '6', '7'],
      },
    ])
  })
})
