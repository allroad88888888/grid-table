import type { ReactNode } from 'react'
import { createContext } from 'react'
import type { Store } from 'einfach-state'
import { createDataContent, type DataContextType } from './createDataContext'
import { useInit } from 'einfach-utils'

export const DataContext = createContext<DataContextType>({} as DataContextType)

export function DataProvider({
  store,
  children,
  root,
}: {
  store: Store
  children: ReactNode
  root?: string
}) {
  const dataContent = useInit(() => {
    return createDataContent(store, { root })
  })
  return <DataContext.Provider value={dataContent}>{children}</DataContext.Provider>
}
