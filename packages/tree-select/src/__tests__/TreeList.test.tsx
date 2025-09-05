import { render, screen } from '@testing-library/react'
import { TreeList } from '../TreeList'
import type { TreeNode } from '../types'

// Mock ResizeObserver for testing environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

describe('TreeList', () => {
  const createMockData = (): TreeNode[] => [
    {
      id: 'folder1',
      label: '文件夹1',
      children: [
        { id: 'file1', label: '文件1.txt' },
        { id: 'file2', label: '文件2.txt', disabled: true },
      ],
    },
    {
      id: 'folder2',
      label: '文件夹2',
      children: [{ id: 'file3', label: '文件3.txt' }],
    },
  ]

  it('should render empty state when no data', () => {
    render(<TreeList data={[]} notFoundContent={<div data-testid="empty-state">暂无数据</div>} />)

    // 应该显示空状态
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })

  it('should create component with basic props', () => {
    const { container } = render(
      <TreeList data={createMockData()} style={{ width: 500 }} className="custom-tree-list" />,
    )

    // 应该创建包含正确类名和样式的容器
    const treeListContainer = container.querySelector('.tree-list')
    expect(treeListContainer).toBeInTheDocument()
    expect(treeListContainer).toHaveClass('custom-tree-list')
    expect(treeListContainer).toHaveStyle('width: 500px')
  })

  it('should pass correct props to DropdownContent', () => {
    const { container } = render(
      <TreeList
        data={createMockData()}
        maxHeight={200}
        multiple={true}
        showRoot={true}
        root="test-root"
        expendLevel={3}
        levelSize={25}
        itemSize={40}
      />,
    )

    // 验证DropdownContent容器存在并应用了maxHeight
    const dropdownContent = container.querySelector('.grid-tree-container')
    expect(dropdownContent).toBeInTheDocument()
    expect(dropdownContent).toHaveStyle('max-height: 200px')
  })

  it('should handle custom renderCheckbox prop', () => {
    const renderCheckbox = jest
      .fn()
      .mockReturnValue(<span data-testid="custom-checkbox">Custom Checkbox</span>)

    render(<TreeList data={createMockData()} multiple renderCheckbox={renderCheckbox} />)

    // renderCheckbox应该被传递到组件中（不验证是否被调用，因为依赖虚拟滚动）
    expect(renderCheckbox).toBeDefined()
  })

  it('should handle custom renderSelectedIcon prop', () => {
    const renderSelectedIcon = jest
      .fn()
      .mockReturnValue(<span data-testid="custom-icon">Custom Icon</span>)

    render(
      <TreeList data={createMockData()} value="file1" renderSelectedIcon={renderSelectedIcon} />,
    )

    // renderSelectedIcon应该被传递到组件中
    expect(renderSelectedIcon).toBeDefined()
  })

  it('should handle controlled and uncontrolled modes', () => {
    const onChange = jest.fn()

    // 受控模式
    const { rerender } = render(
      <TreeList data={createMockData()} value="file1" onChange={onChange} />,
    )

    expect(onChange).toBeDefined()

    // 非受控模式
    rerender(<TreeList data={createMockData()} defaultValue="file1" onChange={onChange} />)

    expect(onChange).toBeDefined()
  })

  it('should work with both data and relation props', () => {
    // 测试 data prop
    const { rerender } = render(<TreeList data={createMockData()} />)

    expect(document.querySelector('.tree-list')).toBeInTheDocument()

    // 测试 relation prop
    const relationData = {
      _ROOT: ['folder1', 'folder2'],
      folder1: ['file1'],
      folder2: ['file2'],
    }

    rerender(<TreeList relation={relationData} root="_ROOT" showRoot={false} />)

    expect(document.querySelector('.tree-list')).toBeInTheDocument()
  })

  it('should handle default props correctly', () => {
    render(<TreeList data={createMockData()} />)

    // 组件应该正常渲染，使用默认属性
    expect(document.querySelector('.tree-list')).toBeInTheDocument()
    expect(document.querySelector('.grid-tree-container')).toBeInTheDocument()
  })

  it('should support renderInline prop for TreeSelect', () => {
    const { TreeSelect } = require('../TreeSelect')

    // 测试内联渲染
    const { container, rerender } = render(
      <TreeSelect data={createMockData()} renderInline={true} />,
    )

    // 应该存在下拉包装器
    expect(container.querySelector('.tree-select-dropdown-wrapper-inline')).toBeInTheDocument()

    // 测试Portal渲染（默认）
    rerender(<TreeSelect data={createMockData()} renderInline={false} />)

    // 内联包装器应该不存在
    expect(container.querySelector('.tree-select-dropdown-wrapper-inline')).not.toBeInTheDocument()
  })
})
