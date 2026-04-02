import type { ColumnId, RowId, CellId, PositionId } from '@grid-table/basic'
import type { ComponentType, ReactNode } from 'react'

export type EditorType = 'input' | 'number' | 'select' | 'textarea'

export type EditSelectOption = {
  label: ReactNode
  value: unknown
  disabled?: boolean
}

export type CellEditorProps<ItemInfo = Record<string, any>> = {
  value: unknown
  rowData: ItemInfo
  position: PositionId
  onSave: (value: unknown) => void
  onCancel: () => void
  error?: string
}

export type EditValidator = (
  value: unknown,
  rowData: Record<string, any>,
  position: PositionId,
) => string | undefined | Promise<string | undefined>

export type EditTrigger = 'click' | 'dblclick'

export type ColumnEditOptions<ItemInfo = Record<string, any>> = {
  editable?: boolean | ((rowData: ItemInfo) => boolean)
  editType?: EditorType
  editRender?: ComponentType<CellEditorProps<ItemInfo>>
  editValidator?: EditValidator
  editSelectOptions?: EditSelectOption[] | ((rowData: ItemInfo) => EditSelectOption[])
  editNumberConfig?: {
    min?: number
    max?: number
    step?: number
    precision?: number
  }
}

export type CellEditEvent<ItemInfo = Record<string, any>> = {
  rowId: RowId
  columnId: ColumnId
  cellId: CellId
  oldValue: unknown
  newValue: unknown
  rowData: ItemInfo
}

export type UseEditCellProps<ItemInfo = Record<string, any>> = {
  editTrigger?: EditTrigger
  onCellEditEnd?: (event: CellEditEvent<ItemInfo>) => void | false | Promise<void | false>
  onCellEditStart?: (position: PositionId, rowData: ItemInfo) => void | false
  cellEditable?: (rowData: ItemInfo, columnId: ColumnId) => boolean
  editMode?: 'cell' | 'row'
}
