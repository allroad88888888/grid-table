import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DropdownFooter } from '../DropdownFooter'

describe('DropdownFooter', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render confirm and cancel buttons by default', () => {
    render(<DropdownFooter onConfirm={mockOnConfirm} onCancel={mockOnCancel} />)

    expect(screen.getByText('确定')).toBeInTheDocument()
    expect(screen.getByText('取消')).toBeInTheDocument()
  })

  it('should call onConfirm when confirm button is clicked', () => {
    render(<DropdownFooter onConfirm={mockOnConfirm} onCancel={mockOnCancel} />)

    fireEvent.click(screen.getByText('确定'))
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when cancel button is clicked', () => {
    render(<DropdownFooter onConfirm={mockOnConfirm} onCancel={mockOnCancel} />)

    fireEvent.click(screen.getByText('取消'))
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('should render custom button text', () => {
    render(
      <DropdownFooter
        confirmText="保存"
        cancelText="重置"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    )

    expect(screen.getByText('保存')).toBeInTheDocument()
    expect(screen.getByText('重置')).toBeInTheDocument()
  })

  it('should render custom children when provided', () => {
    render(
      <DropdownFooter>
        <div>自定义内容</div>
      </DropdownFooter>,
    )

    expect(screen.getByText('自定义内容')).toBeInTheDocument()
    expect(screen.queryByText('确定')).not.toBeInTheDocument()
    expect(screen.queryByText('取消')).not.toBeInTheDocument()
  })

  it('should not render when visible is false', () => {
    render(<DropdownFooter visible={false} onConfirm={mockOnConfirm} onCancel={mockOnCancel} />)

    expect(screen.queryByText('确定')).not.toBeInTheDocument()
    expect(screen.queryByText('取消')).not.toBeInTheDocument()
  })

  it('should have correct CSS classes', () => {
    render(<DropdownFooter onConfirm={mockOnConfirm} onCancel={mockOnCancel} />)

    const footer = screen.getByText('确定').closest('.tree-select-dropdown-footer')
    const buttons = screen.getByText('确定').closest('.tree-select-dropdown-footer-buttons')
    const confirmBtn = screen.getByText('确定')
    const cancelBtn = screen.getByText('取消')

    expect(footer).toBeInTheDocument()
    expect(buttons).toBeInTheDocument()
    expect(confirmBtn).toHaveClass(
      'tree-select-dropdown-footer-button',
      'tree-select-dropdown-footer-confirm',
    )
    expect(cancelBtn).toHaveClass(
      'tree-select-dropdown-footer-button',
      'tree-select-dropdown-footer-cancel',
    )
  })
})
