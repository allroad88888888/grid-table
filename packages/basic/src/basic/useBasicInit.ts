import { useEffect } from 'react'

import { useBasic } from './useBasic'

export function useBasicInit() {
  const { clear } = useBasic()

  useEffect(() => {
    return clear
  }, [clear])
}
