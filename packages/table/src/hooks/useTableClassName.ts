import { atom, useAtomValue } from 'einfach-state'
import { useBasic } from '../basic'

export const tableClassNameAtom = atom<Set<string>>(new Set())

export function useTableClassNameValue(className?: string | undefined) {
  const { store } = useBasic()
  const val = useAtomValue(tableClassNameAtom, { store })
  return `${className ? `${className} ` : ''} ${Array.from(val).join(' ')}`
}
