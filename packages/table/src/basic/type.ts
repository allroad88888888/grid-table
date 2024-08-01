import type { Store, AtomEntity } from 'einfach-state'
import type { GetAtomById } from '../utils/createAtomFamily'
import type { CSSProperties } from 'react'

interface CommonState {
  style?: CSSProperties
  className?: Set<string>
}

export interface ColumnItemState extends CommonState {

}

export interface RowItemState extends CommonState {

}

export interface TableOption {
  rowBaseSize?: number
  columnBaseSize?: number
  theadBaseSize?: number
}

export interface BasicStore {
  store: Store
  columnListAtom: AtomEntity<number[]>
  rowListAtom: AtomEntity<number[]>
  getCellStateAtomByIndex: GetAtomById<number, ColumnItemState>
  getRowStateAtomByIndex: GetAtomById<number, ColumnItemState>
  columnSizeMapAtom: AtomEntity<Map<number, number>>
  rowSizeMapAtom: AtomEntity<Map<number, number>>
  hasInitAtom: AtomEntity<boolean>
  optionsAtom: AtomEntity<TableOption>
  clear: () => void
}

export interface UseBasicInitProps extends TableOption {
  columnCount: number
  columnCalcSize: (index: number) => number
  rowCount: number
  rowCalcSize: (index: number) => number
  theadRowCount?: number
  /**
   * 没有就取 rowCalcSize
   * @param index
   * @returns
   */
  theadCalcSize?: (index: number) => number

}
