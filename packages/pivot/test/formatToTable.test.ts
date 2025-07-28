import { describe, test, expect } from '@jest/globals'
import { formatToTable } from '../src/format/data/formatToTable'
import type { DataConfig } from '../src/format/types'

describe('formatToTable', () => {
  test('should format simple pivot table data correctly', () => {
    // 准备测试数据 - 简单的销售数据
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region'],
        columns: ['quarter'],
        values: ['sales'],
      },
      meta: [
        {
          field: 'region',
          name: '地区',
        },
        {
          field: 'sales',
          name: '销售额',
        },
      ],
      data: [
        {
          region: '华东',
          quarter: 'Q1',
          sales: 10000,
        },
        {
          region: '华东',
          quarter: 'Q2',
          sales: 15000,
        },
        {
          region: '华北',
          quarter: 'Q1',
          sales: 12000,
        },
      ],
    }

    // 执行函数
    const result = formatToTable(testDataConfig)

    // 验证转换后的数据结构
    expect(result.data).toStrictEqual([
      {
        region: '华东',
        column1: 10000, // Q1 销售额
        column2: 15000, // Q2 销售额
      },
      {
        region: '华北',
        column1: 12000, // Q1 销售额
        // Q2 销售额为空（没有数据）
      },
    ])

    // 验证列配置
    expect(result.columns).toStrictEqual(['region', 'column1', 'column2'])

    // 验证列关系树（columnPropTree）
    expect(result.columnPropTree).toStrictEqual({
      Q1: {
        children: {
          column1: {
            columnName: 'column1',
            label: '销售额',
          },
        },
        columnName: 'quarter',
        label: 'Q1',
      },
      Q2: {
        children: {
          column2: {
            columnName: 'column2',
            label: '销售额',
          },
        },
        columnName: 'quarter',
        label: 'Q2',
      },
    })

    // 验证表头数据
    expect(result.headerData).toStrictEqual([
      {
        region: 'quarter',
        column1: 'Q1',
        column2: 'Q2',
      },
      {
        region: '地区',
        column1: '销售额',
        column2: '销售额',
      },
    ])

    // 验证表头列
    expect(result.headerColumns).toStrictEqual(['headerColumn0', 'headerColumn1'])

    // 验证 newColumnNameMap
    expect(Array.from(result.newColumnNameMap.entries())).toStrictEqual([
      ['Q1__**sales', 'column1'],
      ['Q2__**sales', 'column2'],
    ])

    // 验证基本结构
    expect(result.headerMergeCellList).toBeDefined()
    expect(result.bodyMergeCelList).toBeDefined()
    expect(result.metaFieldMap).toBeDefined()
  })

  test('should handle valueInCols: false correctly', () => {
    // 测试 valueInCols: false 的数据处理 - 使用 ValueInColsDemo 的数据结构
    const testDataConfig: DataConfig = {
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
      data: [
        {
          region: '华东',
          city: '上海',
          quarter: 'Q1',
          sales: 15000,
          profit: 3000,
          orders: 120,
        },
        {
          region: '华东',
          city: '上海',
          quarter: 'Q2',
          sales: 18000,
          profit: 3600,
          orders: 150,
        },
        {
          region: '华东',
          city: '杭州',
          quarter: 'Q1',
          sales: 12000,
          profit: 2400,
          orders: 100,
        },
      ],
    }

    // 执行函数
    const result = formatToTable(testDataConfig)

    // 验证转换后的数据结构 - valueInCols: false 时，每个地区+城市+值类型组合成为一行
    expect(result.data).toStrictEqual([
      {
        region: '华东',
        city: '上海',
        Values: '销售额',
        Q1: 15000,
        Q2: 18000,
      },
      {
        region: '华东',
        city: '上海',
        Values: '利润',
        Q1: 3000,
        Q2: 3600,
      },
      {
        region: '华东',
        city: '上海',
        Values: '订单数',
        Q1: 120,
        Q2: 150,
      },
      {
        region: '华东',
        city: '杭州',
        Values: '销售额',
        Q1: 12000,
        // Q2 没有数据
      },
      {
        region: '华东',
        city: '杭州',
        Values: '利润',
        Q1: 2400,
        // Q2 没有数据
      },
      {
        region: '华东',
        city: '杭州',
        Values: '订单数',
        Q1: 100,
        // Q2 没有数据
      },
    ])

    // 验证列配置 - 包含行字段、Values 字段和 columns 的实际值（季度）
    expect(result.columns).toStrictEqual(['region', 'city', 'Values', 'Q1', 'Q2'])

    // 验证列关系树应该为空（因为 valueInCols: false）
    expect(result.columnPropTree).toStrictEqual({})

    // 验证基本结构
    expect(result.headerMergeCellList).toBeDefined()
    expect(result.bodyMergeCelList).toBeDefined()
    expect(result.metaFieldMap).toBeDefined()
  })

  test('should handle empty data array', () => {
    // 测试空数据数组的处理
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region'],
        columns: ['quarter'],
        values: ['sales'],
      },
      meta: [
        {
          field: 'region',
          name: '地区',
        },
        {
          field: 'sales',
          name: '销售额',
        },
      ],
      data: [], // 空数据
    }

    const result = formatToTable(testDataConfig)

    // 应该返回空的数据和基本结构
    expect(result.data).toStrictEqual([])
    expect(result.columns).toStrictEqual(['region'])
    expect(result.columnPropTree).toStrictEqual({})
    expect(result.headerData).toStrictEqual([])
  })

  test('should handle single value field with valueInCols: true', () => {
    // 测试单个值字段的情况
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region'],
        columns: ['quarter'],
        values: ['sales'], // 只有一个值字段
      },
      meta: [
        {
          field: 'region',
          name: '地区',
        },
        {
          field: 'sales',
          name: '销售额',
        },
      ],
      data: [
        {
          region: '华东',
          quarter: 'Q1',
          sales: 10000,
        },
        {
          region: '华北',
          quarter: 'Q1',
          sales: 12000,
        },
      ],
    }

    const result = formatToTable(testDataConfig)

    expect(result.data).toStrictEqual([
      { region: '华东', column1: 10000 },
      { region: '华北', column1: 12000 },
    ])
    expect(result.columns).toStrictEqual(['region', 'column1'])
  })

  test('should handle multiple rows and columns', () => {
    // 测试多个行字段和列字段
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region', 'city'],
        columns: ['quarter'],
        values: ['sales', 'profit'],
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
      ],
      data: [
        {
          region: '华东',
          city: '上海',
          quarter: 'Q1',
          sales: 15000,
          profit: 3000,
        },
        {
          region: '华东',
          city: '杭州',
          quarter: 'Q1',
          sales: 12000,
          profit: 2400,
        },
      ],
    }

    const result = formatToTable(testDataConfig)

    expect(result.data).toStrictEqual([
      {
        region: '华东',
        city: '上海',
        column1: 15000, // Q1 销售额
        column2: 3000, // Q1 利润
      },
      {
        region: '华东',
        city: '杭州',
        column1: 12000,
        column2: 2400,
      },
    ])
    expect(result.columns).toStrictEqual(['region', 'city', 'column1', 'column2'])
  })

  test('should handle missing meta data', () => {
    // 测试缺失 meta 数据的情况
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region'],
        columns: ['quarter'],
        values: ['sales'],
      },
      meta: [], // 空的 meta 数据
      data: [
        {
          region: '华东',
          quarter: 'Q1',
          sales: 10000,
        },
      ],
    }

    const result = formatToTable(testDataConfig)

    // 没有 meta 时，应该使用原始字段名
    expect(result.headerData).toStrictEqual([
      { region: 'quarter', column1: 'Q1' },
      { region: 'region', column1: 'sales' },
    ])
  })

  test('should handle partial data coverage', () => {
    // 测试数据覆盖不完整的情况
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region'],
        columns: ['quarter'],
        values: ['sales'],
      },
      meta: [
        {
          field: 'region',
          name: '地区',
        },
        {
          field: 'sales',
          name: '销售额',
        },
      ],
      data: [
        {
          region: '华东',
          quarter: 'Q1',
          sales: 10000,
        },
        {
          region: '华东',
          quarter: 'Q2',
          sales: 15000,
        },
        // 华北只有 Q1 数据，缺少 Q2
        {
          region: '华北',
          quarter: 'Q1',
          sales: 12000,
        },
      ],
    }

    const result = formatToTable(testDataConfig)

    expect(result.data).toStrictEqual([
      {
        region: '华东',
        column1: 10000, // Q1
        column2: 15000, // Q2
      },
      {
        region: '华北',
        column1: 12000, // Q1
        // Q2 缺失，不会有 column2 字段
      },
    ])
  })

  test('should handle valueInCols: false with single value', () => {
    // 测试 valueInCols: false 且只有单个值字段的情况
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region'],
        columns: ['quarter'],
        values: ['sales'], // 只有一个值字段
        valueInCols: false,
      },
      meta: [
        {
          field: 'region',
          name: '地区',
        },
        {
          field: 'sales',
          name: '销售额',
        },
      ],
      data: [
        {
          region: '华东',
          quarter: 'Q1',
          sales: 10000,
        },
        {
          region: '华东',
          quarter: 'Q2',
          sales: 15000,
        },
      ],
    }

    const result = formatToTable(testDataConfig)

    expect(result.data).toStrictEqual([
      {
        region: '华东',
        Values: '销售额',
        Q1: 10000,
        Q2: 15000,
      },
    ])
    expect(result.columns).toStrictEqual(['region', 'Values', 'Q1', 'Q2'])
  })

  test('should handle complex data with multiple quarters', () => {
    // 测试更复杂的多季度数据
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region'],
        columns: ['quarter'],
        values: ['sales', 'profit'],
      },
      meta: [
        {
          field: 'region',
          name: '地区',
        },
        {
          field: 'sales',
          name: '销售额',
        },
        {
          field: 'profit',
          name: '利润',
        },
      ],
      data: [
        {
          region: '华东',
          quarter: 'Q1',
          sales: 10000,
          profit: 2000,
        },
        {
          region: '华东',
          quarter: 'Q2',
          sales: 15000,
          profit: 3000,
        },
        {
          region: '华东',
          quarter: 'Q3',
          sales: 18000,
          profit: 3600,
        },
        {
          region: '华北',
          quarter: 'Q1',
          sales: 12000,
          profit: 2400,
        },
        {
          region: '华北',
          quarter: 'Q2',
          sales: 14000,
          profit: 2800,
        },
      ],
    }

    const result = formatToTable(testDataConfig)

    expect(result.data).toStrictEqual([
      {
        region: '华东',
        column1: 10000, // Q1 销售额
        column2: 2000, // Q1 利润
        column3: 15000, // Q2 销售额
        column4: 3000, // Q2 利润
        column5: 18000, // Q3 销售额
        column6: 3600, // Q3 利润
      },
      {
        region: '华北',
        column1: 12000, // Q1 销售额
        column2: 2400, // Q1 利润
        column3: 14000, // Q2 销售额
        column4: 2800, // Q2 利润
        // Q3 缺失
      },
    ])
    expect(result.columns).toStrictEqual([
      'region',
      'column1',
      'column2',
      'column3',
      'column4',
      'column5',
      'column6',
    ])
  })

  test('should handle only rows without columns', () => {
    // 测试只有行字段没有列字段的情况
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region', 'city'],
        columns: [], // 没有列字段
        values: ['sales'],
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
      ],
      data: [
        {
          region: '华东',
          city: '上海',
          sales: 15000,
        },
        {
          region: '华东',
          city: '杭州',
          sales: 12000,
        },
      ],
    }

    const result = formatToTable(testDataConfig)

    expect(result.data).toStrictEqual([
      {
        region: '华东',
        city: '上海',
        column1: 15000,
      },
      {
        region: '华东',
        city: '杭州',
        column1: 12000,
      },
    ])
    expect(result.columns).toStrictEqual(['region', 'city', 'column1'])
  })

  test('should handle valueInCols: false with incomplete data', () => {
    // 测试 valueInCols: false 时数据不完整的情况
    const testDataConfig: DataConfig = {
      fields: {
        rows: ['region'],
        columns: ['quarter'],
        values: ['sales', 'profit'],
        valueInCols: false,
      },
      meta: [
        {
          field: 'region',
          name: '地区',
        },
        {
          field: 'sales',
          name: '销售额',
        },
        {
          field: 'profit',
          name: '利润',
        },
      ],
      data: [
        {
          region: '华东',
          quarter: 'Q1',
          sales: 10000,
          profit: 2000,
        },
        // 只有华东的数据，没有其他地区
        {
          region: '华东',
          quarter: 'Q2',
          sales: 15000,
          // 缺少 profit 数据
        },
      ],
    }

    const result = formatToTable(testDataConfig)

    expect(result.data).toStrictEqual([
      {
        region: '华东',
        Values: '销售额',
        Q1: 10000,
        Q2: 15000,
      },
      {
        region: '华东',
        Values: '利润',
        Q1: 2000,
        Q2: undefined, // Q2 的利润数据缺失
      },
    ])
    expect(result.columns).toStrictEqual(['region', 'Values', 'Q1', 'Q2'])
  })
})
