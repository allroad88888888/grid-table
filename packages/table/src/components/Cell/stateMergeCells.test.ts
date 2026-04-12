import { describe, expect, test } from '@jest/globals'
import type { CellId } from '@grid-table/basic'
import { getCellId } from '../../utils/getCellId'
import { mergeCellsToMap } from './stateMergeCells'

describe('mergeCellsToMap', () => {
  test('maps the full merged rectangle back to the anchor cell', () => {
    const anchor = getCellId({ rowId: 'r0', columnId: 'c0' }) as CellId
    const map = mergeCellsToMap([
      {
        cellId: anchor,
        rowIdList: ['r1'],
        colIdList: ['c1'],
      },
    ])

    expect(map.get(getCellId({ rowId: 'r0', columnId: 'c1' }) as CellId)).toBe(anchor)
    expect(map.get(getCellId({ rowId: 'r1', columnId: 'c0' }) as CellId)).toBe(anchor)
    expect(map.get(getCellId({ rowId: 'r1', columnId: 'c1' }) as CellId)).toBe(anchor)
  })
})
