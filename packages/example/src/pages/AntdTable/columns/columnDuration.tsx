import { filerZero } from './columnTime'
import type { ColumnProps } from './type'

function formatDuration(startTime?: number, endTime?: number) {
  if (!startTime || !endTime) {
    return ''
  }
  const length = endTime - startTime
  const h = Math.floor(length / (1000 * 60 * 60))

  const m = Math.floor((length - h * 1000 * 60 * 60) / (1000 * 60))
  const s = Math.floor((length - h * 1000 * 60 * 60 - m * 1000 * 60) / 1000)
  return `${filerZero(h)}:${filerZero(m)}:${filerZero(s)}`
}

export function ColumnDuration({ rowInfo }: ColumnProps) {
  return <>{formatDuration(rowInfo.start_time, rowInfo.end_time)}</>
}
