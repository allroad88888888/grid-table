import type { TreeNode } from '../types'

/**
 * 标签样式配置
 */
export interface TagStyleConfig {
  /** 标签水平内边距 */
  paddingHorizontal: number
  /** 标签边框宽度 */
  borderWidth: number
  /** 标签之间的间距 */
  gap: number
  /** 字体大小 */
  fontSize: number
  /** 字符平均宽度系数（中文约1.2，英文约0.6） */
  charWidthRatio: number
}

/**
 * 自适应标签计算配置
 */
export interface AdaptiveTagsConfig {
  /** 容器总宽度 */
  containerWidth: number
  /** 标签基础样式配置 */
  tagStyle?: Partial<TagStyleConfig>
  /** 保留给"+N"标签的宽度 */
  moreTagWidth?: number
  /** 保留给清除按钮、下拉箭头等的宽度 */
  reservedWidth?: number
  /** 最小显示标签数量 */
  minTagCount?: number
  /** 最大显示标签数量 */
  maxTagCount?: number
}

/**
 * 自适应标签计算结果
 */
export interface AdaptiveTagsResult {
  /** 应该显示的标签数量 */
  visibleTagCount: number
  /** 剩余的标签数量 */
  remainingTagCount: number
  /** 是否需要显示"+N"标签 */
  showMoreTag: boolean
  /** 总共需要的宽度（仅显示的标签） */
  totalRequiredWidth: number
  /** 详细的宽度分析 */
  widthAnalysis: {
    /** 每个标签的宽度 */
    tagWidths: number[]
    /** 累计宽度 */
    cumulativeWidths: number[]
    /** 可用宽度 */
    availableWidth: number
  }
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
  tagStyle: {
    paddingHorizontal: 4,
    borderWidth: 1,
    gap: 4,
    fontSize: 12,
    charWidthRatio: 0.8, // 混合中英文的平均值
  } as TagStyleConfig,
  moreTagWidth: 40, // "+99" 大约需要的宽度
  reservedWidth: 60, // 清除按钮 + 下拉箭头 + 一些边距
  minTagCount: 1,
  maxTagCount: 20,
}

/**
 * 计算文本宽度
 * 基于字符数量和字体大小进行估算
 */
function calculateTextWidth(text: string, fontSize: number, charWidthRatio: number): number {
  // 分别计算中文和英文字符
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const otherChars = text.length - chineseChars

  // 中文字符通常比英文字符宽
  const chineseWidth = chineseChars * fontSize * 1.0
  const otherWidth = otherChars * fontSize * charWidthRatio

  return chineseWidth + otherWidth
}

/**
 * 计算单个标签的总宽度（包括内边距、边框等）
 */
function calculateTagWidth(node: TreeNode, tagStyle: TagStyleConfig): number {
  const textWidth = calculateTextWidth(node.label, tagStyle.fontSize, tagStyle.charWidthRatio)
  const paddingWidth = tagStyle.paddingHorizontal * 2
  const borderWidth = tagStyle.borderWidth * 2
  const closeButtonWidth = 16 // 关闭按钮的宽度

  return textWidth + paddingWidth + borderWidth + closeButtonWidth
}

/**
 * 自适应计算应该显示多少个标签
 */
