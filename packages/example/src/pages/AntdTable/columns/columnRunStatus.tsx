import { RunStatusLanguage } from './options'
import type { Info } from './server'
import type { CustomCellProps } from './type'

export function ColumnRunStatus({ rowInfo }: CustomCellProps<Info>) {
  return <>{RunStatusLanguage[rowInfo.runStatus]}</>
}
