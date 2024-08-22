import { useLayoutEffect } from 'react'
import { useAtomValue } from 'einfach-state'
import type { UseDataProps } from './type/common'
import { useData } from './useData'
import { format } from './format'
import { useBasic } from '../../basic'

export function useDataInit(props: UseDataProps) {
  const { dataSource, columns } = props

  const { store } = useBasic()

  const dataCore = useData()
  const { clear, loadingAtom } = dataCore
  const loading = useAtomValue(loadingAtom)

  const {} = useBasic()

  useLayoutEffect(() => {
    store.setter(loadingAtom, true)
    format(
      {
        dataSource,
        columns,
      },
      dataCore,
    )
    store.setter(loadingAtom, false)
    return clear
  }, [clear, columns, dataCore, dataSource, loadingAtom, store])

  return {
    loading,
  }
}
