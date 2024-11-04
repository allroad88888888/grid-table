import type { ColumnProps } from './type'

export function ColumnNickName({ rowInfo }: ColumnProps) {
  return <>{rowInfo.initiator.nickName || rowInfo.initiator.userName}</>
}
