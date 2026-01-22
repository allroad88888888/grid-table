import { renderHook } from '@testing-library/react'
import { useTablePaste, useTablePasteTsv, useTablePasteData } from '../useTablePaste'

function createMockClipboardEvent(data: Record<string, string>): ClipboardEvent {
  return {
    preventDefault: jest.fn(),
    clipboardData: {
      getData: (type: string) => data[type] || '',
    },
  } as unknown as ClipboardEvent
}

describe('useTablePaste', () => {
  it('should return paste handler', () => {
    const onPaste = jest.fn()
    const { result } = renderHook(() => useTablePaste(onPaste))

    expect(typeof result.current).toBe('function')
  })

  it('should call onPaste with parsed table data', () => {
    const onPaste = jest.fn()
    const { result } = renderHook(() => useTablePaste(onPaste))

    const event = createMockClipboardEvent({
      'text/html': '<table><tr><td>A</td><td>B</td></tr></table>',
      'text/plain': 'A\tB',
    })

    result.current(event)

    expect(onPaste).toHaveBeenCalledWith({
      tsv: 'A\tB',
      data: [['A', 'B']],
      rawText: 'A\tB',
      rawHtml: '<table><tr><td>A</td><td>B</td></tr></table>',
    })
  })

  it('should handle empty clipboard', () => {
    const onPaste = jest.fn()
    const { result } = renderHook(() => useTablePaste(onPaste))

    const event = createMockClipboardEvent({})

    result.current(event)

    expect(onPaste).toHaveBeenCalledWith({
      tsv: null,
      data: null,
      rawText: '',
      rawHtml: '',
    })
  })

  it('should parse multi-row table', () => {
    const onPaste = jest.fn()
    const { result } = renderHook(() => useTablePaste(onPaste))

    const event = createMockClipboardEvent({
      'text/html': `
        <table>
          <tr><td>1</td><td>2</td></tr>
          <tr><td>3</td><td>4</td></tr>
        </table>
      `,
      'text/plain': '1\t2\n3\t4',
    })

    result.current(event)

    expect(onPaste).toHaveBeenCalled()
    const callArg = onPaste.mock.calls[0][0]
    expect(callArg.tsv).toBe('1\t2\n3\t4')
    expect(callArg.data).toEqual([
      ['1', '2'],
      ['3', '4'],
    ])
  })
})

describe('useTablePasteTsv', () => {
  it('should return TSV string directly', () => {
    const onPaste = jest.fn()
    const { result } = renderHook(() => useTablePasteTsv(onPaste))

    const event = createMockClipboardEvent({
      'text/html': '<table><tr><td>X</td><td>Y</td></tr></table>',
    })

    result.current(event)

    expect(onPaste).toHaveBeenCalledWith('X\tY')
  })
})

describe('useTablePasteData', () => {
  it('should return 2D array directly', () => {
    const onPaste = jest.fn()
    const { result } = renderHook(() => useTablePasteData(onPaste))

    const event = createMockClipboardEvent({
      'text/html': '<table><tr><td>A</td><td>B</td></tr></table>',
    })

    result.current(event)

    expect(onPaste).toHaveBeenCalledWith([['A', 'B']])
  })
})
