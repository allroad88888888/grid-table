import {
  processHtmlWithImages,
  parseTableData,
  parseCsv,
} from '../processHtml'

describe('processHtmlWithImages', () => {
  it('should replace image src with base64 data', () => {
    const html = '<div><img src="old-src.png" /></div>'
    const images = ['data:image/png;base64,abc123']

    const result = processHtmlWithImages(html, images)

    expect(result).toContain('data:image/png;base64,abc123')
    expect(result).not.toContain('old-src.png')
  })

  it('should replace multiple images in order', () => {
    const html = '<div><img src="1.png" /><img src="2.png" /></div>'
    const images = ['data:image/png;base64,first', 'data:image/png;base64,second']

    const result = processHtmlWithImages(html, images)

    expect(result).toContain('data:image/png;base64,first')
    expect(result).toContain('data:image/png;base64,second')
  })

  it('should return original HTML when no images provided', () => {
    const html = '<div><img src="test.png" /></div>'

    const result = processHtmlWithImages(html, [])

    expect(result).toBe(html)
  })

  it('should return original HTML when HTML is empty', () => {
    const result = processHtmlWithImages('', ['image-data'])

    expect(result).toBe('')
  })

  it('should handle more images in HTML than in array', () => {
    const html = '<div><img src="1.png" /><img src="2.png" /><img src="3.png" /></div>'
    const images = ['data:image/png;base64,only-one']

    const result = processHtmlWithImages(html, images)

    // 只有第一个图片应该被替换
    expect(result).toContain('data:image/png;base64,only-one')
  })

  it('should handle HTML without images', () => {
    const html = '<div><p>No images here</p></div>'
    const images = ['data:image/png;base64,unused']

    const result = processHtmlWithImages(html, images)

    expect(result).toContain('No images here')
  })
})

describe('parseTableData', () => {
  it('should parse simple table', () => {
    const html = `
      <table>
        <tr><td>A1</td><td>B1</td></tr>
        <tr><td>A2</td><td>B2</td></tr>
      </table>
    `

    const result = parseTableData(html)

    expect(result).toEqual([
      ['A1', 'B1'],
      ['A2', 'B2'],
    ])
  })

  it('should parse table with headers', () => {
    const html = `
      <table>
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Data 1</td><td>Data 2</td></tr>
      </table>
    `

    const result = parseTableData(html)

    expect(result).toEqual([
      ['Header 1', 'Header 2'],
      ['Data 1', 'Data 2'],
    ])
  })

  it('should return null when no table found', () => {
    const html = '<div><p>No table here</p></div>'

    const result = parseTableData(html)

    expect(result).toBeNull()
  })

  it('should handle empty table', () => {
    const html = '<table></table>'

    const result = parseTableData(html)

    expect(result).toEqual([])
  })

  it('should parse first table only when multiple tables exist', () => {
    const html = `
      <table>
        <tr><td>First</td></tr>
      </table>
      <table>
        <tr><td>Second</td></tr>
      </table>
    `

    const result = parseTableData(html)

    expect(result).toEqual([['First']])
  })

  it('should handle cells with whitespace', () => {
    const html = `
      <table>
        <tr><td>  spaced  </td><td>normal</td></tr>
      </table>
    `

    const result = parseTableData(html)

    expect(result).toEqual([['  spaced  ', 'normal']])
  })

  it('should extract text content only (strip HTML tags)', () => {
    const html = `
      <table>
        <tr><td><strong>Bold</strong></td><td><a href="#">Link</a></td></tr>
      </table>
    `

    const result = parseTableData(html)

    expect(result).toEqual([['Bold', 'Link']])
  })
})

describe('parseCsv', () => {
  it('should parse comma-separated values', () => {
    const csv = 'a,b,c\n1,2,3\n4,5,6'

    const result = parseCsv(csv)

    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ])
  })

  it('should parse tab-separated values', () => {
    const tsv = 'a\tb\tc\n1\t2\t3'

    const result = parseCsv(tsv)

    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ])
  })

  it('should trim cell values', () => {
    const csv = ' a , b , c \n 1 , 2 , 3 '

    const result = parseCsv(csv)

    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ])
  })

  it('should handle single row', () => {
    const csv = 'a,b,c'

    const result = parseCsv(csv)

    expect(result).toEqual([['a', 'b', 'c']])
  })

  it('should handle single column', () => {
    const csv = 'a\nb\nc'

    const result = parseCsv(csv)

    expect(result).toEqual([['a'], ['b'], ['c']])
  })

  it('should handle empty input', () => {
    const csv = ''

    const result = parseCsv(csv)

    expect(result).toEqual([['']])
  })

  it('should prefer tab delimiter over comma when both present', () => {
    const mixed = 'a,b\tc,d\n1,2\t3,4'

    const result = parseCsv(mixed)

    // Tab delimiter should be used
    expect(result).toEqual([
      ['a,b', 'c,d'],
      ['1,2', '3,4'],
    ])
  })
})
