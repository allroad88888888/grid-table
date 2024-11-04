import type { PositionId } from '@grid-table/view'
import type { Info } from './server'

export interface ColumnProps {
  text: string | undefined
  rowInfo: Info
  param: PositionId
}
