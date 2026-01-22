import type { PasteItem } from '../types'

/**
 * 从纯文本中检测并解析特殊格式
 */
export function detectSpecialFormat(
  text: string,
  timestamp: number,
): PasteItem | null {
  // 检测 JSON 格式
  if (isValidJson(text)) {
    return {
      id: `json-detected-${timestamp}`,
      type: 'json',
      content: text,
      mimeType: 'application/json',
    }
  }

  // 检测 URL 格式
  if (isValidUrl(text)) {
    return {
      id: `url-detected-${timestamp}`,
      type: 'url',
      content: text,
      mimeType: 'text/uri-list',
    }
  }

  // 检测 CSV 格式
  if (isLikelyCsv(text)) {
    return {
      id: `csv-detected-${timestamp}`,
      type: 'csv',
      content: text,
      mimeType: 'text/csv',
    }
  }

  return null
}

/**
 * 检查是否为有效的 JSON
 */
export function isValidJson(text: string): boolean {
  const trimmed = text.trim()
  if (
    !(trimmed.startsWith('{') && trimmed.endsWith('}')) &&
    !(trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    return false
  }

  try {
    JSON.parse(trimmed)
    return true
  } catch {
    return false
  }
}

/**
 * 检查是否为有效的 URL
 */
export function isValidUrl(text: string): boolean {
  const trimmed = text.trim()
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 检查是否可能是 CSV 格式
 */
export function isLikelyCsv(text: string): boolean {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return false

  const firstLineCommas = (lines[0].match(/,/g) || []).length
  const firstLineTabs = (lines[0].match(/\t/g) || []).length

  if (firstLineCommas === 0 && firstLineTabs === 0) return false

  const delimiter = firstLineTabs > firstLineCommas ? '\t' : ','
  const expectedCount = delimiter === '\t' ? firstLineTabs : firstLineCommas

  let matchingLines = 0
  for (const line of lines) {
    const count = (line.match(new RegExp(delimiter, 'g')) || []).length
    if (count === expectedCount) {
      matchingLines++
    }
  }

  return matchingLines / lines.length >= 0.8
}
