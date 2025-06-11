import { useBasic, type ColumnId } from '@grid-table/basic'
import { useData } from '../../core'
import { useCallback } from 'react'
import { easyGet } from '@einfach/utils'
import { useStore } from '@einfach/react'

export function useFilterColumn(columnId: ColumnId) {
  const store = useStore()
  const { rowIndexListAtom } = useBasic()
  const { getRowInfoAtomByRowId, getColumnOptionAtomByColumnId } = useData()

  const getSelectOption = useCallback(() => {
    const columnInfo = store.getter(getColumnOptionAtomByColumnId(columnId))
    if (!('dataIndex' in columnInfo)) {
      return
    }

    const rowIdList = store.getter(rowIndexListAtom)

    const values = new Set<unknown>()
    rowIdList.forEach((rowId) => {
      const rowInfo = store.getter(getRowInfoAtomByRowId(rowId))
      values.add(easyGet(rowInfo, columnInfo.dataIndex!))
    })

    return Array.from(values).map((value) => {
      return {
        value,
        label: value,
      }
    })
  }, [])

  return {
    getSelectOption,
  }
}
