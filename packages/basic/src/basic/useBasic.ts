import { useAtomValue } from '@einfach/react'
import type {} from '@einfach/react'
import type { Core } from './state'
import { basicAtom } from './state'

export function useBasic(): Core {
  const res = useAtomValue(basicAtom)
  return res
}
