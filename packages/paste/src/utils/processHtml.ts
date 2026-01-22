/**
 * 处理 HTML 内容，将其中的图片 src 替换为 base64 数据
 */
export function processHtmlWithImages(
  htmlContent: string,
  images: string[],
): string {
  if (!htmlContent || images.length === 0) {
    return htmlContent
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const imgElements = doc.querySelectorAll('img')

  imgElements.forEach((img, index) => {
    if (index < images.length) {
      img.src = images[index]
    }
  })

  return doc.body.innerHTML
}

/**
 * 解析 HTML 中的表格数据
 */
export function parseTableData(html: string): string[][] | null {
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
      rowData.push(cell.textContent || '')
    })
    result.push(rowData)
  })

  return result
}

/**
 * 解析 CSV 字符串
 */
export function parseCsv(content: string): string[][] {
  const lines = content.trim().split('\n')
  const delimiter = content.includes('\t') ? '\t' : ','

  return lines.map((line) => line.split(delimiter).map((cell) => cell.trim()))
}
