import { useInit } from '@einfach/utils'
import type { Store } from '@einfach/state'
import { createStore, Provider as StoreProvider } from '@einfach/state'
import { type ReactNode } from 'react'

export function Provider({
  root,
  children,
  store,
}: {
  children: ReactNode
  root?: string
  store?: Store
}) {
  const realStore = useInit(() => {
    return store || createStore()
  }, [store])

  return <StoreProvider store={realStore}>{children}</StoreProvider>
}
