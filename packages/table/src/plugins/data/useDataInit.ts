import { useLayoutEffect } from 'react'
import { useAtomValue } from 'einfach-state'
import type { UseDataProps } from './type/common'
import { useData } from './useData'
import { format } from './format'
import { useBasic } from '../../basic'

export function useDataInit(props: UseDataProps) {
  const { dataSource, columns } = props

  const { store, getColumnStateAtomByIndex } = useBasic()

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

  useLayoutEffect(() => {
    const clearList: (() => void)[] = []
    columns.forEach((column, colIndex) => {
      clearList.push(
        store.setter(getColumnStateAtomByIndex(colIndex), (_getter, prev) => {
          const next = {
            ...prev,
          }
          if (!('className' in next)) {
            next.className = new Set()
          }

          next.className?.add(`text-${column.align || 'left'}`)
          return next
        })!,
      )
    })
    return () => {
      clearList.forEach((tClear) => {
        tClear()
      })
    }
  }, [columns, getColumnStateAtomByIndex, store])

  return {
    loading,
  }
}
