import type { CustomCellProps } from './type'

export function ColumnNickName({ rowInfo }: CustomCellProps) {
  return <>{rowInfo.initiator.nickName || rowInfo.initiator.userName}</>
}
