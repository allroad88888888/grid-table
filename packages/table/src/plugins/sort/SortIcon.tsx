import { memo } from 'react'
import type { SortIconProps } from './types'
import './sort.css'

export const SortIcon = memo(function SortIcon({ direction, priority }: SortIconProps) {
  return (
    <span className="grid-table-sort-icon">
      <span
        className={`grid-table-sort-arrow-up${direction === 'asc' ? ' grid-table-sort-active' : ''}`}
      />
      <span
        className={`grid-table-sort-arrow-down${direction === 'desc' ? ' grid-table-sort-active' : ''}`}
      />
      {priority !== undefined && priority > 1 ? (
        <span className="grid-table-sort-priority">{priority}</span>
      ) : null}
    </span>
  )
})
