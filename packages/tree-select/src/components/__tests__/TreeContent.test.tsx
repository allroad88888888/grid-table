import { render, screen, fireEvent } from '@testing-library/react'
import { TreeContent } from '../TreeContent'
import type { TreeNode } from '../../types'

describe('TreeContent', () => {
  const mockOnSelect = jest.fn()

  const createMockNode = (overrides: Partial<TreeNode> = {}): TreeNode => ({
    id: 'test-node',
    label: '测试节点',
    disabled: false,
    ...overrides,
  })

  const defaultProps = {
    id: 'test-node',
    nodeMap: new Map([['test-node', createMockNode()]]),
    selectedValue: '',
    multiple: false,
    onSelect: mockOnSelect,
  }

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  it('should render node label correctly', () => {
    render(<TreeContent {...defaultProps} />)
    expect(screen.getByText('测试节点')).toBeInTheDocument()
  })

  it('should call onSelect when clicking enabled node', () => {
    render(<TreeContent {...defaultProps} />)

    const nodeElement = screen.getByText('测试节点')
    fireEvent.click(nodeElement)

    expect(mockOnSelect).toHaveBeenCalledWith('test-node', createMockNode())
  })

  it('should NOT call onSelect when clicking disabled node', () => {
    const disabledNode = createMockNode({ disabled: true })
    const props = {
      ...defaultProps,
      nodeMap: new Map([['test-node', disabledNode]]),
    }

    render(<TreeContent {...props} />)

    const nodeElement = screen.getByText('测试节点')
    fireEvent.click(nodeElement)

    // 禁用节点点击时不应该调用 onSelect
    expect(mockOnSelect).not.toHaveBeenCalled()
  })

  it('should show checkbox in multiple mode', () => {
    const props = {
      ...defaultProps,
      multiple: true,
    }

    render(<TreeContent {...props} />)

    // 应该显示复选框
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('should show checked checkbox when selected in multiple mode', () => {
    const props = {
      ...defaultProps,
      multiple: true,
      selectedValue: ['test-node'],
    }

    render(<TreeContent {...props} />)

    // 应该显示选中的复选框
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toBeChecked()
  })

  it('should show disabled checkbox style for disabled node in multiple mode', () => {
    const disabledNode = createMockNode({ disabled: true })
    const props = {
      ...defaultProps,
      multiple: true,
      nodeMap: new Map([['test-node', disabledNode]]),
    }

    render(<TreeContent {...props} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveClass('tree-select-node-checkbox-disabled')
  })

  it('should show checkmark for selected node in single mode', () => {
    const props = {
      ...defaultProps,
      selectedValue: 'test-node',
    }

    render(<TreeContent {...props} />)

    // 单选模式下选中节点应该显示 ✓
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('should apply disabled styles to disabled nodes', () => {
    const disabledNode = createMockNode({ disabled: true })
    const props = {
      ...defaultProps,
      nodeMap: new Map([['test-node', disabledNode]]),
    }

    render(<TreeContent {...props} />)

    const nodeContainer = screen.getByText('测试节点').closest('.tree-select-node')
    expect(nodeContainer).toHaveClass('tree-select-node-disabled')
  })

  it('should handle missing node gracefully', () => {
    const props = {
      ...defaultProps,
      id: 'non-existent-node',
      nodeMap: new Map(), // 空的 nodeMap
    }

    render(<TreeContent {...props} />)

    // 应该显示节点ID作为fallback
    expect(screen.getByText('non-existent-node')).toBeInTheDocument()
  })

  it('should prevent event propagation when clicking', () => {
    const parentClickHandler = jest.fn()

    render(
      <div onClick={parentClickHandler}>
        <TreeContent {...defaultProps} />
      </div>,
    )

    const nodeElement = screen.getByText('测试节点')
    fireEvent.click(nodeElement)

    // 事件应该被阻止冒泡，父元素的点击处理器不应该被调用
    expect(parentClickHandler).not.toHaveBeenCalled()
    // 但是 onSelect 应该被调用
    expect(mockOnSelect).toHaveBeenCalled()
  })

  describe('custom rendering', () => {
    it('should render custom checkbox when renderCheckbox is provided', () => {
      const renderCheckbox = jest
        .fn()
        .mockReturnValue(<span data-testid="custom-checkbox">Custom ✓</span>)

      const props = {
        ...defaultProps,
        multiple: true,
        renderCheckbox,
      }

      render(<TreeContent {...props} />)

      // 应该显示自定义复选框
      expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument()
      expect(screen.getByText('Custom ✓')).toBeInTheDocument()

      // 应该调用renderCheckbox函数并传递正确参数
      expect(renderCheckbox).toHaveBeenCalledWith({
        isSelected: false,
        disabled: false,
        node: createMockNode(),
        multiple: true,
      })

      // 不应该显示默认复选框
      expect(screen.queryByText('☐')).not.toBeInTheDocument()
    })

    it('should render custom selected icon when renderSelectedIcon is provided', () => {
      const renderSelectedIcon = jest
        .fn()
        .mockReturnValue(<span data-testid="custom-icon">🎯</span>)

      const props = {
        ...defaultProps,
        selectedValue: 'test-node',
        renderSelectedIcon,
      }

      render(<TreeContent {...props} />)

      // 应该显示自定义选中图标
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
      expect(screen.getByText('🎯')).toBeInTheDocument()

      // 应该调用renderSelectedIcon函数并传递正确参数
      expect(renderSelectedIcon).toHaveBeenCalledWith({
        isSelected: true,
        disabled: false,
        node: createMockNode(),
        multiple: false,
      })

      // 不应该显示默认选中标记
      expect(screen.queryByText('✓')).not.toBeInTheDocument()
    })

    it('should pass correct parameters to custom checkbox for disabled selected node', () => {
      const renderCheckbox = jest
        .fn()
        .mockReturnValue(<span data-testid="custom-checkbox">Disabled ✓</span>)
      const disabledNode = createMockNode({ disabled: true })

      const props = {
        ...defaultProps,
        multiple: true,
        selectedValue: ['test-node'],
        nodeMap: new Map([['test-node', disabledNode]]),
        renderCheckbox,
      }

      render(<TreeContent {...props} />)

      // 应该传递正确的参数（选中且禁用）
      expect(renderCheckbox).toHaveBeenCalledWith({
        isSelected: true,
        disabled: true,
        node: disabledNode,
        multiple: true,
      })
    })

    it('should not render custom checkbox in single select mode', () => {
      const renderCheckbox = jest
        .fn()
        .mockReturnValue(<span data-testid="custom-checkbox">Custom</span>)

      const props = {
        ...defaultProps,
        multiple: false, // 单选模式
        renderCheckbox,
      }

      render(<TreeContent {...props} />)

      // 单选模式下不应该调用renderCheckbox
      expect(renderCheckbox).not.toHaveBeenCalled()
      expect(screen.queryByTestId('custom-checkbox')).not.toBeInTheDocument()
    })

    it('should not render custom selected icon when not selected', () => {
      const renderSelectedIcon = jest
        .fn()
        .mockReturnValue(<span data-testid="custom-icon">Icon</span>)

      const props = {
        ...defaultProps,
        selectedValue: '', // 未选中
        renderSelectedIcon,
      }

      render(<TreeContent {...props} />)

      // 未选中时不应该调用renderSelectedIcon
      expect(renderSelectedIcon).not.toHaveBeenCalled()
      expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument()
    })

    it('should not render custom selected icon in multiple mode', () => {
      const renderSelectedIcon = jest
        .fn()
        .mockReturnValue(<span data-testid="custom-icon">Icon</span>)

      const props = {
        ...defaultProps,
        multiple: true, // 多选模式
        selectedValue: ['test-node'],
        renderSelectedIcon,
      }

      render(<TreeContent {...props} />)

      // 多选模式下不应该调用renderSelectedIcon
      expect(renderSelectedIcon).not.toHaveBeenCalled()
      expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument()
    })
  })
})
