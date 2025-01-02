import { describe, test, expect } from '@jest/globals'
import mockData from './lu.mock'
import { covertDescToDataList } from './covert'

describe('pivot', () => {
  test('easy', () => {
    const res = covertDescToDataList(mockData.json, mockData.description)

    expect(res).toStrictEqual(mockData.dataCfg.data)
  })
})
