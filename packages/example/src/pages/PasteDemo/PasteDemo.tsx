import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './PasteDemo.css'
import type { PasteItem, PasteResult } from '@grid-table/paste'
import { usePasteHandler, parseTableData, parseCsv } from '@grid-table/paste'

function PasteDemo() {
  const [pasteResult, setPasteResult] = useState<PasteResult>({
    items: [],
    images: [],
  })
  const [rawTypes, setRawTypes] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePaste = usePasteHandler(setPasteResult, setRawTypes)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('paste', handlePaste)
    return () => {
      container.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  const clearItems = useCallback(() => {
    setPasteResult({ items: [], images: [] })
    setRawTypes([])
  }, [])

  return (
    <div className="paste-demo">
      <h2>粘贴功能演示</h2>
      <p className="paste-demo__hint">
        支持粘贴：文本、HTML、图片、RTF、CSV、JSON、URL、文件等多种格式
      </p>

      <div
        ref={containerRef}
        className="paste-demo__target"
        tabIndex={0}
        role="textbox"
        aria-label="粘贴区域"
      >
        <span className="paste-demo__placeholder">点击此区域，然后粘贴内容</span>
      </div>

      <button className="paste-demo__clear" onClick={clearItems}>
        清空内容
      </button>

      {rawTypes.length > 0 && (
        <div className="paste-demo__types">
          <h3>剪贴板数据类型</h3>
          <ul>
            {rawTypes.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="paste-demo__results">
        {pasteResult.items.map((item) => (
          <PasteItemRenderer key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

/**
 * 渲染单个粘贴项
 */
function PasteItemRenderer({ item }: { item: PasteItem }) {
  return (
    <div className="paste-demo__item">
      <div className="paste-demo__item-header">
        <span className={`paste-demo__item-type paste-demo__item-type--${item.type}`}>
          {item.type.toUpperCase()}
        </span>
        <span className="paste-demo__item-mime">{item.mimeType}</span>
        {item.fileName && (
          <span className="paste-demo__item-filename">{item.fileName}</span>
        )}
        {item.fileSize !== undefined && (
          <span className="paste-demo__item-filesize">
            {formatFileSize(item.fileSize)}
          </span>
        )}
      </div>

      <div className="paste-demo__item-content">
        {item.type === 'text' && <TextContent content={item.content} />}
        {item.type === 'html' && <HtmlContent content={item.content} />}
        {item.type === 'image' && <ImageContent content={item.content} />}
        {item.type === 'rtf' && <RtfContent content={item.content} />}
        {item.type === 'csv' && <CsvContent content={item.content} />}
        {item.type === 'json' && <JsonContent content={item.content} />}
        {item.type === 'url' && <UrlContent content={item.content} />}
        {item.type === 'file' && <FileContent item={item} />}
      </div>
    </div>
  )
}

/**
 * 纯文本内容渲染
 */
function TextContent({ content }: { content: string }) {
  return (
    <div className="paste-demo__text-content">
      <h4>纯文本内容</h4>
      <pre>{content}</pre>
    </div>
  )
}

/**
 * HTML 内容渲染
 */
function HtmlContent({ content }: { content: string }) {
  const tableData = useMemo(() => parseTableData(content), [content])

  return (
    <div className="paste-demo__html-content">
      <h4>HTML 渲染结果</h4>
      <div
        className="paste-demo__html-preview"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {tableData && (
        <>
          <h4>解析的表格数据</h4>
          <table className="paste-demo__parsed-table">
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h4>原始 HTML</h4>
      <pre className="paste-demo__raw-html">{content}</pre>
    </div>
  )
}

/**
 * 图片内容渲染
 */
function ImageContent({ content }: { content: string }) {
  return (
    <div className="paste-demo__image-content">
      <h4>图片内容</h4>
      <img src={content} alt="粘贴的图片" />
    </div>
  )
}

/**
 * RTF 内容渲染
 */
function RtfContent({ content }: { content: string }) {
  return (
    <div className="paste-demo__rtf-content">
      <h4>RTF 富文本内容</h4>
      <pre className="paste-demo__raw-content">{content}</pre>
    </div>
  )
}

/**
 * CSV 内容渲染
 */
function CsvContent({ content }: { content: string }) {
  const parsedData = useMemo(() => parseCsv(content), [content])

  return (
    <div className="paste-demo__csv-content">
      <h4>CSV 数据</h4>
      {parsedData.length > 0 && (
        <table className="paste-demo__parsed-table">
          <tbody>
            {parsedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h4>原始 CSV</h4>
      <pre className="paste-demo__raw-content">{content}</pre>
    </div>
  )
}

/**
 * JSON 内容渲染
 */
function JsonContent({ content }: { content: string }) {
  const formattedJson = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(content), null, 2)
    } catch {
      return content
    }
  }, [content])

  return (
    <div className="paste-demo__json-content">
      <h4>JSON 数据</h4>
      <pre className="paste-demo__json-preview">{formattedJson}</pre>
    </div>
  )
}

/**
 * URL 内容渲染
 */
function UrlContent({ content }: { content: string }) {
  const urls = content.split('\n').filter((url) => url.trim())

  return (
    <div className="paste-demo__url-content">
      <h4>URL 链接</h4>
      <ul className="paste-demo__url-list">
        {urls.map((url, index) => (
          <li key={index}>
            <a href={url.trim()} target="_blank" rel="noopener noreferrer">
              {url.trim()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 文件内容渲染
 */
function FileContent({ item }: { item: PasteItem }) {
  const isTextContent =
    item.mimeType.startsWith('text/') || !item.content.startsWith('data:')

  return (
    <div className="paste-demo__file-content">
      <h4>文件内容</h4>
      {isTextContent ? (
        <pre className="paste-demo__raw-content">{item.content}</pre>
      ) : (
        <div className="paste-demo__file-binary">
          <p>二进制文件，无法直接预览</p>
          <a href={item.content} download={item.fileName}>
            下载文件
          </a>
        </div>
      )}
    </div>
  )
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export { PasteDemo }
export default PasteDemo
