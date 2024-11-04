import { describe, expect, it } from '@jest/globals'
import { distributeToNewArray } from './utils'

describe('easyClone', () => {
  it('easyClone', async () => {
    // 测试 1：简单分配测试
    let A = [10, 20, 30]
    let B = 100
    //  1/6
    // 40

    let expected = [16, 33, 51]
    expect(distributeToNewArray(A, B)).toStrictEqual(expected)

    // 测试 2：无剩余的分配
    A = [5, 5, 10]
    B = 30
    expected = [7, 7, 16]
    expect(distributeToNewArray(A, B)).toStrictEqual(expected)

    // 测试 3：所有数字相等
    A = [10, 10, 10]
    B = 40
    expected = [13, 13, 14]
    expect(distributeToNewArray(A, B)).toStrictEqual(expected)

    // 测试 4：B 等于数组总和，无需分配
    A = [10, 20, 30]
    B = 60
    expected = [10, 20, 30]
    expect(distributeToNewArray(A, B)).toStrictEqual(expected)

    // 测试 5：B 很大，分配较多
    A = [1, 2, 3]
    B = 1000
    expected = [166, 333, 501]
    expect(distributeToNewArray(A, B)).toStrictEqual(expected)
  })
})
