import type { PasteItem } from '../types'

/**
 * 提取 RTF 富文本数据
 */
export function extractRtfData(
  clipboardData: DataTransfer,
  timestamp: number,
): PasteItem | null {
  const rtfData = clipboardData.getData('text/rtf')
  if (!rtfData) return null

  return {
    id: `rtf-${timestamp}`,
    type: 'rtf',
    content: rtfData,
    mimeType: 'text/rtf',
  }
}

/**
 * 提取 CSV 数据
 */
export function extractCsvData(
  clipboardData: DataTransfer,
  timestamp: number,
): PasteItem | null {
  const csvData = clipboardData.getData('text/csv')
  if (!csvData) return null

  return {
    id: `csv-${timestamp}`,
    type: 'csv',
    content: csvData,
    mimeType: 'text/csv',
  }
}

/**
 * 提取 JSON 数据
 */
export function extractJsonData(
  clipboardData: DataTransfer,
  timestamp: number,
): PasteItem | null {
  const jsonData = clipboardData.getData('application/json')
  if (!jsonData) return null

  return {
    id: `json-${timestamp}`,
    type: 'json',
    content: jsonData,
    mimeType: 'application/json',
  }
}

/**
 * 提取 URL 列表数据
 */
export function extractUrlData(
  clipboardData: DataTransfer,
  timestamp: number,
): PasteItem | null {
  const urlData = clipboardData.getData('text/uri-list')
  if (!urlData) return null

  return {
    id: `url-${timestamp}`,
    type: 'url',
    content: urlData,
    mimeType: 'text/uri-list',
  }
}
