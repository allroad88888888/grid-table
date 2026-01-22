import { extractTextData, extractHtmlData } from '../extractTextData'

/**
 * 创建模拟的 DataTransfer 对象
 */
function createMockDataTransfer(data: Record<string, string>): DataTransfer {
  return {
    getData: (type: string) => data[type] || '',
  } as DataTransfer
}

describe('extractTextData', () => {
  const timestamp = 1234567890

  it('should extract plain text data', () => {
    const clipboardData = createMockDataTransfer({
      'text/plain': 'Hello World',
    })

    const result = extractTextData(clipboardData, timestamp)

    expect(result).toEqual({
      id: `text-${timestamp}`,
      type: 'text',
      content: 'Hello World',
      mimeType: 'text/plain',
    })
  })

  it('should return null when no plain text data', () => {
    const clipboardData = createMockDataTransfer({})

    const result = extractTextData(clipboardData, timestamp)

    expect(result).toBeNull()
  })

  it('should return null for empty string', () => {
    const clipboardData = createMockDataTransfer({
      'text/plain': '',
    })

    const result = extractTextData(clipboardData, timestamp)

    expect(result).toBeNull()
  })

  it('should handle multiline text', () => {
    const multilineText = 'Line 1\nLine 2\nLine 3'
    const clipboardData = createMockDataTransfer({
      'text/plain': multilineText,
    })

    const result = extractTextData(clipboardData, timestamp)

    expect(result).not.toBeNull()
    expect(result?.content).toBe(multilineText)
  })

  it('should handle text with special characters', () => {
    const specialText = '特殊字符: <>&"\' 中文 😀'
    const clipboardData = createMockDataTransfer({
      'text/plain': specialText,
    })

    const result = extractTextData(clipboardData, timestamp)

    expect(result?.content).toBe(specialText)
  })
})

describe('extractHtmlData', () => {
  it('should extract HTML data', () => {
    const htmlContent = '<p>Hello <strong>World</strong></p>'
    const clipboardData = createMockDataTransfer({
      'text/html': htmlContent,
    })

    const result = extractHtmlData(clipboardData)

    expect(result).toBe(htmlContent)
  })

  it('should return empty string when no HTML data', () => {
    const clipboardData = createMockDataTransfer({})

    const result = extractHtmlData(clipboardData)

    expect(result).toBe('')
  })

  it('should handle complex HTML structure', () => {
    const complexHtml = `
      <table>
        <tr><td>Cell 1</td><td>Cell 2</td></tr>
        <tr><td>Cell 3</td><td>Cell 4</td></tr>
      </table>
    `
    const clipboardData = createMockDataTransfer({
      'text/html': complexHtml,
    })

    const result = extractHtmlData(clipboardData)

    expect(result).toBe(complexHtml)
  })
})
