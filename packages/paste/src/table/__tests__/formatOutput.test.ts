import {
  formatToTsv,
  htmlTableToTsv,
  csvToTsv,
  convertToTsv,
  extractAndConvertToTsv,
} from '../formatOutput'

describe('formatToTsv', () => {
  it('should format 2D array to TSV', () => {
    const data = [
      ['line_0014', '{"en":null,"zh-cn":"桌面收纳盒"}', '1'],
      ['line_0019', '{"en":null,"zh-cn":"护手霜"}', '1'],
    ]

    const result = formatToTsv(data)

    expect(result).toBe(
      'line_0014\t{"en":null,"zh-cn":"桌面收纳盒"}\t1\n' +
        'line_0019\t{"en":null,"zh-cn":"护手霜"}\t1',
    )
  })

  it('should handle single row', () => {
    const data = [['a', 'b', 'c']]

    const result = formatToTsv(data)

    expect(result).toBe('a\tb\tc')
  })

  it('should handle single column', () => {
    const data = [['a'], ['b'], ['c']]

    const result = formatToTsv(data)

    expect(result).toBe('a\nb\nc')
  })

  it('should handle empty array', () => {
    const result = formatToTsv([])

    expect(result).toBe('')
  })
})

describe('htmlTableToTsv', () => {
  it('should convert HTML table to TSV', () => {
    const html = `
      <table>
        <tr><td>line_0014</td><td>桌面收纳盒</td><td>1</td></tr>
        <tr><td>line_0019</td><td>护手霜</td><td>1</td></tr>
      </table>
    `

    const result = htmlTableToTsv(html)

    expect(result).toBe('line_0014\t桌面收纳盒\t1\nline_0019\t护手霜\t1')
  })

  it('should handle table with headers', () => {
    const html = `
      <table>
        <tr><th>ID</th><th>Name</th></tr>
        <tr><td>1</td><td>Test</td></tr>
      </table>
    `

    const result = htmlTableToTsv(html)

    expect(result).toBe('ID\tName\n1\tTest')
  })

  it('should return null for HTML without table', () => {
    const html = '<div>No table here</div>'

    const result = htmlTableToTsv(html)

    expect(result).toBeNull()
  })

  it('should trim cell content', () => {
    const html = `
      <table>
        <tr><td>  spaced  </td><td>normal</td></tr>
      </table>
    `

    const result = htmlTableToTsv(html)

    expect(result).toBe('spaced\tnormal')
  })
})

describe('csvToTsv', () => {
  it('should convert comma-separated CSV to TSV', () => {
    const csv = 'a,b,c\n1,2,3'

    const result = csvToTsv(csv)

    expect(result).toBe('a\tb\tc\n1\t2\t3')
  })

  it('should handle tab-separated input', () => {
    const tsv = 'a\tb\tc\n1\t2\t3'

    const result = csvToTsv(tsv)

    expect(result).toBe('a\tb\tc\n1\t2\t3')
  })

  it('should trim cell values', () => {
    const csv = ' a , b , c \n 1 , 2 , 3 '

    const result = csvToTsv(csv)

    expect(result).toBe('a\tb\tc\n1\t2\t3')
  })
})

describe('convertToTsv', () => {
  it('should convert HTML table content', () => {
    const html = '<table><tr><td>A</td><td>B</td></tr></table>'

    const result = convertToTsv(html, 'text/html')

    expect(result).toBe('A\tB')
  })

  it('should convert CSV content', () => {
    const csv = 'a,b,c\n1,2,3'

    const result = convertToTsv(csv, 'text/csv')

    expect(result).toBe('a\tb\tc\n1\t2\t3')
  })

  it('should auto-detect HTML table', () => {
    const html = '<table><tr><td>X</td><td>Y</td></tr></table>'

    const result = convertToTsv(html)

    expect(result).toBe('X\tY')
  })

  it('should return null for non-tabular content', () => {
    const text = 'Just plain text'

    const result = convertToTsv(text)

    expect(result).toBeNull()
  })
})

describe('extractAndConvertToTsv', () => {
  function createMockDataTransfer(data: Record<string, string>): DataTransfer {
    return {
      getData: (type: string) => data[type] || '',
    } as DataTransfer
  }

  it('should prioritize HTML format', () => {
    const clipboardData = createMockDataTransfer({
      'text/html': '<table><tr><td>HTML</td><td>Data</td></tr></table>',
      'text/plain': 'Text,Data',
    })

    const result = extractAndConvertToTsv(clipboardData)

    expect(result).toBe('HTML\tData')
  })

  it('should fallback to text when HTML has no table', () => {
    const clipboardData = createMockDataTransfer({
      'text/html': '<div>No table</div>',
      'text/plain': 'a,b\n1,2',
    })

    const result = extractAndConvertToTsv(clipboardData)

    expect(result).toBe('a\tb\n1\t2')
  })

  it('should handle Excel-like HTML table', () => {
    const excelHtml = `
      <table>
        <tr><td>line_0014</td><td>{"en":null,"zh-cn":"桌面收纳盒"}</td><td>1</td></tr>
        <tr><td>line_0019</td><td>{"en":null,"zh-cn":"护手霜"}</td><td>1</td></tr>
      </table>
    `
    const clipboardData = createMockDataTransfer({
      'text/html': excelHtml,
    })

    const result = extractAndConvertToTsv(clipboardData)

    expect(result).toBe(
      'line_0014\t{"en":null,"zh-cn":"桌面收纳盒"}\t1\n' +
        'line_0019\t{"en":null,"zh-cn":"护手霜"}\t1',
    )
  })
})
