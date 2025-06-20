import type { ReactNode } from 'react'
import { createContext, useState } from 'react'
import { createStore, type Store } from '@einfach/react'

export type GridTreeStore = {
  store: Store
}

export const gridTreeContext = createContext({} as GridTreeStore)

export function GridTreeProvider({ children, store }: { children: ReactNode; store?: Store }) {
  const [state] = useState(() => {
    return { store: store ?? createStore() }
  })

  return <gridTreeContext.Provider value={state}>{children}</gridTreeContext.Provider>
}
