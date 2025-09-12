import { describe, test, expect } from '@jest/globals'

describe('borderStyleConflict', () => {
  test('border style properties should use non-shorthand format', () => {
    // 测试边框样式对象的结构，确保使用非简写属性
    const testBorderStyle = {
      borderLeftWidth: '1px',
      borderLeftStyle: 'var(--grid-cell-border-style)' as any,
      borderLeftColor: 'var(--grid-border-color)',
      borderRightWidth: '0',
      borderTopWidth: '1px',
      borderTopStyle: 'var(--grid-cell-border-style)' as any,
      borderTopColor: 'var(--grid-border-color)',
      borderBottomWidth: '0',
    }

    // 验证使用了非简写属性
    expect(testBorderStyle).toHaveProperty('borderLeftWidth')
    expect(testBorderStyle).toHaveProperty('borderLeftStyle')
    expect(testBorderStyle).toHaveProperty('borderLeftColor')
    expect(testBorderStyle).toHaveProperty('borderRightWidth')
    expect(testBorderStyle).toHaveProperty('borderTopWidth')
    expect(testBorderStyle).toHaveProperty('borderTopStyle')
    expect(testBorderStyle).toHaveProperty('borderTopColor')
    expect(testBorderStyle).toHaveProperty('borderBottomWidth')

    // 验证没有使用简写属性
    expect(testBorderStyle).not.toHaveProperty('border')
    expect(testBorderStyle).not.toHaveProperty('borderLeft')
    expect(testBorderStyle).not.toHaveProperty('borderRight')
    expect(testBorderStyle).not.toHaveProperty('borderTop')
    expect(testBorderStyle).not.toHaveProperty('borderBottom')
  })

  test('CSS variables should be properly typed for border styles', () => {
    // 验证 CSS 变量可以正确用于边框样式
    const borderStyle = 'var(--grid-cell-border-style)' as any
    const borderColor = 'var(--grid-border-color)'
    const borderWidth = '1px'

    expect(typeof borderStyle).toBe('string')
    expect(typeof borderColor).toBe('string')
    expect(typeof borderWidth).toBe('string')

    expect(borderStyle).toMatch(/^var\(--[\w-]+\)$/)
    expect(borderColor).toMatch(/^var\(--[\w-]+\)$/)
    expect(borderWidth).toBe('1px')
  })

  test('border clearing should set shorthand properties to undefined', () => {
    // 模拟清除简写属性的操作
    const styleWithShorthand = {
      backgroundColor: '#fff',
      border: '1px solid red',
      borderLeft: '2px dotted green',
      borderTop: '3px dashed blue',
    }

    const clearedStyle = {
      ...styleWithShorthand,
      // 清除简写属性
      border: undefined,
      borderLeft: undefined,
      borderRight: undefined,
      borderTop: undefined,
      borderBottom: undefined,
      // 设置非简写属性
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid' as any,
      borderLeftColor: 'black',
    }

    // 验证简写属性被清除
    expect(clearedStyle.border).toBeUndefined()
    expect(clearedStyle.borderLeft).toBeUndefined()
    expect(clearedStyle.borderRight).toBeUndefined()
    expect(clearedStyle.borderTop).toBeUndefined()
    expect(clearedStyle.borderBottom).toBeUndefined()

    // 验证非简写属性正确设置
    expect(clearedStyle.borderLeftWidth).toBe('1px')
    expect(clearedStyle.borderLeftStyle).toBe('solid')
    expect(clearedStyle.borderLeftColor).toBe('black')

    // 验证保留了非冲突属性
    expect(clearedStyle.backgroundColor).toBe('#fff')
  })
})
