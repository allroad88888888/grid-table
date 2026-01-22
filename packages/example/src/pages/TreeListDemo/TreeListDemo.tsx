import { useState } from 'react'
import { TreeList } from '@grid-tree/select'
import type { TreeNode, SelectValue } from '@grid-tree/select'
import './TreeListDemo.css'

// 示例数据 - 文件系统结构
const fileSystemData: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button.tsx', label: 'Button.tsx' },
          { id: 'input.tsx', label: 'Input.tsx' },
          { id: 'modal.tsx', label: 'Modal.tsx', disabled: true },
        ],
      },
      {
        id: 'pages',
        label: 'pages',
        children: [
          { id: 'home.tsx', label: 'Home.tsx' },
          { id: 'about.tsx', label: 'About.tsx' },
          { id: 'contact.tsx', label: 'Contact.tsx' },
        ],
      },
      {
        id: 'utils',
        label: 'utils',
        children: [
          { id: 'helpers.ts', label: 'helpers.ts' },
          { id: 'constants.ts', label: 'constants.ts' },
        ],
      },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'index.html', label: 'index.html' },
      { id: 'favicon.ico', label: 'favicon.ico' },
      {
        id: 'assets',
        label: 'assets',
        children: [
          { id: 'logo.png', label: 'logo.png' },
          { id: 'banner.jpg', label: 'banner.jpg' },
        ],
      },
    ],
  },
  {
    id: 'docs',
    label: 'docs',
    children: [
      { id: 'readme.md', label: 'README.md' },
      { id: 'changelog.md', label: 'CHANGELOG.md' },
    ],
  },
]

// 部门数据
const departmentData: TreeNode[] = [
  {
    id: 'engineering',
    label: '工程部',
    children: [
      {
        id: 'frontend',
        label: '前端团队',
        children: [
          { id: 'react-team', label: 'React团队' },
          { id: 'vue-team', label: 'Vue团队' },
        ],
      },
      {
        id: 'backend',
        label: '后端团队',
        children: [
          { id: 'java-team', label: 'Java团队' },
          { id: 'python-team', label: 'Python团队' },
        ],
      },
    ],
  },
  {
    id: 'design',
    label: '设计部',
    children: [
      { id: 'ui-team', label: 'UI团队' },
      { id: 'ux-team', label: 'UX团队' },
    ],
  },
]

