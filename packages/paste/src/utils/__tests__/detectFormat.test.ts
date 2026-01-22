import {
  detectSpecialFormat,
  isValidJson,
  isValidUrl,
  isLikelyCsv,
} from '../detectFormat'

describe('isValidJson', () => {
  it('should return true for valid JSON object', () => {
    expect(isValidJson('{"name": "test"}')).toBe(true)
  })

  it('should return true for valid JSON array', () => {
    expect(isValidJson('[1, 2, 3]')).toBe(true)
  })

  it('should return false for invalid JSON', () => {
    expect(isValidJson('{invalid}')).toBe(false)
  })

  it('should handle whitespace', () => {
    expect(isValidJson('  { "key": "value" }  ')).toBe(true)
  })

  it('should return false for plain text', () => {
    expect(isValidJson('hello world')).toBe(false)
  })
})

describe('isValidUrl', () => {
  it('should return true for HTTP URL', () => {
    expect(isValidUrl('http://example.com')).toBe(true)
  })

  it('should return true for HTTPS URL', () => {
    expect(isValidUrl('https://example.com/path?q=1')).toBe(true)
  })

  it('should return false for file:// protocol', () => {
    expect(isValidUrl('file:///path/to/file')).toBe(false)
  })

  it('should return false for invalid URL', () => {
    expect(isValidUrl('not a url')).toBe(false)
  })

  it('should handle whitespace', () => {
    expect(isValidUrl('  https://example.com  ')).toBe(true)
  })
})

describe('isLikelyCsv', () => {
  it('should return true for comma-separated data', () => {
    expect(isLikelyCsv('a,b,c\n1,2,3\n4,5,6')).toBe(true)
  })

  it('should return true for tab-separated data', () => {
    expect(isLikelyCsv('a\tb\tc\n1\t2\t3')).toBe(true)
  })

  it('should return false for single line', () => {
    expect(isLikelyCsv('a,b,c')).toBe(false)
  })

  it('should return false for text without delimiters', () => {
    expect(isLikelyCsv('hello\nworld')).toBe(false)
  })

  it('should handle inconsistent columns', () => {
    // Less than 80% matching lines should return false
    const inconsistent = 'a,b,c\n1,2\n3\n4,5,6,7,8'
    expect(isLikelyCsv(inconsistent)).toBe(false)
  })
})

describe('detectSpecialFormat', () => {
  const timestamp = 1234567890

  describe('JSON detection', () => {
    it('should detect valid JSON object', () => {
      const jsonText = '{"name": "test", "value": 123}'

      const result = detectSpecialFormat(jsonText, timestamp)

      expect(result).toEqual({
        id: `json-detected-${timestamp}`,
        type: 'json',
        content: jsonText,
        mimeType: 'application/json',
      })
    })

    it('should detect valid JSON array', () => {
      const jsonText = '[1, 2, 3, "four"]'

      const result = detectSpecialFormat(jsonText, timestamp)

      expect(result?.type).toBe('json')
    })

    it('should not detect invalid JSON', () => {
      const invalidJson = '{invalid json}'

      const result = detectSpecialFormat(invalidJson, timestamp)

      expect(result?.type).not.toBe('json')
    })
  })

  describe('URL detection', () => {
    it('should detect HTTP URL', () => {
      const url = 'http://example.com/path'

      const result = detectSpecialFormat(url, timestamp)

      expect(result).toEqual({
        id: `url-detected-${timestamp}`,
        type: 'url',
        content: url,
        mimeType: 'text/uri-list',
      })
    })

    it('should detect HTTPS URL', () => {
      const url = 'https://example.com/path?query=1'

      const result = detectSpecialFormat(url, timestamp)

      expect(result?.type).toBe('url')
    })
  })

  describe('CSV detection', () => {
    it('should detect comma-separated CSV', () => {
      const csv = 'a,b,c\n1,2,3\n4,5,6'

      const result = detectSpecialFormat(csv, timestamp)

      expect(result).toEqual({
        id: `csv-detected-${timestamp}`,
        type: 'csv',
        content: csv,
        mimeType: 'text/csv',
      })
    })

    it('should detect tab-separated CSV', () => {
      const tsv = 'a\tb\tc\n1\t2\t3\n4\t5\t6'

      const result = detectSpecialFormat(tsv, timestamp)

      expect(result?.type).toBe('csv')
    })
  })

  it('should return null for plain text', () => {
    const plainText = 'Just some plain text'

    const result = detectSpecialFormat(plainText, timestamp)

    expect(result).toBeNull()
  })

  it('should prioritize JSON over CSV', () => {
    const jsonText = '{"a": 1}'

    const result = detectSpecialFormat(jsonText, timestamp)

    expect(result?.type).toBe('json')
  })
})
