import { useContext } from 'react'
import type {} from 'einfach-state'
import { DataContext } from './provider'

export function useData() {
  return useContext(DataContext)
}
