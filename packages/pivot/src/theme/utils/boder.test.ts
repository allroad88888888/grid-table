import type { CSSProperties } from 'react'
import { transformToBorderLeftBottom } from './border'

describe('extractBorderProperties', () => {
  it('should extract left and bottom border properties while preserving other properties', () => {
    const testStyle: CSSProperties = {
      borderLeftStyle: 'dashed',
      borderLeftWidth: '1px',
      borderLeftColor: '#00f',
      borderBottomStyle: 'dashed',
      borderBottomWidth: '1px',
      borderBottomColor: '#800',
      fontSize: 20,
      color: 'red',
    }

    const result = transformToBorderLeftBottom(testStyle)

    expect(result).toEqual({
      borderLeftStyle: 'dashed',
      borderLeftWidth: '1px',
      borderLeftColor: '#00f',
      borderBottomStyle: 'dashed',
      borderBottomWidth: '1px',
      borderBottomColor: '#800',
      fontSize: 20,
      color: 'red',
    })
  })

  it('should handle shorthand border property', () => {
    const testStyle: CSSProperties = {
      border: '1px solid red',
      fontSize: 20,
      color: 'red',
    }

    const result = transformToBorderLeftBottom(testStyle)

    expect(result).toEqual({
      fontSize: 20,
      color: 'red',
      borderLeft: '1px solid red',
      borderBottom: '1px solid red',
    })
  })

  it('should handle style object with no border properties', () => {
    const testStyle: CSSProperties = {
      fontSize: 20,
      color: 'red',
      backgroundColor: 'white',
    }

    const result = transformToBorderLeftBottom(testStyle)

    expect(result).toEqual({
      fontSize: 20,
      color: 'red',
      backgroundColor: 'white',
    })
  })

  it('should handle empty style object', () => {
    const testStyle: CSSProperties = {}
    const result = transformToBorderLeftBottom(testStyle)
    expect(result).toEqual({})
  })

  it('should handle style object with partial border properties', () => {
    const testStyle: CSSProperties = {
      borderLeftWidth: '1px',
      borderBottomColor: 'red',
      fontSize: 20,
      color: 'red',
    }

    const result = transformToBorderLeftBottom(testStyle)

    expect(result).toEqual({
      borderLeftWidth: '1px',
      borderBottomColor: 'red',
      fontSize: 20,
      color: 'red',
    })
  })
})
