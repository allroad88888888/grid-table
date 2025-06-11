import type {} from '@einfach/react'
import { useAtomValue } from '@einfach/react'

import { dataBasicAtom } from '../stateCore'

export function useData() {
  return useAtomValue(dataBasicAtom)
}
