import { describe, test, expect } from '@jest/globals'
import { formatToTable } from './../src/format/data/formatToTable'
import mockData from './mock/one.mock'

describe('pivot', () => {
  test('easy', () => {
    const res = formatToTable(mockData.dataCfg)
    expect(res.data).toStrictEqual([
      {
        column1: 200,
        column2: 1200,
        organization: '西品全国销售',
        position: '销售总监',
      },
    ])

    expect(res.columns).toStrictEqual(['organization', 'position', 'column1', 'column2'])

    expect(res.columnPropTree).toStrictEqual({
      '2024': {
        children: { column1: { columnName: 'column1', label: 'amount' } },
        columnName: 'fiscal_year',
        label: '2024',
      },
      '2025': {
        children: { column2: { columnName: 'column2', label: 'amount' } },
        columnName: 'fiscal_year',
        label: '2025',
      },
    })

    expect(res.headerData).toStrictEqual([
      { column1: '2024', column2: '2025', organization: 'fiscal_year', position: 'fiscal_year' },
      { column1: 'amount', column2: 'amount', organization: '组织', position: '职位' },
    ])

    expect(res.headerColumns).toStrictEqual(['headerColumn0', 'headerColumn1'])

    expect(res.headerMergeCellList).toStrictEqual([
      { cellId: '0||organization', colIdList: ['position'], rowIdList: [] },
    ])

    expect(res.bodyMergeCelList).toStrictEqual([])
  })
})
