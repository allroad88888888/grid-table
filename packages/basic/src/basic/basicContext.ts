import { createContext } from 'react'
import type {} from 'einfach-state'
import type { Core } from './type'

export const BasicContext = createContext<Core>({} as Core)
