import { useContext } from 'react'
import { gridTreeContext } from '../state'

export function useStore() {
  return useContext(gridTreeContext)
}
