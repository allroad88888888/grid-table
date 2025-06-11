import { incrementAtom, useAtomValue, useStore } from '@einfach/react'

export const tableClassNameAtom = incrementAtom(new Set<string>())

export function useTableClassNameValue(className?: string | undefined) {
  const store = useStore()
  const val = useAtomValue(tableClassNameAtom, { store })
  return `${className ? `${className} ` : ''} ${Array.from(val).join(' ')}`
}
