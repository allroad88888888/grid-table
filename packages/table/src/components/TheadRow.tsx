import type { RowProps } from '@grid-table/core'

export function TheadRow(props: RowProps) {
  const { children, style } = props

  return (
    <div style={style} role="row">
      {children}
    </div>
  )
}
