import { useCallback } from 'react'
import { extractAndConvertToTsv, parseHtmlTable } from './formatOutput'

export type TablePasteResult = {
  /** TSV 格式的数据（tab 分隔，换行分行） */
  tsv: string | null
  /** 二维数组格式的数据 */
  data: string[][] | null
  /** 原始文本 */
  rawText: string
  /** 原始 HTML */
  rawHtml: string
}

type OnPasteCallback = (result: TablePasteResult) => void

/**
 * 表格粘贴处理 hook
 * 专门用于处理从 Excel/表格复制的数据，输出标准的 TSV 格式
 */
export function useTablePaste(onPaste: OnPasteCallback) {
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      e.preventDefault()
      const clipboardData = e.clipboardData
      if (!clipboardData) return

      const rawText = clipboardData.getData('text/plain')
      const rawHtml = clipboardData.getData('text/html')

      // 转换为 TSV 格式
      const tsv = extractAndConvertToTsv(clipboardData)

      // 解析为二维数组
      let data: string[][] | null = null
      if (rawHtml) {
        data = parseHtmlTable(rawHtml)
      }
      if (!data && tsv) {
        data = tsv.split('\n').map((line) => line.split('\t'))
      }

      onPaste({
        tsv,
        data,
        rawText,
        rawHtml,
      })
    },
    [onPaste],
  )

  return handlePaste
}

/**
 * 简化版：直接返回 TSV 字符串
 */
export function useTablePasteTsv(onPaste: (tsv: string | null) => void) {
  return useTablePaste((result) => {
    onPaste(result.tsv)
  })
}

/**
 * 简化版：直接返回二维数组
 */
export function useTablePasteData(onPaste: (data: string[][] | null) => void) {
  return useTablePaste((result) => {
    onPaste(result.data)
  })
}
