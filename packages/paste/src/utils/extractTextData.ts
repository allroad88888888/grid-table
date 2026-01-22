import type { PasteItem } from '../types'

/**
 * 从剪贴板提取纯文本数据
 */
export function extractTextData(
  clipboardData: DataTransfer,
  timestamp: number,
): PasteItem | null {
  const plainText = clipboardData.getData('text/plain')
  if (!plainText) return null

  return {
    id: `text-${timestamp}`,
    type: 'text',
    content: plainText,
    mimeType: 'text/plain',
  }
}

/**
 * 从剪贴板提取 HTML 数据
 */
export function extractHtmlData(clipboardData: DataTransfer): string {
  return clipboardData.getData('text/html')
}
