import { useCallback, useEffect, useLayoutEffect } from 'react'
import { useAtomValue, selectAtom } from 'einfach-state'
import type { TableOption, UseBasicInitProps } from './type'
import { useBasic } from './useBasic'
import type { ResizeParam } from '@grid-table/core'

export function useBasicInit(props: UseBasicInitProps) {
  const { columnCalcSize, columnCount, rowCalcSize, rowCount } = props
  const { rowBaseSize = 1, columnBaseSize = 1, theadBaseSize = 1 } = props as TableOption
  const { theadCalcSize = rowCalcSize } = props
  const {
    store,
    columnSizeMapAtom,
    rowSizeMapAtom,
    resizeAtom,
    columnListAtom,
    rowListAtom,
    clear,
    optionsAtom,
  } = useBasic()

  const { setter } = store

  useLayoutEffect(() => {
    setter(optionsAtom, {
      rowBaseSize,
      columnBaseSize,
      theadBaseSize,
      rowCount,
      columnCount,
    })
  }, [setter, rowCount, columnCount, optionsAtom, rowBaseSize, columnBaseSize, theadBaseSize])

  useLayoutEffect(() => {
    const rowCountAtom = selectAtom(optionsAtom, (option) => {
      return option.rowCount || 0
    })
    const columnCountAtom = selectAtom(optionsAtom, (option) => {
      return option.columnCount || 0
    })
    const clearList: (() => void)[] = []
    clearList.push(
      setter(columnListAtom, (getter, prev) => {
        const count = getter(columnCountAtom)
        const columnList = []
        for (let i = 0; i < count; i += 1) {
          columnList.push(i)
        }
        return columnList
      })!,
    )
    clearList.push(
      setter(columnSizeMapAtom, (getter, prev) => {
        const count = getter(columnCountAtom)
        const sizeMap = new Map()
        for (let i = 0; i < count; i += 1) {
          sizeMap.set(i, columnCalcSize(i))
        }
        return sizeMap
      })!,
    )
    clearList.push(
      setter(rowListAtom, (getter, prev) => {
        const count = getter(rowCountAtom)
        const rowList = []
        for (let i = 0; i < count; i += 1) {
          rowList.push(i)
        }
        return rowList
      })!,
    )
    clearList.push(
      setter(rowSizeMapAtom, (getter, prev) => {
        const count = getter(rowCountAtom)
        const sizeMap = new Map()
        for (let i = 0; i < count; i += 1) {
          sizeMap.set(i, rowCalcSize(i))
        }
        return sizeMap
      })!,
    )
    return () => {
      clearList.forEach((clear) => {
        clear()
      })
    }
  }, [columnCalcSize, rowCalcSize])

  useEffect(() => {
    return clear
  }, [clear])

  const columnList = useAtomValue(columnListAtom, { store })
  const rowList = useAtomValue(rowListAtom, { store })
  const columnSizeMap = useAtomValue(columnSizeMapAtom, { store })
  const rowSizeMap = useAtomValue(rowSizeMapAtom, { store })

  const newRowCalcSize = useCallback(
    (index: number) => {
      const gridIndex = rowList[index]
      return rowSizeMap.get(gridIndex)!
    },
    [rowList, rowSizeMap],
  )

  const newColumnCalcSize = useCallback(
    (index: number) => {
      const gridIndex = columnList[index]
      return columnSizeMap.get(gridIndex)!
    },
    [columnList, columnSizeMap],
  )

  const newTheadCalcSize = useCallback(
    (index: number) => {
      return theadCalcSize(index)
    },
    [theadCalcSize],
  )

  const onResize = useCallback(
    (param: ResizeParam) => {
      setter(resizeAtom, param)
    },
    [resizeAtom, setter],
  )

  return {
    rowCount: rowList.length,
    columnCount: columnList.length,
    rowCalcSize: newRowCalcSize,
    columnCalcSize: newColumnCalcSize,
    theadCalcSize: newTheadCalcSize,
    onResize,
  }
}
