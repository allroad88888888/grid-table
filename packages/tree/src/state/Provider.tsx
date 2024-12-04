import type { ReactNode } from 'react'
import { createContext, useState } from 'react'
import { createStore, type Store } from 'einfach-state'

export type GridTreeStore = {
  store: Store
}

export const gridTreeContext = createContext({} as GridTreeStore)

export function GridTreeProvider({ children }: { children: ReactNode }) {
  const [state] = useState(() => {
    return { store: createStore() }
  })

  return <gridTreeContext.Provider value={state}>{children}</gridTreeContext.Provider>
}
