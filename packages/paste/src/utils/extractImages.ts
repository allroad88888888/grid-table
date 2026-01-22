/**
 * 将 File 或 Blob 转换为 base64 字符串
 */
function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      resolve(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 从 clipboardData.files 中提取图片
 */
export function extractImagesFromFiles(files: FileList): Promise<string>[] {
  const promises: Promise<string>[] = []

  Array.from(files).forEach((file) => {
    if (file.type.startsWith('image/')) {
      promises.push(fileToBase64(file))
    }
  })

  return promises
}

/**
 * 从 clipboardData.items 中提取图片
 */
export function extractImagesFromItems(
  items: DataTransferItemList,
): Promise<string>[] {
  const promises: Promise<string>[] = []

  Array.from(items).forEach((item) => {
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile()
      if (blob) {
        promises.push(fileToBase64(blob))
      }
    }
  })

  return promises
}

/**
 * 从剪贴板收集所有图片数据
 */
export function collectImages(clipboardData: DataTransfer): Promise<string>[] {
  const imagePromises: Promise<string>[] = []

  // 从 files 收集
  if (clipboardData.files.length > 0) {
    imagePromises.push(...extractImagesFromFiles(clipboardData.files))
  }

  // 从 items 收集
  if (clipboardData.items) {
    imagePromises.push(...extractImagesFromItems(clipboardData.items))
  }

  return imagePromises
}

/**
 * 等待所有图片加载完成并去重
 */
export async function resolveImages(
  imagePromises: Promise<string>[],
): Promise<string[]> {
  if (imagePromises.length === 0) return []

  const images = await Promise.all(imagePromises)
  return [...new Set(images)]
}
