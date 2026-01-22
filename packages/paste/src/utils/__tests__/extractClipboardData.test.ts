import {
  extractRtfData,
  extractCsvData,
  extractJsonData,
  extractUrlData,
} from '../extractClipboardData'

/**
 * 创建模拟的 DataTransfer 对象
 */
function createMockDataTransfer(data: Record<string, string>): DataTransfer {
  return {
    getData: (type: string) => data[type] || '',
  } as DataTransfer
}

describe('extractRtfData', () => {
  const timestamp = 1234567890

  it('should extract RTF data', () => {
    const rtfContent = '{\\rtf1\\ansi Hello World}'
    const clipboardData = createMockDataTransfer({
      'text/rtf': rtfContent,
    })

    const result = extractRtfData(clipboardData, timestamp)

    expect(result).toEqual({
      id: `rtf-${timestamp}`,
      type: 'rtf',
      content: rtfContent,
      mimeType: 'text/rtf',
    })
  })

  it('should return null when no RTF data', () => {
    const clipboardData = createMockDataTransfer({})

    const result = extractRtfData(clipboardData, timestamp)

    expect(result).toBeNull()
  })
})

describe('extractCsvData', () => {
  const timestamp = 1234567890

  it('should extract CSV data', () => {
    const csvContent = 'a,b,c\n1,2,3'
    const clipboardData = createMockDataTransfer({
      'text/csv': csvContent,
    })

    const result = extractCsvData(clipboardData, timestamp)

    expect(result).toEqual({
      id: `csv-${timestamp}`,
      type: 'csv',
      content: csvContent,
      mimeType: 'text/csv',
    })
  })

  it('should return null when no CSV data', () => {
    const clipboardData = createMockDataTransfer({})

    const result = extractCsvData(clipboardData, timestamp)

    expect(result).toBeNull()
  })
})

describe('extractJsonData', () => {
  const timestamp = 1234567890

  it('should extract JSON data', () => {
    const jsonContent = '{"key": "value"}'
    const clipboardData = createMockDataTransfer({
      'application/json': jsonContent,
    })

    const result = extractJsonData(clipboardData, timestamp)

    expect(result).toEqual({
      id: `json-${timestamp}`,
      type: 'json',
      content: jsonContent,
      mimeType: 'application/json',
    })
  })

  it('should return null when no JSON data', () => {
    const clipboardData = createMockDataTransfer({})

    const result = extractJsonData(clipboardData, timestamp)

    expect(result).toBeNull()
  })
})

describe('extractUrlData', () => {
  const timestamp = 1234567890

  it('should extract URL data', () => {
    const urlContent = 'https://example.com'
    const clipboardData = createMockDataTransfer({
      'text/uri-list': urlContent,
    })

    const result = extractUrlData(clipboardData, timestamp)

    expect(result).toEqual({
      id: `url-${timestamp}`,
      type: 'url',
      content: urlContent,
      mimeType: 'text/uri-list',
    })
  })

  it('should return null when no URL data', () => {
    const clipboardData = createMockDataTransfer({})

    const result = extractUrlData(clipboardData, timestamp)

    expect(result).toBeNull()
  })
})
