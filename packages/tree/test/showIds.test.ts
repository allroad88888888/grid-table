import { describe, test, expect } from '@jest/globals'
import { createStore } from '@einfach/react'
import easy from './mock/easy.mock'
import { collapseNodeSetAtom, iniAtom, showIdsAtom } from './../src/state'

describe('tree-showIds', () => {
  test('collapse-easy', () => {
    const store = createStore()
    store.setter(iniAtom, easy.relation, { showRoot: true })

    store.setter(collapseNodeSetAtom, new Set(['A']))

    expect(store.getter(showIdsAtom)).toStrictEqual([
      'ROOT',
      'A',
      'B',
      'BA',
      'BB',
      'BC',
      'C',
      'D',
      'E',
    ])
  })

  test('collapse', () => {
    const store = createStore()
    store.setter(iniAtom, easy.relation, { showRoot: true })

    store.setter(collapseNodeSetAtom, new Set(['ACB', 'B']))

    expect(store.getter(showIdsAtom)).toStrictEqual([
      'ROOT',
      'A',
      'AA',
      'AB',
      'AC',
      'ACA',
      'ACB',
      'AD',
      'B',
      'C',
      'D',
      'E',
    ])
  })
})
