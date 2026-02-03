import { useState, useCallback } from 'react'
import { useTablePasteData } from './useTablePaste'

/**
 * 列格式化配置
 */
export type ColumnFormatter = {
  /** 格式化方法，支持同步或异步 */
  formatter?: (value: string, rowIndex: number, colIndex: number) => string | Promise<string>
}

/**
 * 带格式化功能的表格粘贴 hook 的返回值
 */
export type UseTablePasteWithFormatterResult = {
  /** 粘贴处理函数 */
  handlePaste: (e: ClipboardEvent) => void
  /** 是否正在处理中 */
  isLoading: boolean
  /** 当前进度百分比 0-100 */
  progress: number
  /** 已处理的单元格数量 */
  processed: number
  /** 总单元格数量 */
  total: number
  /** 预计剩余时间（毫秒） */
  estimatedTimeLeft: number
  /** 错误信息 */
  error: Error | null
  /** 格式化后的数据 */
  data: string[][] | null
}

/**
 * 带格式化功能的表格粘贴 hook
 * 支持按列配置格式化方法（可异步），并提供进度反馈
 * 
 * @example
 * const { handlePaste, isLoading, progress, error, data } = useTablePasteWithFormatter({
 *   columns: [
 *     { formatter: (v) => v.toUpperCase() },
 *     { formatter: async (v) => await api(v) },
 *   ],
 * })
 */
export function useTablePasteWithFormatter(options: {
  /** 列配置数组，索引对应列索引 */
  columns: ColumnFormatter[]
  /** 完成回调（可选） */
  onComplete?: (data: string[][]) => void
}): UseTablePasteWithFormatterResult {
  const { columns, onComplete } = options

  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processed, setProcessed] = useState(0)
  const [total, setTotal] = useState(0)
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<string[][] | null>(null)

  const handlePaste = useTablePasteData(
    useCallback(
      async (rawData) => {
        if (!rawData || rawData.length === 0) {
          setData([])
          onComplete?.([])
          return
        }

        try {
          setIsLoading(true)
          setError(null)
          setData(null)

          const totalCells = rawData.reduce((sum, row) => sum + row.length, 0)
          setTotal(totalCells)
          setProcessed(0)
          setProgress(0)

          let processedCells = 0
          const startTime = Date.now()

          const formattedData: string[][] = []

          for (let rowIndex = 0; rowIndex < rawData.length; rowIndex++) {
            const row = rawData[rowIndex]
            const formattedRow: string[] = []

            for (let colIndex = 0; colIndex < row.length; colIndex++) {
              const cellValue = row[colIndex]
              const column = columns[colIndex]

              // 如果该列有格式化方法，则应用格式化
              let formattedValue = cellValue
              if (column?.formatter) {
                formattedValue = await Promise.resolve(
                  column.formatter(cellValue, rowIndex, colIndex),
                )
              }

              formattedRow.push(formattedValue)
              processedCells++

              // 更新进度
              if (processedCells % 10 === 0 || processedCells === totalCells) {
                const currentProgress = (processedCells / totalCells) * 100
                const elapsed = Date.now() - startTime
                const averageTimePerCell = elapsed / processedCells
                const remainingCells = totalCells - processedCells
                const timeLeft = averageTimePerCell * remainingCells

                setProgress(Math.min(100, Math.round(currentProgress)))
                setProcessed(processedCells)
                setEstimatedTimeLeft(Math.round(timeLeft))
              }
            }

            formattedData.push(formattedRow)
          }

          // 完成
          setProgress(100)
          setProcessed(totalCells)
          setEstimatedTimeLeft(0)
          setData(formattedData)
          setIsLoading(false)

          onComplete?.(formattedData)
        } catch (err) {
          const errorObj = err instanceof Error ? err : new Error(String(err))
          setError(errorObj)
          setIsLoading(false)
          setProgress(0)
          setProcessed(0)
          setEstimatedTimeLeft(0)
        }
      },
      [columns, onComplete],
    ),
  )

  return {
    handlePaste,
    isLoading,
    progress,
    processed,
    total,
    estimatedTimeLeft,
    error,
    data,
  }
}
