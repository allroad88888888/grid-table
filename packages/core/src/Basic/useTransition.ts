import { useCallback, useTransition as useTransition18 } from 'react'

function useTransition17() {
  const startTransition = useCallback((fn: () => void) => {
    fn()
  }, [])

  return [false, startTransition]
}

export const useTransition = useTransition18 || useTransition17
