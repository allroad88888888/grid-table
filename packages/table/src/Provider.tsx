import { useInit } from 'einfach-utils'
import type { Store } from 'einfach-state'
import { Provider as StoreProvider } from 'einfach-state'
import { BasicContext, createCore } from '@grid-table/basic'
import { DataProvider } from './core'
import { useEffect, type ReactNode } from 'react'

export function Provider({
  root,
  children,
  store,
}: {
  children: ReactNode
  root?: string
  store?: Store
}) {
  const basicValue = useInit(() => {
    return createCore(store)
  }, [store])

  useEffect(() => {
    return basicValue.clear
  }, [])
  return (
    <StoreProvider store={basicValue.store}>
      <BasicContext.Provider value={basicValue}>
        <DataProvider store={basicValue.store} root={root}>
          {children}
        </DataProvider>
      </BasicContext.Provider>
    </StoreProvider>
  )
}
