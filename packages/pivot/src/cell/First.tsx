import type { CustomCellProps } from '@grid-table/view'
import { CellString } from './String'
import { TreeItem } from '../tree/TreeItem'

export function CellFirst({ text, rowInfo, position }: CustomCellProps) {
  return (
    <>
      <CellString text={text} rowInfo={rowInfo} position={position} />
      <TreeItem id={text!} enable={true} />
    </>
  )
}
