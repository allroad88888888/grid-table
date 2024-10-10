import { useAtomValue } from 'einfach-state'
import { incrementAtom } from '../utils/incrementAtom'
import { useBasic } from '@grid-table/basic/src'

export const tableClassNameAtom = incrementAtom(new Set<string>())

export function useTableClassNameValue(className?: string | undefined) {
  const { store } = useBasic()
  const val = useAtomValue(tableClassNameAtom, { store })
  return `${className ? `${className} ` : ''} ${Array.from(val).join(' ')}`
}
