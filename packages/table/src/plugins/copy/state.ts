import type { CSSProperties } from 'react'
import { atom } from '@einfach/react'
import type { CellId } from '@grid-table/basic'
import { getRowIdAndColIdByCellId, valueToString } from '../../utils'
import { getColumnOptionAtomByColumnId, getRowInfoAtomByRowId } from '../../stateCore'
import { easyGet } from '@einfach/utils'
import type { CopyProps } from './types'

export const showCopyStyleAtom = atom(false)

/**
 * 复制边框样式 Map —— 一次 setter 替代逐 cell setter
 * useCell / useCellThead 通过 getter 读取 Map.get(cellId)
 */
export const copyCellTbodyStyleMapAtom = atom(new Map<CellId, CSSProperties>())
export const copyCellTheadStyleMapAtom = atom(new Map<CellId, CSSProperties>())

/**
 * 通过 DOM 获取表头单元格的文本内容
 */
function getTheadCellTextFromDOM(cellId: CellId): string {
  try {
    // 构造单元格的 CSS 选择器
    const selector = `[data-cell-id="${cellId}"]`
    const cellElement = document.querySelector(selector)

    if (cellElement) {
      // 获取文本内容，去除前后空格
      const text = cellElement.textContent?.trim() || ''
      return text
    }

    return ''
  } catch (error) {
    console.warn('Failed to get thead cell text from DOM:', error)
    return ''
  }
}

/**
 * 混合区域复制 atom - 支持 thead 和 tbody 区域
 */
export const copyMixedAreaAtom = atom(
  undefined,
  async (
    getter,
    setter,
    areas: {
      cellTheadList: CellId[][]
      cellTbodyList: CellId[][]
      copyTbodyCellInfo?: CopyProps['copyTbodyCellInfo']
    },
  ) => {
    const { cellTheadList, cellTbodyList, copyTbodyCellInfo } = areas

    // 如果没有选中任何区域，返回空字符串
    if (cellTheadList.length === 0 && cellTbodyList.length === 0) {
      return ''
    }

    const allData: string[][] = []

    // 处理 thead 数据 - 使用 DOM 获取文本
    if (cellTheadList.length > 0) {
      const theadData = cellTheadList.map((rowCellIds) => {
        return rowCellIds.map((cellId) => {
          return getTheadCellTextFromDOM(cellId)
        })
      })
      allData.push(...theadData)
    }

    // 处理 tbody 数据 - 使用数据源获取
    if (cellTbodyList.length > 0) {
      if (copyTbodyCellInfo) {
        const tbodyData = await copyTbodyCellInfo(cellTbodyList)
        allData.push(...tbodyData)
      } else {
        const tbodyData = cellTbodyList.map((cellList) => {
          const firstCellId = cellList[0]
          const [rowId] = getRowIdAndColIdByCellId(firstCellId)
          const rowInfo = getter(getRowInfoAtomByRowId(rowId))!

          return cellList.map((cellId) => {
            const [, columnId] = getRowIdAndColIdByCellId(cellId)
            const columnOption = getter(getColumnOptionAtomByColumnId(columnId))

            if (!columnOption.dataIndex) {
              return ''
            }

            const cellInfo = easyGet(rowInfo, columnOption.dataIndex, '')
            return valueToString(cellInfo)
          })
        })
        allData.push(...tbodyData)
      }
    }

    // 如果没有数据，返回空字符串
    if (allData.length === 0) {
      return ''
    }

    // 简单的tab分隔格式 - 不需要宽度对齐
    const formattedData = allData.map((row) => row.join('\t')).join('\n')

    return formattedData
  },
)
