import { useMemo } from 'react'
import type { ColumnType } from '../../types'
import { RowNumberCell } from './RowNumberCell'
import type { UseRowNumberProps, RowNumberColumnConfig } from './types'

/**
 * 序号列的列配置key，用于标识序号列
 */
export const ROW_NUMBER_COLUMN_KEY = '__row_number_column__'

/**
 * 创建序号列的配置
 */
function createRowNumberColumn(config: RowNumberColumnConfig): ColumnType {
  return {
    key: ROW_NUMBER_COLUMN_KEY,
    title: config.title,
    width: config.width,
    flexGrow: 0,
    fixed: 'left',
    enableSelectArea: false,
    align: 'center',
    renderComponent: (props) => RowNumberCell({ ...props, startIndex: config.startIndex }),
    dataIndex: ROW_NUMBER_COLUMN_KEY,
  }
}

/**
 * 序号列 Hook
 * 用于在列配置的第一列添加序号列
 */
export function useRowNumber(
  originalColumns: ColumnType[],
  props: UseRowNumberProps = {},
): ColumnType[] {
  const { enabled = false, width = 30, title = '#', startIndex = 1 } = props

  return useMemo(() => {
    if (!enabled) {
      return originalColumns
    }

    // 检查是否已经包含序号列，避免重复添加
    const hasRowNumberColumn = originalColumns.some((col) => col.key === ROW_NUMBER_COLUMN_KEY)

    if (hasRowNumberColumn) {
      return originalColumns
    }

    // 创建序号列配置
    const config: RowNumberColumnConfig = {
      width,
      title,
      startIndex,
    }

    const rowNumberColumn = createRowNumberColumn(config)

    // 在第一列位置插入序号列
    return [rowNumberColumn, ...originalColumns]
  }, [originalColumns, enabled, width, title, startIndex])
}
