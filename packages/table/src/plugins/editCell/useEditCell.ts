import { useCallback } from 'react'
import { useStore } from '@einfach/react'
import type { PositionId } from '@grid-table/basic'
import { editingCellAtom, editingValueAtom, editingErrorAtom } from './state'
import type { UseEditCellProps } from './types'

/**
 * 单元格编辑插件主 hook
 * 当前版本：状态管理 + 编辑生命周期
 * 编辑器 UI 组件由用户通过 column.editRender 或 column.editType 提供
 */
export function useEditCell<ItemInfo = Record<string, any>>(
  props: UseEditCellProps<ItemInfo> = {},
) {
  const { onCellEditEnd, onCellEditStart } = props
  const store = useStore()

  const startEdit = useCallback(
    (position: PositionId, rowData: ItemInfo, initialValue: unknown) => {
      const shouldStart = onCellEditStart?.(position, rowData)
      if (shouldStart === false) return false

      store.setter(editingCellAtom, position)
      store.setter(editingValueAtom, initialValue)
      store.setter(editingErrorAtom, undefined)
      return true
    },
    [store, onCellEditStart],
  )

  const cancelEdit = useCallback(() => {
    store.setter(editingCellAtom, null)
    store.setter(editingValueAtom, undefined)
    store.setter(editingErrorAtom, undefined)
  }, [store])

  const saveEdit = useCallback(
    async (newValue: unknown) => {
      const position = store.getter(editingCellAtom)
      if (!position) return false

      if (onCellEditEnd) {
        const result = await onCellEditEnd({
          rowId: position.rowId,
          columnId: position.columnId,
          cellId: position.cellId,
          oldValue: store.getter(editingValueAtom),
          newValue,
          rowData: {} as ItemInfo,
        })
        if (result === false) return false
      }

      store.setter(editingCellAtom, null)
      store.setter(editingValueAtom, undefined)
      store.setter(editingErrorAtom, undefined)
      return true
    },
    [store, onCellEditEnd],
  )

  return { startEdit, cancelEdit, saveEdit }
}
