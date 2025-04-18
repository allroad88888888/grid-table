import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/state'
import easy from './mock/easy.mock'
import { allIdsAtom, iniAtom, parentIdLevelAtom } from './../src/state'

describe('tree', () => {
  test('withRoot', () => {
    const store = createStore()
    store.setter(iniAtom, easy.relation, { showRoot: true })

    expect(store.getter(allIdsAtom)).toStrictEqual([
      'ROOT',
      'A',
      'AA',
      'AB',
      'AC',
      'ACA',
      'ACB',
      'ACBA',
      'AD',
      'B',
      'BA',
      'BB',
      'BC',
      'C',
      'D',
      'E',
    ])

    expect(store.getter(parentIdLevelAtom)).toStrictEqual(
      new Map([
        ['ROOT', 0],
        ['A', 1],
        ['AC', 2],
        ['ACB', 3],
        ['B', 1],
      ]),
    )
  })
  test('withoutRoot', () => {
    const store = createStore()
    store.setter(iniAtom, easy.relation, {})

    expect(store.getter(allIdsAtom)).toStrictEqual([
      'A',
      'AA',
      'AB',
      'AC',
      'ACA',
      'ACB',
      'ACBA',
      'AD',
      'B',
      'BA',
      'BB',
      'BC',
      'C',
      'D',
      'E',
    ])

    expect(store.getter(parentIdLevelAtom)).toStrictEqual(
      new Map([
        ['ROOT', -1],
        ['A', 0],
        ['AC', 1],
        ['ACB', 2],
        ['B', 0],
      ]),
    )
  })
})
