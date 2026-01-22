import {
  extractImagesFromFiles,
  extractImagesFromItems,
  collectImages,
  resolveImages,
} from '../extractImages'

/**
 * 创建模拟的 File 对象
 */
function createMockFile(
  content: string,
  name: string,
  type: string,
): File {
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

/**
 * 创建模拟的 DataTransferItem
 */
function createMockDataTransferItem(file: File): DataTransferItem {
  return {
    kind: 'file',
    type: file.type,
    getAsFile: () => file,
    getAsString: () => {},
    webkitGetAsEntry: () => null,
  } as DataTransferItem
}

/**
 * 创建模拟的 DataTransferItemList
 */
function createMockDataTransferItemList(
  items: DataTransferItem[],
): DataTransferItemList {
  const list = {
    length: items.length,
    add: () => null,
    remove: () => {},
    clear: () => {},
    [Symbol.iterator]: function* () {
      for (const item of items) {
        yield item
      }
    },
  } as DataTransferItemList

  items.forEach((item, index) => {
    Object.defineProperty(list, index, { value: item })
  })

  return list
}

describe('extractImagesFromFiles', () => {
  it('should extract image files', async () => {
    const imageFile = createMockFile('image data', 'test.png', 'image/png')
    const fileList = createMockFileList([imageFile])

    const promises = extractImagesFromFiles(fileList)

    expect(promises).toHaveLength(1)

    const result = await promises[0]
    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  it('should ignore non-image files', () => {
    const textFile = createMockFile('text content', 'test.txt', 'text/plain')
    const fileList = createMockFileList([textFile])

    const promises = extractImagesFromFiles(fileList)

    expect(promises).toHaveLength(0)
  })

  it('should handle mixed file types', async () => {
    const imageFile = createMockFile('image data', 'test.png', 'image/png')
    const textFile = createMockFile('text content', 'test.txt', 'text/plain')
    const jpegFile = createMockFile('jpeg data', 'test.jpg', 'image/jpeg')
    const fileList = createMockFileList([imageFile, textFile, jpegFile])

    const promises = extractImagesFromFiles(fileList)

    expect(promises).toHaveLength(2)
  })

  it('should handle empty file list', () => {
    const fileList = createMockFileList([])

    const promises = extractImagesFromFiles(fileList)

    expect(promises).toHaveLength(0)
  })
})

describe('extractImagesFromItems', () => {
  it('should extract image items', async () => {
    const imageFile = createMockFile('image data', 'test.png', 'image/png')
    const item = createMockDataTransferItem(imageFile)
    const items = createMockDataTransferItemList([item])

    const promises = extractImagesFromItems(items)

    expect(promises).toHaveLength(1)

    const result = await promises[0]
    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  it('should ignore non-image items', () => {
    const textFile = createMockFile('text content', 'test.txt', 'text/plain')
    const item = createMockDataTransferItem(textFile)
    const items = createMockDataTransferItemList([item])

    const promises = extractImagesFromItems(items)

    expect(promises).toHaveLength(0)
  })
})

describe('collectImages', () => {
  it('should collect images from both files and items', () => {
    const imageFile = createMockFile('image data', 'test.png', 'image/png')
    const fileList = createMockFileList([imageFile])
    const item = createMockDataTransferItem(imageFile)
    const items = createMockDataTransferItemList([item])

    const clipboardData = {
      files: fileList,
      items,
    } as unknown as DataTransfer

    const promises = collectImages(clipboardData)

    // 可能会有重复，因为同时从 files 和 items 收集
    expect(promises.length).toBeGreaterThanOrEqual(1)
  })

  it('should return empty array when no images', () => {
    const textFile = createMockFile('text content', 'test.txt', 'text/plain')
    const fileList = createMockFileList([textFile])
    const item = createMockDataTransferItem(textFile)
    const items = createMockDataTransferItemList([item])

    const clipboardData = {
      files: fileList,
      items,
    } as unknown as DataTransfer

    const promises = collectImages(clipboardData)

    expect(promises).toHaveLength(0)
  })
})

describe('resolveImages', () => {
  it('should resolve and deduplicate images', async () => {
    const duplicateData = 'same image data'
    const promise1 = Promise.resolve(duplicateData)
    const promise2 = Promise.resolve(duplicateData)
    const promise3 = Promise.resolve('different data')

    const result = await resolveImages([promise1, promise2, promise3])

    expect(result).toHaveLength(2)
    expect(result).toContain(duplicateData)
    expect(result).toContain('different data')
  })

  it('should return empty array for empty input', async () => {
    const result = await resolveImages([])

    expect(result).toEqual([])
  })

  it('should handle single image', async () => {
    const imageData = 'single image data'
    const result = await resolveImages([Promise.resolve(imageData)])

    expect(result).toEqual([imageData])
  })
})
