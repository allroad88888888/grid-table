import { useInit } from '@einfach/react-utils'
import type { Store } from '@einfach/react'
import { createStore, Provider as StoreProvider } from '@einfach/react'
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
