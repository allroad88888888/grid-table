import { RunStatusLanguage } from './options'
import type { ColumnProps } from './type'

export function ColumnRunStatus({ rowInfo }: ColumnProps) {
  return <>{RunStatusLanguage[rowInfo.runStatus]}</>
}
