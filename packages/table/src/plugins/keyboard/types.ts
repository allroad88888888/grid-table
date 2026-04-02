import type { ColumnId, RowId, CellId } from '@grid-table/basic'

export type FocusPosition = {
  rowId: RowId
  columnId: ColumnId
  cellId: CellId
  region: 'thead' | 'tbody'
}

export type NavigationDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'home'
  | 'end'
  | 'pageUp'
  | 'pageDown'
  | 'ctrlHome'
  | 'ctrlEnd'

export type KeyboardAction =
  | { type: 'navigate'; direction: NavigationDirection }
  | { type: 'select'; extend: boolean }
  | { type: 'edit'; key?: string }
  | { type: 'copy' }
  | { type: 'selectAll' }
  | { type: 'escape' }
  | { type: 'tab'; reverse: boolean }

export type GridAriaProps = {
  role: 'grid'
  'aria-rowcount': number
  'aria-colcount': number
  'aria-multiselectable'?: boolean
  'aria-activedescendant'?: string
  'aria-label'?: string
}

export type RowAriaProps = {
  role: 'row'
  'aria-rowindex': number
  'aria-selected'?: boolean
}

export type CellAriaProps = {
  role: 'gridcell' | 'columnheader' | 'rowheader'
  'aria-colindex': number
  'aria-selected'?: boolean
  'aria-sort'?: 'ascending' | 'descending' | 'none'
  'aria-expanded'?: boolean
  id?: string
  tabIndex?: -1 | 0
}

export type UseKeyboardProps = {
  enableKeyboard?: boolean
  enableAria?: boolean
  keyboardHandler?: (
    event: KeyboardEvent,
    focusPosition: FocusPosition | null,
  ) => KeyboardAction | undefined
  ariaLabel?: string
  onFocusChange?: (position: FocusPosition | null) => void
  scrollToFocus?: boolean
}
