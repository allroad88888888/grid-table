import { TreeNode } from '../../types'
import { calculateAdaptiveTags, type AdaptiveTagsConfig } from '../adaptiveTags'

describe('adaptiveTags', () => {
  const createMockNodes = (labels: string[]): TreeNode[] => {
    return labels.map((label, index) => ({
      id: `node-${index}`,
      label,
    }))
  }

  const defaultConfig: AdaptiveTagsConfig = {
    containerWidth: 400,
    tagStyle: {
      paddingHorizontal: 4,
      borderWidth: 1,
      gap: 4,
      fontSize: 12,
      charWidthRatio: 0.8,
    },
    moreTagWidth: 40,
    reservedWidth: 60,
    minTagCount: 1,
    maxTagCount: 20,
  }

  describe('calculateAdaptiveTags', () => {
    it('should return correct result for empty nodes array', () => {
      const result = calculateAdaptiveTags([], defaultConfig)

      expect(result).toEqual({
        visibleTagCount: 0,
        remainingTagCount: 0,
        showMoreTag: false,
        totalRequiredWidth: 0,
        widthAnalysis: {
          tagWidths: [],
          cumulativeWidths: [],
          availableWidth: 340, // 400 - 60
        },
      })
    })

    it('should calculate correctly for single short tag', () => {
      const nodes = createMockNodes(['短'])
      const result = calculateAdaptiveTags(nodes, defaultConfig)

      expect(result.visibleTagCount).toBe(1)
      expect(result.remainingTagCount).toBe(0)
      expect(result.showMoreTag).toBe(false)
      expect(result.totalRequiredWidth).toBeGreaterThan(0)
      expect(result.widthAnalysis.tagWidths).toHaveLength(1)
      expect(result.widthAnalysis.cumulativeWidths).toHaveLength(1)
    })

    it('should calculate correctly for multiple short tags', () => {
      const nodes = createMockNodes(['A', 'B', 'C', 'D'])
      const result = calculateAdaptiveTags(nodes, defaultConfig)

      expect(result.visibleTagCount).toBeGreaterThan(0)
      expect(result.visibleTagCount).toBeLessThanOrEqual(4)
      expect(result.remainingTagCount).toBe(4 - result.visibleTagCount)
      expect(result.widthAnalysis.tagWidths).toHaveLength(4)
      expect(result.widthAnalysis.cumulativeWidths).toHaveLength(result.visibleTagCount)
    })

    it('should handle long tags correctly', () => {
      const nodes = createMockNodes(['这是一个非常长的标签名称', '另一个很长的标签', '短'])
      const result = calculateAdaptiveTags(nodes, defaultConfig)

      // 由于标签很长，可能只能显示少数几个
      expect(result.visibleTagCount).toBeGreaterThan(0)
      expect(result.visibleTagCount).toBeLessThanOrEqual(3)
      expect(result.totalRequiredWidth).toBeLessThanOrEqual(340) // availableWidth
    })

    it('should respect minTagCount even when width is insufficient', () => {
      const nodes = createMockNodes(['非常非常非常长的标签名称让宽度不够'])
      const config: AdaptiveTagsConfig = {
        ...defaultConfig,
        containerWidth: 100, // 很小的容器
        minTagCount: 1,
      }

      const result = calculateAdaptiveTags(nodes, config)

      expect(result.visibleTagCount).toBe(1)
      expect(result.remainingTagCount).toBe(0)
      expect(result.showMoreTag).toBe(false)
    })

    it('should respect maxTagCount', () => {
      const nodes = createMockNodes(['A', 'B', 'C', 'D', 'E', 'F'])
      const config: AdaptiveTagsConfig = {
        ...defaultConfig,
        maxTagCount: 3,
      }

      const result = calculateAdaptiveTags(nodes, config)

      expect(result.visibleTagCount).toBeLessThanOrEqual(3)
      expect(result.remainingTagCount).toBe(nodes.length - result.visibleTagCount)
      expect(result.showMoreTag).toBe(result.remainingTagCount > 0)
    })

    it('should handle zero or negative container width', () => {
      const nodes = createMockNodes(['A', 'B'])
      const config: AdaptiveTagsConfig = {
        ...defaultConfig,
        containerWidth: 0,
        minTagCount: 0, // 明确设置为0，期望不显示任何标签
      }

      const result = calculateAdaptiveTags(nodes, config)

      expect(result.visibleTagCount).toBe(0)
      expect(result.remainingTagCount).toBe(2)
      expect(result.showMoreTag).toBe(true)
      expect(result.totalRequiredWidth).toBe(0)
    })

    it('should account for gap between tags', () => {
      const nodes = createMockNodes(['A', 'B'])
      const config: AdaptiveTagsConfig = {
        ...defaultConfig,
        tagStyle: {
          ...defaultConfig.tagStyle!,
          gap: 20, // 大间距
        },
      }

      const result = calculateAdaptiveTags(nodes, config)

      if (result.visibleTagCount === 2) {
        // 如果能显示两个标签，累计宽度应该包含间距
        expect(result.widthAnalysis.cumulativeWidths[1]).toBeGreaterThan(
          result.widthAnalysis.cumulativeWidths[0] + result.widthAnalysis.tagWidths[1],
        )
      }
    })

    it('should calculate text width differently for Chinese and English', () => {
      const chineseNodes = createMockNodes(['中文字符'])
      const englishNodes = createMockNodes(['abcd'])

      const chineseResult = calculateAdaptiveTags(chineseNodes, defaultConfig)
      const englishResult = calculateAdaptiveTags(englishNodes, defaultConfig)

      // 中文字符通常比等长度的英文宽
      expect(chineseResult.widthAnalysis.tagWidths[0]).toBeGreaterThan(
        englishResult.widthAnalysis.tagWidths[0],
      )
    })

    it('should show more tag when there are remaining tags', () => {
      const nodes = createMockNodes(new Array(10).fill(0).map((_, i) => `Tag${i}`))
      const config: AdaptiveTagsConfig = {
        ...defaultConfig,
        containerWidth: 200, // 较小容器，确保不能显示所有标签
      }

      const result = calculateAdaptiveTags(nodes, config)

      if (result.visibleTagCount < nodes.length) {
        expect(result.showMoreTag).toBe(true)
        expect(result.remainingTagCount).toBeGreaterThan(0)
        expect(result.remainingTagCount).toBe(nodes.length - result.visibleTagCount)
      }
    })

    it('should handle custom tag style configuration', () => {
      const nodes = createMockNodes(['测试'])
      const customConfig: AdaptiveTagsConfig = {
        ...defaultConfig,
        tagStyle: {
          paddingHorizontal: 10, // 更大的内边距
          borderWidth: 2, // 更厚的边框
          gap: 8, // 更大的间距
          fontSize: 16, // 更大的字体
          charWidthRatio: 1.0, // 不同的字符宽度比例
        },
      }

      const defaultResult = calculateAdaptiveTags(nodes, defaultConfig)
      const customResult = calculateAdaptiveTags(nodes, customConfig)

      // 自定义配置应该产生更宽的标签
      expect(customResult.widthAnalysis.tagWidths[0]).toBeGreaterThan(
        defaultResult.widthAnalysis.tagWidths[0],
      )
    })

    it('should ensure minimum tag count takes precedence', () => {
      const nodes = createMockNodes(['超级长的标签名称会占用很多宽度', '另一个很长的标签'])
      const config: AdaptiveTagsConfig = {
        ...defaultConfig,
        containerWidth: 50, // 非常小的容器
        minTagCount: 2, // 强制显示2个
      }

      const result = calculateAdaptiveTags(nodes, config)

      expect(result.visibleTagCount).toBe(2)
      expect(result.remainingTagCount).toBe(0)
      // 即使超出容器宽度，也应该显示最小数量的标签
      expect(result.totalRequiredWidth).toBeGreaterThan(
        config.containerWidth - config.reservedWidth!,
      )
    })

    it('should handle edge case with moreTagWidth configuration', () => {
      const nodes = createMockNodes(['A', 'B', 'C'])
      const config: AdaptiveTagsConfig = {
        ...defaultConfig,
        moreTagWidth: 100, // 很大的"+N"标签宽度
      }

      const result = calculateAdaptiveTags(nodes, config)

      // 由于"+N"标签占用很多空间，可能影响可显示的标签数量
      expect(result.visibleTagCount).toBeLessThanOrEqual(3)
    })

    it('should handle mixed Chinese and English text', () => {
      const nodes = createMockNodes(['React组件', 'Vue.js应用', 'JavaScript库'])
      const result = calculateAdaptiveTags(nodes, defaultConfig)

      expect(result.visibleTagCount).toBeGreaterThan(0)
      expect(result.widthAnalysis.tagWidths.every((width) => width > 0)).toBe(true)
      // 混合文本的宽度计算应该合理
      result.widthAnalysis.tagWidths.forEach((width) => {
        expect(width).toBeGreaterThan(30) // 最小合理宽度
        expect(width).toBeLessThan(300) // 最大合理宽度
      })
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle nodes with empty labels', () => {
      const nodes = createMockNodes(['', 'normal', ''])
      const result = calculateAdaptiveTags(nodes, defaultConfig)

      expect(result.visibleTagCount).toBeGreaterThan(0)
      expect(result.widthAnalysis.tagWidths).toHaveLength(3)
      // 空标签应该有最小宽度（padding + border + close button）
      expect(result.widthAnalysis.tagWidths[0]).toBeGreaterThan(20)
    })

    it('should handle very large maxTagCount', () => {
      const nodes = createMockNodes(['A', 'B'])
      const config: AdaptiveTagsConfig = {
        ...defaultConfig,
        maxTagCount: 1000,
      }

      const result = calculateAdaptiveTags(nodes, config)

      expect(result.visibleTagCount).toBeLessThanOrEqual(2) // 实际节点数量
    })

    it('should handle zero minTagCount', () => {
      const nodes = createMockNodes(['很长的标签'])
      const config: AdaptiveTagsConfig = {
        ...defaultConfig,
        containerWidth: 50,
        minTagCount: 0,
      }

      const result = calculateAdaptiveTags(nodes, config)

      // 宽度不够时应该显示0个标签
      expect(result.visibleTagCount).toBe(0)
      expect(result.showMoreTag).toBe(true)
    })
  })
})
