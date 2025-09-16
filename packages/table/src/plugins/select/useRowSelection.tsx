import { useEffect, useMemo } from 'react'
import { useStore } from '@einfach/react'
import type { RowId } from '@grid-table/basic'
import { useData } from '../../core'
import type { ColumnType } from '../../types'
import { nodeSelectionSetAtom } from './state'
import { Checkbox, CheckboxRender } from './Checkbox'

export const ROW_SELECTION_COLUMN_KEY = '__row_selection_column__'

export interface UseRowSelectionProps<ItemInfo = Record<string, any>>
  extends Pick<
    ColumnType<ItemInfo>,
    'title' | 'fixed' | 'width' | 'render' | 'renderComponent' | 'align'
  > {
  // selectedRowKeys?: string[]
  onChange?: (selectedRowKeys: RowId[], rowInfoList: ItemInfo[]) => void
}

/**
 * 选择框
 * @param props
 */
export function useRowSelection<ItemInfo = Record<string, any>>(
  originalColumns: ColumnType[],
  props: UseRowSelectionProps<ItemInfo> | undefined,
) {
  const { getRowInfoAtomByRowId } = useData()
  const store = useStore()

  useEffect(() => {
    if (!props?.onChange) {
      return
    }
    store.sub(nodeSelectionSetAtom, () => {
      const selectIds = Array.from(store.getter(nodeSelectionSetAtom))
      const rowInfoList = selectIds.map((tRowId) => {
        return store.getter(getRowInfoAtomByRowId(tRowId)) as ItemInfo
      })
      props?.onChange?.(selectIds, rowInfoList)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.onChange])

  const { width, title, render, fixed, renderComponent, align } = props || {}

  return useMemo(() => {
    if (!props) {
      return originalColumns
    }
    // 检查是否已经包含序号列，避免重复添加
    const hasRowNumberColumn = originalColumns.some((col) => col.key === ROW_SELECTION_COLUMN_KEY)

    if (hasRowNumberColumn) {
      return originalColumns
    }

    const option: ColumnType<ItemInfo> = {
      title: title || <Checkbox />,
      width: width,
      render: render || CheckboxRender,
      renderComponent: renderComponent,
      fixed: fixed,
      enableSelectArea: false,
      align: align,
      key: ROW_SELECTION_COLUMN_KEY,
    }

    return [option, ...originalColumns]
  }, [originalColumns, width, title, render, fixed, renderComponent, align])
}
