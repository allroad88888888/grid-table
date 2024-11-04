import { incrementAtom, useAtomValue } from 'einfach-state'
import { useBasic } from '@grid-table/basic'

export const tableClassNameAtom = incrementAtom(new Set<string>())

export function useTableClassNameValue(className?: string | undefined) {
  const { store } = useBasic()
  const val = useAtomValue(tableClassNameAtom, { store })
  return `${className ? `${className} ` : ''} ${Array.from(val).join(' ')}`
}
