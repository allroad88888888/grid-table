import { useAtomValue } from '@einfach/react'
import type { Store } from '@einfach/react'
import type { Core } from './state'
import { basicAtom } from './state'

export function useBasic(store?: Store): Core {
  const res = useAtomValue(basicAtom, { store })
  return res
}
