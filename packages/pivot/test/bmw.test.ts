import { describe, test, expect } from '@jest/globals'
import { formatToTable } from './../src/format/data/formatToTable'
import mockData, { dataList } from './mock/bmw.test.mock'

describe('pivot', () => {
  test('easy', () => {
    const res = formatToTable(mockData.dataCfg)
    const processedData = res.data.map(({ oldItem, ...rest }) => rest)
    expect(processedData).toStrictEqual(dataList)

    expect(res.headerData).toStrictEqual([
      { column1: '青年', column2: '中年', column3: '老年', level: '人群' },
      { column1: 'value', column2: 'value', column3: 'value', level: '收入水平' },
    ])
    expect(res.columns).toStrictEqual(['level', 'column1', 'column2', 'column3'])

    expect(res.columnPropTree).toStrictEqual({
      中年: {
        children: { column2: { columnName: 'column2', label: 'value' } },
        columnName: 'group',
        label: '中年',
      },
      老年: {
        children: { column3: { columnName: 'column3', label: 'value' } },
        columnName: 'group',
        label: '老年',
      },
      青年: {
        children: { column1: { columnName: 'column1', label: 'value' } },
        columnName: 'group',
        label: '青年',
      },
    })

    expect(res.headerColumns).toStrictEqual(['headerColumn0', 'headerColumn1'])

    expect(res.headerMergeCellList).toStrictEqual([])

    expect(res.bodyMergeCelList).toStrictEqual([])
  })
})
