import { useState } from 'react'
import { TreeSelect } from '@grid-tree/select'
import type { TreeNode, SelectValue } from '@grid-tree/select'
import './TreeSelectConfirmDemo.css'

// 部门数据
const departmentData: TreeNode[] = [
  {
    id: '1',
    label: '技术部',
    children: [
      { id: '1-1', label: '前端团队' },
      { id: '1-2', label: 'React开发组' },
      { id: '1-3', label: 'Vue开发组' },
      { id: '1-4', label: '移动端团队' },
    ],
  },
  {
    id: '2',
    label: '产品部',
    children: [
      { id: '2-1', label: '产品策划' },
      { id: '2-2', label: '用户研究' },
      { id: '2-3', label: '数据分析' },
    ],
  },
  {
    id: '3',
    label: '运营部',
    children: [
      { id: '3-1', label: '内容运营' },
      { id: '3-2', label: '用户运营' },
      { id: '3-3', label: '活动运营' },
    ],
  },
  {
    id: '4',
    label: '设计部',
    children: [
      { id: '4-1', label: 'UI设计' },
      { id: '4-2', label: 'UX设计' },
      { id: '4-3', label: '视觉设计' },
    ],
  },
]

// 项目数据
const projectData: TreeNode[] = [
  {
    id: 'p1',
    label: '重点项目',
    children: [
      { id: 'p1-1', label: '用户中心升级' },
      { id: 'p1-2', label: '支付系统重构' },
      { id: 'p1-3', label: '数据平台建设' },
    ],
  },
  {
    id: 'p2',
    label: '日常项目',
    children: [
      { id: 'p2-1', label: 'Bug修复' },
      { id: 'p2-2', label: '功能优化' },
      { id: 'p2-3', label: '性能提升' },
    ],
  },
  {
    id: 'p3',
    label: '实验项目',
    children: [
      { id: 'p3-1', label: 'AI智能推荐' },
      { id: 'p3-2', label: '区块链应用' },
      { id: 'p3-3', label: '物联网集成' },
    ],
  },
]

