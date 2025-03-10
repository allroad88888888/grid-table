import type { CustomCellProps } from '@grid-table/view'
import { ValueJoinKey } from '../format/data/const'

export function getValuesGroup(newColumnNameMap: Map<string, string>) {
  const original = Object.fromEntries(newColumnNameMap)
  const groupedResult: Record<string, string[]> = {}
  for (const [fullKey, value] of Object.entries(original)) {
    const [, metric] = fullKey.split(ValueJoinKey)
    if (!groupedResult[metric]) {
      groupedResult[metric] = []
    }
    groupedResult[metric].push(value)
  }
  return groupedResult
}

export const buildComponent = (fn: Function) => {
  return function FormateCell({ text }: CustomCellProps) {
    return <div>{fn(text)}</div>
  }
}
