import type { CustomCellProps } from '../../types'

export type RowNumberCellProps = CustomCellProps & {
  startIndex: number
}

/**
 * 序号列单元格组件
 */
export function RowNumberCell({ position, startIndex }: RowNumberCellProps) {
  // 计算当前行的序号：起始索引 + 当前行索引
  const rowNumber = startIndex + position.rowIndex

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--color-text-secondary, #666)',
        fontSize: '14px',
        fontWeight: 'normal',
      }}
    >
      {rowNumber}
    </div>
  )
}
