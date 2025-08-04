/**
 * 计算单元格内容宽度的工具函数
 */

/**
 * 创建测量容器
 */
function createMeasureContainer(): HTMLElement {
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '-9999px'
  container.style.visibility = 'hidden'
  container.style.width = 'max-content'
  container.style.whiteSpace = 'nowrap'
  container.style.pointerEvents = 'none'
  document.body.appendChild(container)
  return container
}

/**
 * 共享的测量容器管理器
 */
class MeasureContainerManager {
  private container: HTMLElement | null = null

  getContainer(): HTMLElement {
    if (!this.container) {
      this.container = createMeasureContainer()
    }
    return this.container
  }

  cleanup(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
      this.container = null
    }
  }

  clearContent(): void {
    if (this.container) {
      this.container.innerHTML = ''
    }
  }
}

// 全局共享实例
const sharedMeasureManager = new MeasureContainerManager()

/**
 * 批量测量多个元素（最优性能版本）
 */
function batchMeasureElementsWidth(
  elements: Element[],
  measureFn?: (el: HTMLElement) => number,
): number[] {
  if (!elements.length) return []

  // 如果提供了自定义测量函数，直接使用
  if (measureFn) {
    return elements.map((el) => (el instanceof HTMLElement ? measureFn(el) : 0))
  }

  const measureContainer = sharedMeasureManager.getContainer()
  sharedMeasureManager.clearContent()

  const clones: HTMLElement[] = []
  const results: number[] = []

  // 批量创建所有克隆元素
  for (const element of elements) {
    if (!(element instanceof HTMLElement)) {
      results.push(0)
      clones.push(null as any)
      continue
    }

    const clone = element.cloneNode(true) as HTMLElement
    const originalStyles = window.getComputedStyle(element)

    // 设置克隆元素样式
    clone.style.width = 'auto'
    clone.style.maxWidth = 'none'
    clone.style.minWidth = '0'
    clone.style.overflow = 'visible'
    clone.style.display = originalStyles.display === 'none' ? 'block' : originalStyles.display
    clone.style.fontSize = originalStyles.fontSize
    clone.style.fontFamily = originalStyles.fontFamily
    clone.style.fontWeight = originalStyles.fontWeight
    clone.style.lineHeight = originalStyles.lineHeight
    clone.style.letterSpacing = originalStyles.letterSpacing
    clone.style.padding = originalStyles.padding
    clone.style.border = originalStyles.border
    clone.style.boxSizing = originalStyles.boxSizing

    clones.push(clone)
    measureContainer.appendChild(clone)
  }

  // 批量测量所有元素宽度
  clones.forEach((clone, index) => {
    if (clone) {
      results[index] = clone.offsetWidth
    } else if (results[index] === undefined) {
      // 确保所有位置都有值
      results[index] = 0
    }
  })

  // 清理
  sharedMeasureManager.clearContent()

  return results
}

/**
 * 批量计算每列的最大宽度
 * @param columnElements 二维数组，每个子数组代表一列的所有DOM元素
 * @param measureFn 可选的自定义测量函数，主要用于测试
 * @returns 每列的最大宽度数组
 */
export function calculateColumnsMaxWidth(
  columnElements: Element[][],
  measureFn?: (el: HTMLElement) => number,
): number[] {
  if (!columnElements.length) return []

  const results: number[] = []

  try {
    // 遍历每一列
    for (let colIndex = 0; colIndex < columnElements.length; colIndex++) {
      const columnCells = columnElements[colIndex].filter(Boolean) // 过滤null/undefined

      if (!columnCells.length) {
        results.push(0)
        continue
      }

      // 批量测量当前列的所有元素
      const widths = batchMeasureElementsWidth(columnCells, measureFn)
      const maxWidth = Math.max(...widths, 0)

      results.push(maxWidth)
    }
  } finally {
    // 确保清理共享容器
    if (!measureFn) {
      sharedMeasureManager.cleanup()
    }
  }

  return results
}

/**
 * 根据内容计算建议的列宽
 * @param maxWidth 最大内容宽度
 * @param minWidth 最小宽度限制
 * @param maxWidthLimit 最大宽度限制
 * @param padding 内边距
 * @returns 建议宽度
 */
export function calculateSuggestedColumnWidth(
  maxWidth: number,
  minWidth = 60,
  maxWidthLimit = 300,
  padding = 16,
): number {
  const suggestedWidth = maxWidth + padding
  return Math.max(minWidth, Math.min(maxWidthLimit, suggestedWidth))
}

/**
 * 清理共享的测量容器
 * 在不再需要进行宽度计算时调用，释放DOM资源
 */
export function cleanupMeasureContainer(): void {
  sharedMeasureManager.cleanup()
}
