import { createContext } from 'react'
import type {} from 'einfach-state'
import type { Core } from './createCore'

export const BasicContext = createContext<Core>({} as Core)
