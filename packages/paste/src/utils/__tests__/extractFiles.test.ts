import {
  extractFileData,
  collectNonImageFiles,
  isTextFile,
} from '../extractFiles'

/**
 * 创建模拟的 File 对象
 */
function createMockFile(content: string, name: string, type: string): File {
  const blob = new Blob([content], { type })
  return new File([blob], name, { type })
}

/**
 * 创建模拟的 FileList 对象
 */
function createMockFileList(files: File[]): FileList {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () {
      for (const file of files) {
        yield file
      }
    },
  } as FileList

  files.forEach((file, index) => {
    Object.defineProperty(fileList, index, { value: file })
  })

  return fileList
}

describe('isTextFile', () => {
  it('should return true for .txt files', () => {
    expect(isTextFile('document.txt')).toBe(true)
  })

  it('should return true for .json files', () => {
    expect(isTextFile('data.json')).toBe(true)
  })

  it('should return true for .csv files', () => {
    expect(isTextFile('data.csv')).toBe(true)
  })

  it('should return true for .md files', () => {
    expect(isTextFile('README.md')).toBe(true)
  })

  it('should return true for code files', () => {
    expect(isTextFile('app.js')).toBe(true)
    expect(isTextFile('app.ts')).toBe(true)
    expect(isTextFile('style.css')).toBe(true)
    expect(isTextFile('index.html')).toBe(true)
  })

  it('should return false for binary files', () => {
    expect(isTextFile('image.png')).toBe(false)
    expect(isTextFile('document.pdf')).toBe(false)
    expect(isTextFile('archive.zip')).toBe(false)
  })

  it('should be case insensitive', () => {
    expect(isTextFile('FILE.TXT')).toBe(true)
    expect(isTextFile('Data.JSON')).toBe(true)
  })
})

describe('extractFileData', () => {
  const timestamp = 1234567890

  it('should extract text file data', async () => {
    const textFile = createMockFile('hello world', 'test.txt', 'text/plain')

    const result = await extractFileData(textFile, timestamp, 0)

    expect(result).toEqual({
      id: `file-${timestamp}-0`,
      type: 'file',
      content: 'hello world',
      mimeType: 'text/plain',
      fileName: 'test.txt',
      fileSize: textFile.size,
    })
  })

  it('should read text files as text', async () => {
    const textFile = createMockFile('content', 'doc.txt', 'text/plain')

    const result = await extractFileData(textFile, timestamp, 0)

    expect(result.content).toBe('content')
  })

  it('should include file metadata', async () => {
    const textFile = createMockFile('test', 'document.txt', 'text/plain')

    const result = await extractFileData(textFile, timestamp, 5)

    expect(result.fileName).toBe('document.txt')
    expect(result.fileSize).toBe(textFile.size)
    expect(result.id).toBe(`file-${timestamp}-5`)
  })

  it('should use default mime type for unknown types', async () => {
    const file = createMockFile('data', 'unknown', '')

    const result = await extractFileData(file, timestamp, 0)

    expect(result.mimeType).toBe('application/octet-stream')
  })
})

describe('collectNonImageFiles', () => {
  const timestamp = 1234567890

  it('should collect text files', async () => {
    const textFile = createMockFile('text content', 'test.txt', 'text/plain')
    const fileList = createMockFileList([textFile])

    const promises = collectNonImageFiles(fileList, timestamp)

    expect(promises).toHaveLength(1)

    const result = await promises[0]
    expect(result.type).toBe('file')
    expect(result.fileName).toBe('test.txt')
  })

  it('should ignore image files', () => {
    const imageFile = createMockFile('image data', 'test.png', 'image/png')
    const fileList = createMockFileList([imageFile])

    const promises = collectNonImageFiles(fileList, timestamp)

    expect(promises).toHaveLength(0)
  })

  it('should handle mixed file types', () => {
    const textFile = createMockFile('text', 'test.txt', 'text/plain')
    const imageFile = createMockFile('image', 'test.png', 'image/png')
    const jsonFile = createMockFile('{}', 'test.json', 'application/json')
    const fileList = createMockFileList([textFile, imageFile, jsonFile])

    const promises = collectNonImageFiles(fileList, timestamp)

    expect(promises).toHaveLength(2) // text and json, not image
  })

  it('should handle empty file list', () => {
    const fileList = createMockFileList([])

    const promises = collectNonImageFiles(fileList, timestamp)

    expect(promises).toHaveLength(0)
  })

  it('should preserve file order in ids', async () => {
    const file1 = createMockFile('1', 'a.txt', 'text/plain')
    const file2 = createMockFile('2', 'b.txt', 'text/plain')
    const fileList = createMockFileList([file1, file2])

    const promises = collectNonImageFiles(fileList, timestamp)
    const results = await Promise.all(promises)

    expect(results[0].id).toBe(`file-${timestamp}-0`)
    expect(results[1].id).toBe(`file-${timestamp}-1`)
  })
})
