/**
 * 将二维数组格式化为 TSV（Tab-Separated Values）格式字符串
 * 每列用 tab 分隔，每行用换行符分隔
 */
export function formatToTsv(data: string[][]): string {
  return data.map((row) => row.join('\t')).join('\n')
}

/**
 * 将 HTML 表格内容转换为 TSV 格式
 */
export function htmlTableToTsv(html: string): string | null {
  const tableData = parseHtmlTable(html)
  if (!tableData || tableData.length === 0) return null

  return formatToTsv(tableData)
}

/**
 * 将 CSV 内容转换为 TSV 格式
 */
export function csvToTsv(csv: string): string {
  const lines = csv.trim().split('\n')
  const delimiter = csv.includes('\t') ? '\t' : ','

  const data = lines.map((line) =>
    line.split(delimiter).map((cell) => cell.trim()),
  )

  return formatToTsv(data)
}

/**
 * 解析 HTML 表格为二维数组
 */
export function parseHtmlTable(html: string): string[][] | null {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const tables = doc.querySelectorAll('table')

  if (tables.length === 0) return null

  const result: string[][] = []
  const table = tables[0]
  const rows = table.querySelectorAll('tr')

  rows.forEach((row) => {
    const rowData: string[] = []
    const cells = row.querySelectorAll('td, th')
    cells.forEach((cell) => {
      rowData.push(cell.textContent?.trim() || '')
    })
    if (rowData.length > 0) {
      result.push(rowData)
    }
  })

  return result
}

/**
 * 智能转换粘贴内容为 TSV 格式
 * 自动检测输入格式（HTML 表格、CSV、纯文本表格）
 */
export function convertToTsv(content: string, mimeType?: string): string | null {
  // 如果明确是 HTML 类型
  if (mimeType === 'text/html' || content.includes('<table')) {
    return htmlTableToTsv(content)
  }

  // 如果明确是 CSV 类型或包含逗号/制表符分隔的多行数据
  if (mimeType === 'text/csv' || isTabularData(content)) {
    return csvToTsv(content)
  }

  // 尝试作为纯文本表格处理（空格分隔）
  const lines = content.trim().split('\n')
  if (lines.length > 1) {
    const data = lines.map((line) => line.split(/\s{2,}/).map((cell) => cell.trim()))
    // 检查是否每行列数一致
    const colCount = data[0].length
    if (colCount > 1 && data.every((row) => row.length === colCount)) {
      return formatToTsv(data)
    }
  }

  return null
}

/**
 * 检查内容是否为表格数据
 */
function isTabularData(content: string): boolean {
  const lines = content.trim().split('\n')
  if (lines.length < 1) return false

  const hasCommas = lines[0].includes(',')
  const hasTabs = lines[0].includes('\t')

  return hasCommas || hasTabs
}

/**
 * 从剪贴板数据提取并转换为 TSV 格式
 * 优先使用 HTML 表格，其次使用纯文本
 */
export function extractAndConvertToTsv(clipboardData: DataTransfer): string | null {
  // 优先尝试 HTML 格式（Excel 复制通常带有 HTML）
  const htmlContent = clipboardData.getData('text/html')
  if (htmlContent) {
    const tsv = htmlTableToTsv(htmlContent)
    if (tsv) return tsv
  }

  // 尝试纯文本格式
  const textContent = clipboardData.getData('text/plain')
  if (textContent) {
    return convertToTsv(textContent)
  }

  return null
}
