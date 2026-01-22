import type { PasteItem } from '../types'

/**
 * 处理非图片类型的文件
 */
export function extractFileData(
  file: File,
  timestamp: number,
  index: number,
): Promise<PasteItem> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      resolve({
        id: `file-${timestamp}-${index}`,
        type: 'file',
        content: event.target?.result as string,
        mimeType: file.type || 'application/octet-stream',
        fileName: file.name,
        fileSize: file.size,
      })
    }

    if (file.type.startsWith('text/') || isTextFile(file.name)) {
      reader.readAsText(file)
    } else {
      reader.readAsDataURL(file)
    }
  })
}

/**
 * 判断是否为文本文件
 */
export function isTextFile(fileName: string): boolean {
  const textExtensions = [
    '.txt',
    '.json',
    '.csv',
    '.xml',
    '.md',
    '.js',
    '.ts',
    '.css',
    '.html',
    '.yml',
    '.yaml',
  ]
  return textExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))
}

/**
 * 从剪贴板收集非图片文件
 */
export function collectNonImageFiles(
  files: FileList,
  timestamp: number,
): Promise<PasteItem>[] {
  const promises: Promise<PasteItem>[] = []

  Array.from(files).forEach((file, index) => {
    if (!file.type.startsWith('image/')) {
      promises.push(extractFileData(file, timestamp, index))
    }
  })

  return promises
}
