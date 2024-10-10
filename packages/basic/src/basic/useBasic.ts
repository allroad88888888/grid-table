import { useContext } from 'react'
import { BasicContext } from './basicContext'
import type {} from 'einfach-state'
import type { Core } from './type'

export function useBasic(): Core {
  const res = useContext(BasicContext)
  return res
}
