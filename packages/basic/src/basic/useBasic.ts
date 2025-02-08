import { useAtomValue } from '@einfach/state'
import type {} from '@einfach/state'
import type { Core } from './state'
import { basicAtom } from './state'

export function useBasic(): Core {
  const res = useAtomValue(basicAtom)
  return res
}
