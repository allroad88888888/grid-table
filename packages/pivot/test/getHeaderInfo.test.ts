import { describe, test, expect } from '@jest/globals'
import { getHeaderInfo } from '../src/format/data/header'
import type { DataConfig } from '../src/format/types'
import type { HeaderRelation } from '../src/format/data/type'

describe('getHeaderInfo', () => {
  test('should generate header data and columns correctly', () => {
    // 准备测试数据 - 使用与 ValueInColsDemo 一致的数据结构 (valueInCols: true)
    const dataConfig: Pick<DataConfig, 'meta' | 'fields'> = {
      fields: {
        rows: ['region', 'city'],
        columns: ['quarter'],
        values: ['sales', 'profit', 'orders'],
      },
      meta: [
        {
          field: 'region',
          name: '地区',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'sales',
          name: '销售额',
        },
        {
          field: 'profit',
          name: '利润',
        },
        {
          field: 'orders',
          name: '订单数',
        },
      ],
    }

    const headerRelation: HeaderRelation = {
      Q1: {
        children: {
          column1: {
            columnName: 'column1',
            label: '销售额',
          },
          column2: {
            columnName: 'column2',
            label: '利润',
          },
          column3: {
            columnName: 'column3',
            label: '订单数',
          },
        },
        columnName: 'quarter',
        label: 'Q1',
      },
      Q2: {
        children: {
          column4: {
            columnName: 'column4',
            label: '销售额',
          },
          column5: {
            columnName: 'column5',
            label: '利润',
          },
          column6: {
            columnName: 'column6',
            label: '订单数',
          },
        },
        columnName: 'quarter',
        label: 'Q2',
      },
    }

    const realColumns = [
      'region',
      'city',
      'column1',
      'column2',
      'column3',
      'column4',
      'column5',
      'column6',
    ]

    // 执行函数
    const result = getHeaderInfo(dataConfig, headerRelation, realColumns)

    // 验证结果
    expect(result.headerData).toStrictEqual([
      {
        column1: 'Q1',
        column2: 'Q1',
        column3: 'Q1',
        column4: 'Q2',
        column5: 'Q2',
        column6: 'Q2',
        region: 'quarter',
        city: 'quarter',
      },
      {
        column1: '销售额',
        column2: '利润',
        column3: '订单数',
        column4: '销售额',
        column5: '利润',
        column6: '订单数',
        region: '地区',
        city: '城市',
      },
    ])

    expect(result.headerColumns).toStrictEqual(['headerColumn0', 'headerColumn1'])
  })

  test('should handle valueInCols: false correctly', () => {
    // 准备测试数据 - valueInCols 为 false，与 formatToTable 测试保持一致
    const dataConfig: Pick<DataConfig, 'meta' | 'fields'> = {
      fields: {
        rows: ['region', 'city'],
        columns: ['quarter'],
        values: ['sales', 'profit', 'orders'],
        valueInCols: false, // 值字段在行中显示
      },
      meta: [
        {
          field: 'region',
          name: '地区',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'sales',
          name: '销售额',
        },
        {
          field: 'profit',
          name: '利润',
        },
        {
          field: 'orders',
          name: '订单数',
        },
      ],
    }

    // 当 valueInCols 为 false 时，headerRelation 应该为空（没有复杂的列层级）
    const headerRelation: HeaderRelation = {}

    // realColumns 应该包含：行字段 + 'Values' 字段 + columns 的实际值
    // 这里模拟 formatToTable 生成的 realColumns 结构
    const realColumns = ['region', 'city', 'Values', 'Q1', 'Q2']

    // 执行函数
    const result = getHeaderInfo(dataConfig, headerRelation, realColumns)

    // 验证结果：当 valueInCols 为 false 时，表头结构应该更简单
    // 只有一行表头，包含所有列的显示名称
    expect(result.headerData).toStrictEqual([
      {
        region: '地区',
        city: '城市',
        Values: '销售额', // Values 字段使用第一个 value 的名称
        Q1: 'Q1', // columns 的实际值直接作为列名
        Q2: 'Q2',
      },
    ])

    // 只有一个 headerColumn（因为没有复杂的层级结构）
    expect(result.headerColumns).toStrictEqual(['headerColumn0'])
  })
})
