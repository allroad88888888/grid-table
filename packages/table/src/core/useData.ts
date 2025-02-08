import type {} from '@einfach/state'
import { useAtomValue } from '@einfach/state'

import { dataBasicAtom } from '../stateCore'

export function useData() {
  return useAtomValue(dataBasicAtom)
}
