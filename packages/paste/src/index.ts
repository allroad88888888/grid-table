// Types
export type { PasteItem, PasteItemType, PasteResult } from './types'

// Demo - 通用粘贴展示
export { usePasteHandler } from './demo'

// Table - 表格数据处理
export {
  formatToTsv,
  htmlTableToTsv,
  csvToTsv,
  convertToTsv,
  parseHtmlTable,
  extractAndConvertToTsv,
  useTablePaste,
  useTablePasteTsv,
  useTablePasteData,
  useTablePasteWithFormatter,
  type TablePasteResult,
  type ColumnFormatter,
  type UseTablePasteWithFormatterResult,
} from './table'

// Utils - 基础工具函数
export {
  // Text extraction
  extractTextData,
  extractHtmlData,
  // Image extraction
  collectImages,
  resolveImages,
  extractImagesFromFiles,
  extractImagesFromItems,
  // HTML processing
  processHtmlWithImages,
  parseTableData,
  parseCsv,
  // Clipboard data extraction
  extractRtfData,
  extractCsvData,
  extractJsonData,
  extractUrlData,
  // Format detection
  detectSpecialFormat,
  // File extraction
  extractFileData,
  collectNonImageFiles,
} from './utils'
