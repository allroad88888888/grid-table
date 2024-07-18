import { useCallback, useEffect } from 'react'
import { useInit } from 'einfach-utils'
import { useAtomValue } from 'einfach-state'
import { useBasic } from './useBasic'
import type { TableOption, UseBasicInitProps } from './type'

export function useBasicInit(props: UseBasicInitProps) {
  const { columnCalcSize, columnCount, rowCalcSize, rowCount } = props
  const { rowBaseSize = 1, columnBaseSize = 1, theadBaseSize = 1 } = props as TableOption
  const { store, columnSizeMapAtom, rowSizeMapAtom,
    columnListAtom, rowListAtom, clear, optionsAtom } = useBasic()

  const { setter, getter } = store

  useInit(() => {
    const columnList = getter(columnListAtom)
    const columnSizeMap = getter(columnSizeMapAtom)
    for (let i = 0; i < columnCount; i += 1) {
      columnSizeMap.set(i, columnCalcSize(i))
      columnList.push(i)
    }
    setter(columnListAtom, columnList)
    setter(columnSizeMapAtom, columnSizeMap)
    const rowList = getter(rowListAtom)
    const rowSizeMap = getter(rowSizeMapAtom)
    for (let i = 0; i < rowCount; i += 1) {
      rowSizeMap.set(i, rowCalcSize(i))
      rowList.push(i)
    }
    setter(rowListAtom, rowList)
    setter(rowSizeMapAtom, rowSizeMap)

    setter(optionsAtom, {
      rowBaseSize,
      columnBaseSize,
      theadBaseSize,
    })
  }, [])

  useEffect(() => {
    return clear
  }, [clear])

  const columnList = useAtomValue(columnListAtom, { store })
  const rowList = useAtomValue(rowListAtom, { store })
  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const rowSizeMap = useAtomValue(rowSizeMapAtom, { store })

  const newRowCalcSize = useCallback((index: number) => {
    const gridIndex = rowList[index]
    return rowSizeMap.get(gridIndex)!
  }, [rowList, rowSizeMap])

  const newColumnCalcSize = useCallback((index: number) => {
    const gridIndex = columnList[index]
    return columnSizeMap.get(gridIndex)!
  }, [columnList, columnSizeMap])

  console.log('columnSizeMap', columnSizeMap)

  return {
    rowCalcSize: newRowCalcSize,
    columnCalcSize: newColumnCalcSize,
  }

  // return
}
