import { useCallback } from 'react'
import type { PasteItem, PasteResult } from '../types'
import {
  extractTextData,
  extractHtmlData,
  collectImages,
  resolveImages,
  processHtmlWithImages,
  extractRtfData,
  extractCsvData,
  extractJsonData,
  extractUrlData,
  detectSpecialFormat,
  collectNonImageFiles,
} from '../utils'

type SetPasteResult = React.Dispatch<React.SetStateAction<PasteResult>>
type SetRawTypes = React.Dispatch<React.SetStateAction<string[]>>

/**
 * Demo 展示用的粘贴处理 hook
 * 解析所有数据类型并展示详细信息
 */
export function usePasteHandler(
  setPasteResult: SetPasteResult,
  setRawTypes: SetRawTypes,
) {
  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      e.preventDefault()
      const clipboardData = e.clipboardData
      if (!clipboardData) return

      const timestamp = Date.now()

      // 获取剪贴板数据类型
      const types = Array.from(clipboardData.types)
      setRawTypes(types)

      // 收集所有数据项
      const allItems: PasteItem[] = []

      // 1. 提取纯文本数据
      const textItem = extractTextData(clipboardData, timestamp)

      // 2. 提取 HTML 数据
      const htmlContent = extractHtmlData(clipboardData)

      // 3. 提取 RTF 数据
      const rtfItem = extractRtfData(clipboardData, timestamp)
      if (rtfItem) allItems.push(rtfItem)

      // 4. 提取 CSV 数据
      const csvItem = extractCsvData(clipboardData, timestamp)
      if (csvItem) allItems.push(csvItem)

      // 5. 提取 JSON 数据
      const jsonItem = extractJsonData(clipboardData, timestamp)
      if (jsonItem) allItems.push(jsonItem)

      // 6. 提取 URL 数据
      const urlItem = extractUrlData(clipboardData, timestamp)
      if (urlItem) allItems.push(urlItem)

      // 7. 从纯文本中检测特殊格式
      if (textItem && !jsonItem && !urlItem && !csvItem) {
        const detectedItem = detectSpecialFormat(textItem.content, timestamp)
        if (detectedItem) {
          allItems.push(detectedItem)
        }
      }

      // 8. 收集图片
      const imagePromises = collectImages(clipboardData)

      // 9. 收集非图片文件
      const filePromises = collectNonImageFiles(clipboardData.files, timestamp)

      // 处理异步数据
      const [uniqueImages, fileItems] = await Promise.all([
        resolveImages(imagePromises),
        Promise.all(filePromises),
      ])

      // 添加文件项
      allItems.push(...fileItems)

      // 处理 HTML，替换图片
      const processedHtml = processHtmlWithImages(htmlContent, uniqueImages)

      // 构建最终的粘贴项列表
      const finalItems = buildPasteItems(
        textItem,
        processedHtml,
        uniqueImages,
        allItems,
        timestamp,
      )

      // 更新状态
      if (finalItems.length > 0 || uniqueImages.length > 0) {
        setPasteResult((prev) => ({
          items: [...prev.items, ...finalItems],
          images: [...prev.images, ...uniqueImages],
        }))
      }
    },
    [setPasteResult, setRawTypes],
  )

  return handlePaste
}

/**
 * 构建粘贴项列表
 */
function buildPasteItems(
  textItem: PasteItem | null,
  htmlContent: string,
  images: string[],
  otherItems: PasteItem[],
  timestamp: number,
): PasteItem[] {
  const items: PasteItem[] = []

  // 添加纯文本项
  if (textItem) {
    items.push(textItem)
  }

  // 添加 HTML 项
  if (htmlContent) {
    items.push({
      id: `html-${timestamp}`,
      type: 'html',
      content: htmlContent,
      mimeType: 'text/html',
    })
  }

  // 添加图片项
  images.forEach((imageData, index) => {
    items.push({
      id: `image-${timestamp}-${index}`,
      type: 'image',
      content: imageData,
      mimeType: 'image/png',
    })
  })

  // 添加其他数据项
  items.push(...otherItems)

  return items
}