export function TreeSelectConfirmDemo() {
  const [selectedTeams, setSelectedTeams] = useState<SelectValue>([])
  const [selectedProjects, setSelectedProjects] = useState<SelectValue>([])

  // 复杂场景的选中状态
  const [taskTeams, setTaskTeams] = useState<SelectValue>([])
  const [permissionProjects, setPermissionProjects] = useState<SelectValue>([])
  const [exportDepartments, setExportDepartments] = useState<SelectValue>([])
  const [customTeams, setCustomTeams] = useState<SelectValue>([])

  return (
    <div className="tree-select-confirm-demo">
      {/* 基础确认模式 */}
      <div className="demo-section">
        <h2>🔒 基础确认模式</h2>
        <p>开启确认模式后，需要点击"确定"按钮才会触发 onChange 事件</p>

        <div className="demo-item">
          <label>选择团队（确认模式）：</label>
          <TreeSelect
            data={departmentData}
            multiple
            confirmSelect={true}
            value={selectedTeams}
            placeholder="请选择团队（需要确认）"
            style={{ width: 400 }}
            onChange={(value, nodes) => {
              setSelectedTeams(value)
            }}
          />
        </div>

        <div className="demo-item">
          <label>选择项目（普通模式）：</label>
          <TreeSelect
            data={projectData}
            multiple
            confirmSelect={false}
            value={selectedProjects}
            placeholder="请选择项目（立即生效）"
            style={{ width: 400 }}
            onChange={(value, nodes) => {
              setSelectedProjects(value)
            }}
          />
        </div>

        <div className="demo-result">
          <div className="result-item">
            <strong>当前选中团队：</strong>
            <span className="result-value">
              {Array.isArray(selectedTeams) ? selectedTeams.join(', ') : selectedTeams || '无'}
            </span>
          </div>
          <div className="result-item">
            <strong>当前选中项目：</strong>
            <span className="result-value">
              {Array.isArray(selectedProjects)
                ? selectedProjects.join(', ')
                : selectedProjects || '无'}
            </span>
          </div>
        </div>
      </div>

      {/* 操作对比 */}
      <div className="demo-section">
        <h2>⚖️ 操作对比演示</h2>
        <p>直观对比确认模式与普通模式的操作差异</p>

        <div className="comparison-container">
          <div className="comparison-item">
            <div className="comparison-header confirm-mode">
              <h3>🔐 确认模式</h3>
              <div className="mode-badge confirm">需要确认</div>
            </div>
            <TreeSelect
              data={departmentData}
              multiple
              confirmSelect={true}
              placeholder="多选后点击确定"
              style={{ width: '100%' }}
              onChange={(value, nodes) => {}}
            />
            <div className="feature-list">
              <div className="feature-item">✅ 选择过程不触发onChange</div>
              <div className="feature-item">✅ 需要点击"确定"才生效</div>
              <div className="feature-item">✅ 可以点击"取消"撤销</div>
              <div className="feature-item">✅ 使用TreeList组件渲染</div>
            </div>
          </div>

          <div className="comparison-item">
            <div className="comparison-header normal-mode">
              <h3>⚡ 普通模式</h3>
              <div className="mode-badge normal">立即生效</div>
            </div>
            <TreeSelect
              data={departmentData}
              multiple
              confirmSelect={false}
              placeholder="选择后立即生效"
              style={{ width: '100%' }}
              onChange={(value, nodes) => {}}
            />
            <div className="feature-list">
              <div className="feature-item">⚡ 选择即触发onChange</div>
              <div className="feature-item">⚡ 无需确认，立即生效</div>
              <div className="feature-item">⚡ 无法撤销已选择的</div>
              <div className="feature-item">⚡ 使用DropdownContent组件</div>
            </div>
          </div>
        </div>
      </div>

      {/* 复杂场景演示 */}
      <div className="demo-section">
        <h2>🎯 复杂场景演示</h2>
        <p>模拟真实业务场景中的确认选择需求</p>

        <div className="scenario-container">
          <div className="scenario-item">
            <h3>📋 任务分配场景</h3>
            <p>为重要项目分配团队成员，需要谨慎确认</p>
            <TreeSelect
              data={departmentData}
              multiple
              confirmSelect={true}
              value={taskTeams}
              placeholder="选择参与团队（重要项目）"
              style={{ width: '100%' }}
              maxTagCount={2}
              onChange={(value, nodes) => {
                setTaskTeams(value)
              }}
            />
          </div>

          <div className="scenario-item">
            <h3>🚨 权限配置场景</h3>
            <p>配置系统权限，错误操作影响严重，必须确认</p>
            <TreeSelect
              data={projectData}
              multiple
              confirmSelect={true}
              value={permissionProjects}
              placeholder="选择授权项目（需要确认）"
              style={{ width: '100%' }}
              autoMaxTagCount={true}
              onChange={(value, nodes) => {
                setPermissionProjects(value)
              }}
            />
          </div>

          <div className="scenario-item">
            <h3>📊 数据导出场景</h3>
            <p>批量导出敏感数据，需要确认选择范围</p>
            <TreeSelect
              data={departmentData}
              multiple
              confirmSelect={true}
              value={exportDepartments}
              placeholder="选择导出范围（批量操作）"
              style={{ width: '100%' }}
              renderCheckbox={({ isSelected, disabled, node }) => (
                <span
                  style={{
                    color: isSelected ? '#52c41a' : '#d9d9d9',
                    fontSize: '16px',
                    marginRight: '8px',
                  }}
                >
                  {isSelected ? '✅' : '⬜'}
                </span>
              )}
              onChange={(value, nodes) => {
                setExportDepartments(value)
              }}
            />
          </div>

          <div className="scenario-item">
            <h3>🎨 自定义节点内容</h3>
            <p>完全自定义每个节点的渲染内容和交互</p>
            <TreeSelect
              data={departmentData}
              multiple
              confirmSelect={true}
              value={customTeams}
              placeholder="选择团队（自定义样式）"
              style={{ width: '100%' }}
              renderItem={({ node, isSelected, disabled, onSelect }) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: isSelected ? '#e6f7ff' : 'transparent',
                    border: `2px solid ${isSelected ? '#1890ff' : 'transparent'}`,
                    borderRadius: '6px',
                    margin: '2px 0',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => !disabled && onSelect(node.id, node)}
                >
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>
                    {node.id.startsWith('1')
                      ? '💻'
                      : node.id.startsWith('2')
                        ? '📱'
                        : node.id.startsWith('3')
                          ? '📈'
                          : '🎨'}
                  </span>
                  <span
                    style={{
                      fontWeight: isSelected ? 'bold' : 'normal',
                      color: isSelected ? '#1890ff' : '#333',
                    }}
                  >
                    {node.label}
                  </span>
                  {isSelected && <span style={{ marginLeft: 'auto', color: '#52c41a' }}>✓</span>}
                </div>
              )}
              onChange={(value, nodes) => {
                setCustomTeams(value)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
