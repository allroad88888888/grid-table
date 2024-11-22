import { describe, test, expect } from '@jest/globals'
import { getAffectedCellSet } from './utils'

describe('mergeCells', () => {
  test('utils-getAffectedCellSet-easy', () => {
    const mockList = [
      {
        colIdList: ['10004', '10005'],
        rowIdList: ['3'],
        cellId: '2||10003',
      },
    ]

    const result = ['2||10004', '2||10005', '3||10003', '3||10004', '3||10005']
    const cellIdSet = getAffectedCellSet(mockList)
    expect(Array.from(cellIdSet)).toStrictEqual(result)
  })
})
