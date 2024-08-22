import type { ReactNode } from 'react'
import { createContext } from 'react'
import type { Store } from 'einfach-state'
import { createDataContent, type DataContextType } from './createDataContext'
import { useInit } from 'einfach-utils'

export const DataContext = createContext<DataContextType>({} as DataContextType)

export function DataProvider({ store, children }: { store: Store; children: ReactNode }) {
  const dataContent = useInit(() => {
    return createDataContent(store)
  })
  return <DataContext.Provider value={dataContent}>{children}</DataContext.Provider>
}
