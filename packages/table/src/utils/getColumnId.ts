import { getIdByObj } from '@grid-table/basic'
import type { ColumnType } from '../types'

export function getColumnId(column: ColumnType) {
  return column.key || getIdByObj(column)
}
