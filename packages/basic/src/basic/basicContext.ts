import { createContext } from 'react'
import type {} from '@einfach/react'
import type { Core } from './createCore'

export const BasicContext = createContext<Core>({} as Core)
