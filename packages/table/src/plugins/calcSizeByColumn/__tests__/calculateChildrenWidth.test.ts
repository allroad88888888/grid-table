import {
  calculateColumnsMaxWidth,
  calculateSuggestedColumnWidth,
  cleanupMeasureContainer,
} from '../calculateChildrenWidth'
import { measureColumnsWidth } from '../measureColumnsWidth'

// Jest环境中需要模拟测量函数
const createMockMeasure = () => {
  const widthMap = new Map<HTMLElement, number>()

  const setWidth = (element: HTMLElement, width: number) => {
    widthMap.set(element, width)
  }

  const measureFn = (element: HTMLElement): number => {
    return widthMap.get(element) || 0
  }

  return { setWidth, measureFn }
}

describe('calculateChildrenWidth', () => {
  afterEach(() => {
    // 每个测试后清理共享容器，避免测试间相互影响
    cleanupMeasureContainer()
  })

  test('应该正确计算多列的最大宽度', () => {
    const { setWidth, measureFn } = createMockMeasure()

    // 创建第一列的单元格
    const col1Cell1 = document.createElement('div')
    col1Cell1.textContent = '短文本'
    col1Cell1.style.cssText = 'font-size: 14px; padding: 8px;'
    setWidth(col1Cell1, 80)

    const col1Cell2 = document.createElement('div')
    col1Cell2.textContent = '这是一个很长很长的文本内容用来测试宽度计算'
    col1Cell2.style.cssText = 'font-size: 14px; padding: 8px; width: 100px; overflow: hidden;'
    setWidth(col1Cell2, 200)

    // 创建第二列的单元格
    const col2Cell1 = document.createElement('div')
    col2Cell1.innerHTML = '<span>图标</span><span>文本内容</span>'
    col2Cell1.style.cssText = 'font-size: 14px; padding: 4px;'
    setWidth(col2Cell1, 120)

    const col2Cell2 = document.createElement('div')
    col2Cell2.textContent = '中等长度的文本内容'
    col2Cell2.style.cssText = 'font-size: 14px; padding: 4px;'
    setWidth(col2Cell2, 150)

    // 构建列数据
    const columnElements = [
      [col1Cell1, col1Cell2], // 第一列：80px, 200px -> max: 200px
      [col2Cell1, col2Cell2], // 第二列：120px, 150px -> max: 150px
    ]

    // 计算每列最大宽度
    const maxWidths = calculateColumnsMaxWidth(columnElements, measureFn)

    // 验证结果
    expect(maxWidths).toHaveLength(2)
    expect(maxWidths[0]).toBe(200) // 第一列最大宽度
    expect(maxWidths[1]).toBe(150) // 第二列最大宽度

    // 验证建议列宽计算
    const suggestedWidth1 = calculateSuggestedColumnWidth(maxWidths[0]) // 200 + 16 = 216
    const suggestedWidth2 = calculateSuggestedColumnWidth(maxWidths[1]) // 150 + 16 = 166

    expect(suggestedWidth1).toBe(216)
    expect(suggestedWidth2).toBe(166)

    // 验证边界情况
    const minWidthResult = calculateSuggestedColumnWidth(10) // 10 + 16 = 26, 但最小60
    expect(minWidthResult).toBe(60)

    const maxWidthResult = calculateSuggestedColumnWidth(350) // 350 + 16 = 366, 但最大300
    expect(maxWidthResult).toBe(300)

    // 验证函数能正确处理空数组
    expect(calculateColumnsMaxWidth([], measureFn)).toEqual([])
    expect(calculateColumnsMaxWidth([[]], measureFn)).toEqual([0])

    // 验证空元素数组
    expect(calculateColumnsMaxWidth([[], []], measureFn)).toEqual([0, 0])
  })

  test('应该正确处理null和undefined元素', () => {
    const { setWidth, measureFn } = createMockMeasure()

    const validCell = document.createElement('div')
    validCell.textContent = '有效内容'
    setWidth(validCell, 100)

    // 包含null和undefined的列数据
    const columnElements = [
      [validCell, null as any, undefined as any], // 混合有效和无效元素
      [], // 空列
    ]

    const maxWidths = calculateColumnsMaxWidth(columnElements, measureFn)

    expect(maxWidths).toEqual([100, 0])
  })

  test('应该正确处理各种边界情况', () => {
    const { setWidth, measureFn } = createMockMeasure()

    // 创建测试数据
    const createCell = (text: string, width: number) => {
      const cell = document.createElement('div')
      cell.textContent = text
      cell.style.cssText = 'font-size: 14px; padding: 4px;'
      setWidth(cell, width)
      return cell
    }

    const columnElements = [
      [createCell('短文本', 24), createCell('很长的文本内容用于测试', 88)],
      [createCell('中等文本', 32), createCell('另一个测试文本', 56)],
      [createCell('单个', 16), createCell('最后一列的内容', 56)],
    ]

    // 验证具体的计算结果
    const result = calculateColumnsMaxWidth(columnElements, measureFn)
    const expectedResults = [88, 56, 56]

    expect(result).toEqual(expectedResults)
  })

  test('应该正确处理空数组和无效元素', () => {
    const { setWidth, measureFn } = createMockMeasure()

    const validCell = document.createElement('div')
    validCell.textContent = '有效'
    setWidth(validCell, 50)

    // 测试各种边界情况
    expect(calculateColumnsMaxWidth([], measureFn)).toEqual([])
    expect(calculateColumnsMaxWidth([[]], measureFn)).toEqual([0])
    expect(calculateColumnsMaxWidth([[], [validCell]], measureFn)).toEqual([0, 50])
    expect(
      calculateColumnsMaxWidth([[validCell, null as any, undefined as any]], measureFn),
    ).toEqual([50])
  })

  test('measureColumnsWidth集成测试', () => {
    const gridContainer = document.createElement('div')
    gridContainer.className = 'grid-container'

    const cells = [
      { text: '短文本', columnIndex: 0, gridRow: 1 },
      { text: '很长的文本内容', columnIndex: 1, gridRow: 1 },
      { text: '中等文本', columnIndex: 0, gridRow: 2 },
      { text: '另一个长文本', columnIndex: 1, gridRow: 2 },
    ]

    cells.forEach(({ text, columnIndex, gridRow }) => {
      const cell = document.createElement('div')
      cell.className = 'grid-table-cell'
      cell.textContent = text
      cell.style.setProperty('--column', `${columnIndex}`)
      cell.style.gridRowStart = `${gridRow}`
      cell.style.fontSize = '14px'
      cell.style.padding = '8px'
      gridContainer.appendChild(cell)
    })

    document.body.appendChild(gridContainer)

    const gridRef = { current: gridContainer }
    const columnIndexList = [0, 1]
    const options = {
      minColumnWidth: 60,
      maxColumnWidth: 250,
      columnPadding: 16,
    }

    const result = measureColumnsWidth(gridRef, columnIndexList, options)

    document.body.removeChild(gridContainer)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(columnIndexList.length)

    result.forEach((width) => {
      expect(typeof width).toBe('number')
      expect(width).toBeGreaterThanOrEqual(0)
    })
  })

  test('measureColumnsWidth虚拟滚动场景-后几列自适应', () => {
    const gridContainer = document.createElement('div')
    gridContainer.className = 'grid-container'

    // 模拟滚动到后几列的场景：DOM 中只有列索引 20、21、22 的单元格
    const cells = [
      { text: '列20数据', columnIndex: 20, gridRow: 1 },
      { text: '列21数据很长很长', columnIndex: 21, gridRow: 1 },
      { text: '列22', columnIndex: 22, gridRow: 1 },
      { text: '列20行2', columnIndex: 20, gridRow: 2 },
      { text: '列21行2', columnIndex: 21, gridRow: 2 },
      { text: '列22行2数据', columnIndex: 22, gridRow: 2 },
    ]

    cells.forEach(({ text, columnIndex, gridRow }) => {
      const cell = document.createElement('div')
      cell.className = 'grid-table-cell'
      cell.textContent = text
      cell.style.setProperty('--column', `${columnIndex}`)
      cell.style.gridRowStart = `${gridRow}`
      gridContainer.appendChild(cell)
    })

    document.body.appendChild(gridContainer)

    const gridRef = { current: gridContainer }
    // 只对列 21 做自适应
    const columnIndexList = [21]
    const options = { minColumnWidth: 60, maxColumnWidth: 250, columnPadding: 16 }

    const result = measureColumnsWidth(gridRef, columnIndexList, options)

    document.body.removeChild(gridContainer)

    expect(result.length).toBe(1)
    expect(result[0]).toBeGreaterThanOrEqual(60)
  })
})
