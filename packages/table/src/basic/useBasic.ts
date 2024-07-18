import { useContext } from 'react'
import { BasicContext } from './basicContext'
import type {} from 'einfach-state'
import type { BasicStore } from './type'

export function useBasic(): BasicStore {
  const res = useContext(BasicContext)
  return res
}
