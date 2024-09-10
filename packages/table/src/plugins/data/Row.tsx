import type { RowProps } from '@grid-table/core'
import { useRow } from '../../hooks'
import { useRowInfo } from './useRowInfo'

export function Row(props: RowProps) {
  const { children } = props
  const { style, className, rowIndex } = useRow(props)
  const { rowInfo } = useRowInfo({ rowIndex })

  console.log(`rowIndex:${rowIndex} rowInfo`, rowInfo)

  return (
    <div style={style} className={className} role="row">
      {children}
    </div>
  )
}
