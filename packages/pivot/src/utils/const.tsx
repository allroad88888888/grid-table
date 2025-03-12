// import type { CustomCellProps } from '@grid-table/view'
import { ValueJoinKey } from '../format/data/const'
// import type { ComponentType } from 'react'

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

// export const buildComponent = (fn: Function) => {
//   return function FormateCell({ text }: CustomCellProps) {
//     return (
//       <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
//         {fn()(text)}
//       </div>
//     )
//   }
// }

// export const buildComponent = (
//   RenderComponent: React.ComponentType<CustomCellProps<Record<string, any>>> | undefined,
// ) => {
//   return function FormateCell({ text, rowInfo, position }: CustomCellProps) {
//     return <RenderComponent text={text} rowInfo={rowInfo!} position={position} />
//   }
// }
