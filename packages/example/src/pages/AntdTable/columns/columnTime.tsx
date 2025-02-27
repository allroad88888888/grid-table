import type { CustomCellProps } from './type'

export function filerZero(t: number) {
  return t < 10 ? `0${t}` : t
}

export function timeFormat(t: string) {
  const date = new Date(Number(t))
  // eslint-disable-next-line max-len
  return `${date.getFullYear()}-${filerZero(date.getMonth() + 1)}-${filerZero(date.getDate())} ${filerZero(date.getHours())}:${filerZero(date.getMinutes())}:${filerZero(date.getSeconds())}`
}

export function ColumnTime({ text }: CustomCellProps) {
  return <>{text ? timeFormat(text) : ''}</>
}