export function calculateAdaptiveTags(
  nodes: TreeNode[],
  config: AdaptiveTagsConfig,
): AdaptiveTagsResult {
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    tagStyle: {
      ...DEFAULT_CONFIG.tagStyle,
      ...config.tagStyle,
    } as TagStyleConfig,
  }

  const { containerWidth, tagStyle, moreTagWidth, reservedWidth, minTagCount, maxTagCount } =
    mergedConfig

  // 可用于显示标签的宽度
  const availableWidth = containerWidth - reservedWidth

  if (nodes.length === 0) {
    return {
      visibleTagCount: 0,
      remainingTagCount: 0,
      showMoreTag: false,
      totalRequiredWidth: 0,
      widthAnalysis: {
        tagWidths: [],
        cumulativeWidths: [],
        availableWidth,
      },
    }
  }

  // 处理可用宽度不足的情况
  if (availableWidth <= 0) {
    if (minTagCount > 0) {
      // 即使可用宽度不足，也要尊重 minTagCount
      const forceShowCount = Math.min(minTagCount, nodes.length)
      const tagWidths = nodes
        .slice(0, forceShowCount)
        .map((node) => calculateTagWidth(node, tagStyle))
      let totalWidth = 0
      const cumulativeWidths: number[] = []

      for (let i = 0; i < forceShowCount; i++) {
        const gapWidth = i > 0 ? tagStyle.gap : 0
        totalWidth += tagWidths[i] + gapWidth
        cumulativeWidths.push(totalWidth)
      }

      return {
        visibleTagCount: forceShowCount,
        remainingTagCount: nodes.length - forceShowCount,
        showMoreTag: nodes.length > forceShowCount,
        totalRequiredWidth: totalWidth,
        widthAnalysis: {
          tagWidths,
          cumulativeWidths,
          availableWidth,
        },
      }
    } else {
      // minTagCount 为 0 且可用宽度不足，不显示任何标签
      return {
        visibleTagCount: 0,
        remainingTagCount: nodes.length,
        showMoreTag: nodes.length > 0,
        totalRequiredWidth: 0,
        widthAnalysis: {
          tagWidths: [],
          cumulativeWidths: [],
          availableWidth,
        },
      }
    }
  }

  // 计算每个标签的宽度
  const tagWidths = nodes.map((node) => calculateTagWidth(node, tagStyle))
  const cumulativeWidths: number[] = []

  let totalWidth = 0
  let visibleTagCount = 0

  for (let i = 0; i < nodes.length && i < maxTagCount; i++) {
    const tagWidth = tagWidths[i]
    const gapWidth = i > 0 ? tagStyle.gap : 0
    const newTotalWidth = totalWidth + tagWidth + gapWidth

    // 检查是否还有剩余标签需要显示"+N"
    const hasMoreTags = i < nodes.length - 1
    const widthWithMoreTag = hasMoreTags
      ? newTotalWidth + tagStyle.gap + moreTagWidth
      : newTotalWidth

    if (widthWithMoreTag <= availableWidth || i < minTagCount) {
      totalWidth = newTotalWidth
      visibleTagCount = i + 1
      cumulativeWidths.push(totalWidth)
    } else {
      break
    }
  }

  // 确保至少显示 minTagCount 个标签（即使超出容器宽度）
  if (visibleTagCount < minTagCount && nodes.length > 0) {
    visibleTagCount = Math.min(minTagCount, nodes.length)
    // 重新计算宽度
    totalWidth = 0
    for (let i = 0; i < visibleTagCount; i++) {
      const gapWidth = i > 0 ? tagStyle.gap : 0
      totalWidth += tagWidths[i] + gapWidth
      if (cumulativeWidths[i] === undefined) {
        cumulativeWidths[i] = totalWidth
      }
    }
  }

  const remainingTagCount = nodes.length - visibleTagCount
  const showMoreTag = remainingTagCount > 0

  return {
    visibleTagCount,
    remainingTagCount,
    showMoreTag,
    totalRequiredWidth: totalWidth,
    widthAnalysis: {
      tagWidths,
      cumulativeWidths,
      availableWidth,
    },
  }
}

/**
 * 为 DOM 环境提供的自适应标签计算
 * 使用真实的 DOM 测量来获得更准确的宽度
 */
export function calculateAdaptiveTagsWithDOM(
  nodes: TreeNode[],
  containerElement: HTMLElement,
  config?: Partial<AdaptiveTagsConfig>,
): AdaptiveTagsResult {
  const containerWidth = containerElement.getBoundingClientRect().width

  // 创建临时标签元素来测量实际宽度
  const measureTag = (node: TreeNode): number => {
    const tempTag = document.createElement('span')
    tempTag.className = 'tree-select-tag'
    tempTag.style.visibility = 'hidden'
    tempTag.style.position = 'absolute'
    tempTag.style.pointerEvents = 'none'

    const content = document.createElement('span')
    content.className = 'tree-select-tag-content'
    content.textContent = node.label

    const close = document.createElement('span')
    close.className = 'tree-select-tag-close'
    close.textContent = '×'

    tempTag.appendChild(content)
    tempTag.appendChild(close)
    containerElement.appendChild(tempTag)

    const width = tempTag.getBoundingClientRect().width
    containerElement.removeChild(tempTag)

    return width
  }

  // 如果在 DOM 环境中，优先使用真实测量
  if (typeof window !== 'undefined' && containerElement) {
    const tagWidths = nodes.map(measureTag)
    const gap = 4 // 从 CSS 中获取，或者也可以测量

    let totalWidth = 0
    let visibleTagCount = 0
    const availableWidth = containerWidth - (config?.reservedWidth || DEFAULT_CONFIG.reservedWidth)
    const moreTagWidth = config?.moreTagWidth || DEFAULT_CONFIG.moreTagWidth
    const maxTagCount = config?.maxTagCount || DEFAULT_CONFIG.maxTagCount
    const minTagCount = config?.minTagCount || DEFAULT_CONFIG.minTagCount

    for (let i = 0; i < nodes.length && i < maxTagCount; i++) {
      const tagWidth = tagWidths[i]
      const gapWidth = i > 0 ? gap : 0
      const newTotalWidth = totalWidth + tagWidth + gapWidth

      const hasMoreTags = i < nodes.length - 1
      const widthWithMoreTag = hasMoreTags ? newTotalWidth + gap + moreTagWidth : newTotalWidth

      if (widthWithMoreTag <= availableWidth || i < minTagCount) {
        totalWidth = newTotalWidth
        visibleTagCount = i + 1
      } else {
        break
      }
    }

    return {
      visibleTagCount,
      remainingTagCount: nodes.length - visibleTagCount,
      showMoreTag: nodes.length > visibleTagCount,
      totalRequiredWidth: totalWidth,
      widthAnalysis: {
        tagWidths,
        cumulativeWidths: tagWidths.slice(0, visibleTagCount).reduce((acc, width, i) => {
          const gapWidth = i > 0 ? gap : 0
          const total = (acc[i - 1] || 0) + width + gapWidth
          acc.push(total)
          return acc
        }, [] as number[]),
        availableWidth,
      },
    }
  }

  // 回退到基于文本计算的方法
  return calculateAdaptiveTags(nodes, { containerWidth, ...config })
}
