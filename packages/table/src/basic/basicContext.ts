import { createContext } from 'react'
import type {} from 'einfach-state'
import type { BasicStore } from './type'

export const BasicContext = createContext<BasicStore>({} as BasicStore)
