import type { RowProps } from '@grid-table/core'
import { useRow } from '../hooks/useRow'

export function Row(props: RowProps) {
  const { children } = props
  const { style, className } = useRow(props)

  return (
    <div style={style} className={className} role="row">
      {children}
    </div>
  )
}
