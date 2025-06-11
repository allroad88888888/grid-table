import type { ColumnId } from '@grid-table/basic'
import { useAtomValue } from '@einfach/react'
import { useData } from '../core'

export function useColumnOption(columnId: ColumnId) {
  const { getColumnOptionAtomByColumnId } = useData()
  return useAtomValue(getColumnOptionAtomByColumnId(columnId))
}
