import { TriggerTypeLanguage } from './options'
import type { ColumnProps } from './type'

export function ColumnTrigger({ rowInfo }: ColumnProps) {
  return <>{TriggerTypeLanguage[rowInfo.triggerType]}</>
}
