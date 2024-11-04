import { useAtomValue } from 'einfach-state'
import type { RowProps } from '@grid-table/core'
import type { CSSProperties } from 'react'
import { useBasic } from '@grid-table/basic'

export function useRow({ rowIndex, style }: RowProps) {
  const { store, rowIndexListAtom, getRowStateAtomById: getRowStateAtomByIndex } = useBasic()
  const rowList = useAtomValue(rowIndexListAtom, { store })
  const gridRowIndex = rowList[rowIndex]
  const { style: rowStyle = {}, className } = useAtomValue(getRowStateAtomByIndex(gridRowIndex), {
    store,
  })

  return {
    rowIndex: gridRowIndex,
    className: className ? Array.from(className).join(' ') : '',
    style: {
      ...style,
      ...rowStyle,
    } as CSSProperties,
  }
}
