import { useCallback, useEffect, useLayoutEffect } from 'react'
import { useAtomValue } from 'einfach-state'
import type { TableOption, UseBasicInitProps } from './type'
import { useBasic } from './useBasic'

export function useBasicInit(props: UseBasicInitProps) {
  const { columnCalcSize, columnCount, rowCalcSize, rowCount } = props
  const { rowBaseSize = 1, columnBaseSize = 1, theadBaseSize = 1 } = props as TableOption
  const { theadCalcSize = rowCalcSize } = props
  const { store, columnSizeMapAtom, rowSizeMapAtom,
    columnListAtom, rowListAtom, clear, optionsAtom } = useBasic()

  const { setter } = store

  function init() {
    const columnList = []
    const columnSizeMap = new Map()
    for (let i = 0; i < columnCount; i += 1) {
      columnSizeMap.set(i, columnCalcSize(i))
      columnList.push(i)
    }
    setter(columnListAtom, columnList)
    setter(columnSizeMapAtom, columnSizeMap)
    const rowList = []
    const rowSizeMap = new Map()
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
  }

  useLayoutEffect(() => {
    init()
  }, [columnCount, rowCount])

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

  const newTheadCalcSize = useCallback((index: number) => {
    return theadCalcSize(index)
  }, [theadCalcSize])

  return {
    rowCount: rowList.length,
    columnCount: columnList.length,
    rowCalcSize: newRowCalcSize,
    columnCalcSize: newColumnCalcSize,
    theadCalcSize: newTheadCalcSize,
  }
}