export function TreeListDemo() {
  const [singleSelection, setSingleSelection] = useState<SelectValue>('')
  const [multipleSelection, setMultipleSelection] = useState<SelectValue>([
    'button.tsx',
    'home.tsx',
  ])
  const [departmentSelection, setDepartmentSelection] = useState<SelectValue>([])

  return (
    <div className="tree-list-demo">
      <h1>TreeList 组件演示</h1>
      <p className="demo-description">
        TreeList 是一个独立的树形列表组件，支持选择功能，基于 DropdownContent
        构建但不包含下拉选择器。 适用于需要直接展示树形结构并支持选择的场景。
      </p>

      <div className="demo-section">
        <h2>基础使用</h2>
        <p>最简单的树形列表</p>
        <div className="demo-item">
          <label>文件系统（只读）：</label>
          <TreeList data={fileSystemData} style={{ width: 400, height: 300 }} maxHeight={300} />
        </div>
      </div>

      <div className="demo-section">
        <h2>单选模式</h2>
        <p>支持单个节点选择</p>
        <div className="demo-item">
          <label>选择文件：</label>
          <TreeList
            data={fileSystemData}
            value={singleSelection}
            onChange={(value, node) => {
              console.log('Single selection changed:', { value, node })
              setSingleSelection(value)
            }}
            style={{ width: 400, height: 300 }}
            maxHeight={300}
          />
          <div className="demo-result">选中文件: {singleSelection || '未选择'}</div>
        </div>
      </div>

      <div className="demo-section">
        <h2>多选模式</h2>
        <p>支持多个节点选择</p>
        <div className="demo-item">
          <label>选择多个文件：</label>
          <TreeList
            data={fileSystemData}
            multiple
            value={multipleSelection}
            onChange={(value, nodes) => {
              console.log('Multiple selection changed:', { value, nodes })
              setMultipleSelection(value)
            }}
            style={{ width: 400, height: 300 }}
            maxHeight={300}
          />
          <div className="demo-result">选中文件: {JSON.stringify(multipleSelection)}</div>
        </div>
      </div>

      <div className="demo-section">
        <h2>自定义渲染</h2>
        <p>自定义复选框和选中图标</p>
        <div className="demo-item">
          <label>部门选择（自定义复选框）：</label>
          <TreeList
            data={departmentData}
            multiple
            value={departmentSelection}
            onChange={(value, nodes) => {
              console.log('Department selection changed:', { value, nodes })
              setDepartmentSelection(value)
            }}
            style={{ width: 400, height: 250 }}
            maxHeight={250}
            renderCheckbox={({ isSelected, disabled, node }) => {
              // 根据部门类型使用不同图标
              let icon = '📄'
              if (node.id.includes('engineering')) icon = '⚙️'
              else if (node.id.includes('design')) icon = '🎨'
              else if (node.id.includes('frontend')) icon = '🌐'
              else if (node.id.includes('backend')) icon = '💾'
              else if (node.id.includes('team')) icon = '👥'

              return (
                <span
                  style={{
                    fontSize: '16px',
                    opacity: disabled ? 0.5 : isSelected ? 1 : 0.6,
                    filter: isSelected ? 'brightness(1.3)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {icon}
                </span>
              )
            }}
          />
          <div className="demo-result">选中部门: {JSON.stringify(departmentSelection)}</div>
        </div>
      </div>

      <div className="demo-section">
        <h2>不同配置</h2>
        <p>展示不同的配置选项</p>
        <div className="demo-item">
          <label>显示根节点：</label>
          <TreeList
            data={fileSystemData}
            treeProps={{
              showRoot: true,
              root: '根目录',
            }}
            style={{ width: 400, height: 300 }}
            maxHeight={300}
          />
        </div>
        <div className="demo-item">
          <label>自定义展开层级：</label>
          <TreeList
            data={fileSystemData}
            treeProps={{
              expendLevel: 1, // 只展开一层
            }}
            style={{ width: 400, height: 300 }}
            maxHeight={300}
          />
        </div>
        <div className="demo-item">
          <label>自定义项目高度：</label>
          <TreeList
            data={fileSystemData}
            treeProps={{
              size: 40, // 更大的行高
            }}
            style={{ width: 400, height: 300 }}
            maxHeight={300}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>自定义节点渲染</h2>
        <p>使用 renderItem 完全自定义节点内容</p>
        <div className="demo-item">
          <label>卡片式渲染：</label>
          <TreeList
            data={departmentData}
            multiple
            style={{ width: 400, height: 350 }}
            maxHeight={350}
            renderItem={({ node, isSelected, disabled, onSelect }) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  margin: '4px 8px',
                  background: isSelected
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#f8f9fa',
                  border: `2px solid ${isSelected ? '#667eea' : '#dee2e6'}`,
                  borderRadius: '8px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  color: isSelected ? 'white' : '#495057',
                  boxShadow: isSelected
                    ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                    : '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onClick={() => !disabled && onSelect(node.id, node)}
                onMouseEnter={(e) => {
                  if (!disabled && !isSelected) {
                    e.currentTarget.style.transform = 'scale(1.01)'
                    e.currentTarget.style.borderColor = '#adb5bd'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!disabled && !isSelected) {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.borderColor = '#dee2e6'
                  }
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isSelected
                      ? 'rgba(255,255,255,0.2)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '18px',
                    color: isSelected ? 'white' : 'white',
                  }}
                >
                  {node.id.startsWith('1')
                    ? '💻'
                    : node.id.startsWith('2')
                      ? '📱'
                      : node.id.startsWith('3')
                        ? '📈'
                        : '🎨'}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      marginBottom: '2px',
                    }}
                  >
                    {node.label}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      opacity: 0.8,
                    }}
                  >
                    ID: {node.id} • {node.children ? `${node.children.length} 子项` : '叶子节点'}
                  </div>
                </div>
                {isSelected && (
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            )}
            onChange={(value, nodes) => {
              console.log('Custom render selection:', { value, nodes })
            }}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>空数据状态</h2>
        <p>处理空数据的情况</p>
        <div className="demo-item">
          <label>空列表：</label>
          <TreeList
            data={[]}
            style={{ width: 400, height: 150 }}
            maxHeight={150}
            notFoundContent={
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#999',
                }}
              >
                🗂️ 暂无数据
              </div>
            }
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>样式定制</h2>
        <p>自定义样式的树形列表</p>
        <div className="demo-item">
          <label>深色主题：</label>
          <div
            className="tree-list-dark-theme"
            style={
              {
                '--tree-select-bg': '#1f1f1f',
                '--tree-select-text-color': '#ffffff',
                '--tree-select-border': '#404040',
                '--tree-select-hover-bg': '#2a2a2a',
                '--tree-select-selected-bg': '#0d7377',
                '--tree-select-selected-color': '#ffffff',
              } as React.CSSProperties
            }
          >
            <TreeList
              data={departmentData}
              multiple
              style={{ width: 400, height: 250 }}
              maxHeight={250}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
