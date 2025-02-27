import { TriggerTypeLanguage } from './options'
import type { Info } from './server'
import type { CustomCellProps } from './type'

export function ColumnTrigger({ rowInfo }: CustomCellProps<Info>) {
  return <>{TriggerTypeLanguage[rowInfo.triggerType]}</>
}
