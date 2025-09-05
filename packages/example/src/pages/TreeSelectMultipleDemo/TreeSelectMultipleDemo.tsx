import { useState } from 'react'
import { TreeSelect } from '@grid-tree/select'
import type { TreeNode, SelectValue } from '@grid-tree/select'
import './TreeSelectMultipleDemo.css'

// 示例数据 - 部门组织架构
const departmentData: TreeNode[] = [
  {
    id: 'tech',
    label: '技术部',
    children: [
      {
        id: 'frontend',
        label: '前端团队',
        children: [
          { id: 'react', label: 'React开发组' },
          { id: 'vue', label: 'Vue开发组', disabled: true }, // 禁用节点示例
          { id: 'mobile', label: '移动端开发组' },
        ],
      },
      {
        id: 'backend',
        label: '后端团队',
        children: [
          { id: 'java', label: 'Java开发组' },
          { id: 'nodejs', label: 'Node.js开发组' },
          { id: 'python', label: 'Python开发组', disabled: true }, // 禁用节点示例
        ],
      },
      {
        id: 'devops',
        label: '运维团队',
        disabled: true, // 整个团队禁用
        children: [
          { id: 'cloud', label: '云服务组' },
          { id: 'security', label: '安全组' },
          { id: 'monitor', label: '监控组' },
        ],
      },
    ],
  },
  {
    id: 'product',
    label: '产品部',
    children: [
      { id: 'pm', label: '产品经理团队' },
      { id: 'ui', label: 'UI设计团队' },
      { id: 'ux', label: 'UX体验团队', disabled: true }, // 禁用节点示例
    ],
  },
  {
    id: 'marketing',
    label: '市场部',
    children: [
      { id: 'promotion', label: '推广团队' },
      { id: 'content', label: '内容团队' },
      { id: 'data', label: '数据分析团队' },
    ],
  },
]

// 项目数据
const projectData: TreeNode[] = [
  {
    id: 'web-projects',
    label: 'Web项目',
    children: [
      { id: 'admin-system', label: '管理后台系统' },
      { id: 'user-portal', label: '用户门户' },
      { id: 'mobile-web', label: '移动端H5' },
      { id: 'marketing-site', label: '营销官网' },
    ],
  },
  {
    id: 'mobile-projects',
    label: '移动端项目',
    children: [
      { id: 'ios-app', label: 'iOS应用' },
      { id: 'android-app', label: 'Android应用' },
      { id: 'react-native', label: 'RN混合应用' },
    ],
  },
  {
    id: 'backend-projects',
    label: '后端项目',
    children: [
      { id: 'api-gateway', label: 'API网关' },
      { id: 'user-service', label: '用户服务' },
      { id: 'order-service', label: '订单服务' },
      { id: 'payment-service', label: '支付服务' },
    ],
  },
]

export function TreeSelectMultipleDemo() {
  const [selectedDepartments, setSelectedDepartments] = useState<SelectValue>([])
  const [selectedProjects, setSelectedProjects] = useState<SelectValue>(['admin-system', 'ios-app'])
  const [disabledSelection, setDisabledSelection] = useState<SelectValue>(['react', 'vue'])

  return (
    <div className="tree-select-multiple-demo">
      <h1>TreeSelect 多选模式演示</h1>

      <div className="demo-section">
        <h2>基础多选</h2>
        <p>支持多选，显示复选框，选中后显示为标签</p>
        <div className="demo-item">
          <label>选择部门（多选）：</label>
          <TreeSelect
            data={departmentData}
            multiple
            value={selectedDepartments}
            onChange={(value, nodes) => {
              console.log('Department selection changed:', { value, nodes })
              setSelectedDepartments(value)
            }}
            placeholder="请选择部门..."
            allowClear
            style={{ width: 400 }}
          />
          <div className="demo-result">选中值: {JSON.stringify(selectedDepartments)}</div>
        </div>
      </div>

      <div className="demo-section">
        <h2>预设默认值</h2>
        <p>多选模式下的默认选中值</p>
        <div className="demo-item">
          <label>选择项目（多选）：</label>
          <TreeSelect
            data={projectData}
            multiple
            value={selectedProjects}
            onChange={(value, nodes) => {
              console.log('Project selection changed:', { value, nodes })
              setSelectedProjects(value)
            }}
            placeholder="请选择项目..."
            allowClear
            style={{ width: 400 }}
            maxTagCount={2}
          />
          <div className="demo-result">选中值: {JSON.stringify(selectedProjects)}</div>
        </div>
      </div>

      <div className="demo-section">
        <h2>禁用状态</h2>
        <p>禁用状态下的多选组件</p>
        <div className="demo-item">
          <label>选择部门（整个组件禁用）：</label>
          <TreeSelect
            data={departmentData}
            multiple
            value={disabledSelection}
            onChange={setDisabledSelection}
            placeholder="整个组件禁用"
            disabled
            style={{ width: 400 }}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>禁用节点</h2>
        <p>包含禁用节点的树形选择，禁用的节点无法被选中</p>
        <div className="demo-item">
          <label>包含禁用节点的部门选择：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="注意灰色禁用节点无法选中"
            style={{ width: 400 }}
            onChange={(value, nodes) => {
              console.log('Selected with disabled nodes:', { value, nodes })
            }}
          />
          <div
            style={{
              marginTop: 8,
              padding: 8,
              background: '#f0f8ff',
              borderRadius: 4,
              fontSize: 12,
              color: '#666',
            }}
          >
            <strong>禁用节点说明：</strong>
            <br />• Vue开发组 (禁用)
            <br />• Python开发组 (禁用)
            <br />• 运维团队 (整个团队禁用)
            <br />• UX体验团队 (禁用)
            <br />
            <em>禁用的节点显示为灰色且无法点击选择</em>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>不同尺寸</h2>
        <p>多选组件的不同尺寸</p>
        <div className="demo-item">
          <label>小尺寸：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="小尺寸多选"
            size="small"
            style={{ width: 300 }}
          />
        </div>
        <div className="demo-item">
          <label>中等尺寸：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="中等尺寸多选"
            size="middle"
            style={{ width: 300 }}
          />
        </div>
        <div className="demo-item">
          <label>大尺寸：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="大尺寸多选"
            size="large"
            style={{ width: 300 }}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>自定义标签数量</h2>
        <p>控制最大显示标签数量</p>
        <div className="demo-item">
          <label>最多显示1个标签：</label>
          <TreeSelect
            data={projectData}
            multiple
            placeholder="最多显示1个标签"
            style={{ width: 400 }}
            maxTagCount={1}
          />
        </div>
        <div className="demo-item">
          <label>最多显示3个标签：</label>
          <TreeSelect
            data={projectData}
            multiple
            placeholder="最多显示3个标签"
            style={{ width: 400 }}
            maxTagCount={3}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>自适应标签数量</h2>
        <p>根据容器宽度和标签内容自动计算显示数量</p>
        <div className="demo-item">
          <label>宽容器自适应：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="容器宽度充足时自动适应"
            style={{ width: 600 }}
            autoMaxTagCount
            maxTagCount={10}
          />
        </div>
        <div className="demo-item">
          <label>窄容器自适应：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="容器宽度有限时自动适应"
            style={{ width: 300 }}
            autoMaxTagCount
            maxTagCount={10}
          />
        </div>
        <div className="demo-item">
          <label>超窄容器自适应：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="超窄容器自适应"
            style={{ width: 200 }}
            autoMaxTagCount
            maxTagCount={10}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>自定义渲染</h2>
        <p>自定义复选框和选中图标的渲染</p>
        <div className="demo-item">
          <label>使用HTML Checkbox（多选）：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="使用真实的HTML复选框"
            style={{ width: 400 }}
            renderCheckbox={({ isSelected, disabled }) => (
              <input
                type="checkbox"
                checked={isSelected}
                disabled={disabled}
                onChange={() => {}} // 由父组件处理
                style={{
                  margin: 0,
                  accentColor: '#1890ff',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              />
            )}
          />
        </div>
        <div className="demo-item">
          <label>自定义选中图标（单选）：</label>
          <TreeSelect
            data={departmentData}
            placeholder="自定义选中图标"
            style={{ width: 400 }}
            renderSelectedIcon={({ isSelected, disabled }) => (
              <span
                style={{
                  color: disabled ? '#ccc' : '#52c41a',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {isSelected ? '🎯' : ''}
              </span>
            )}
          />
        </div>
        <div className="demo-item">
          <label>自定义样式复选框（多选）：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="自定义样式的复选框"
            style={{ width: 400 }}
            renderCheckbox={({ isSelected, disabled, node }) => (
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `2px solid ${disabled ? '#d9d9d9' : '#1890ff'}`,
                  borderRadius: 3,
                  background: isSelected ? (disabled ? '#f5f5f5' : '#1890ff') : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      color: 'white',
                      fontSize: '10px',
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            )}
          />
        </div>
        <div className="demo-item">
          <label>条件渲染（根据节点类型）：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="根据节点ID定制图标"
            style={{ width: 400 }}
            renderCheckbox={({ isSelected, disabled, node }) => {
              // 根据节点ID选择不同的图标
              let icon = '📄'
              if (node.id.includes('tech')) icon = '💻'
              else if (node.id.includes('product')) icon = '🎨'
              else if (node.id.includes('marketing')) icon = '📢'
              else if (node.id.includes('frontend')) icon = '🌐'
              else if (node.id.includes('backend')) icon = '⚙️'
              else if (node.id.includes('devops')) icon = '🔧'

              return (
                <span
                  style={{
                    fontSize: '14px',
                    opacity: disabled ? 0.5 : isSelected ? 1 : 0.7,
                    filter: isSelected ? 'brightness(1.2)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {icon}
                </span>
              )
            }}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>渲染模式对比</h2>
        <p>Portal渲染 vs 内联渲染的区别</p>
        <div className="demo-item">
          <label>Portal渲染（默认）：</label>
          <div
            style={{
              border: '2px dashed #ccc',
              padding: '16px',
              overflow: 'hidden',
              height: '120px',
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#666' }}>
              下拉菜单渲染到body，可以超出父容器边界
            </p>
            <TreeSelect
              data={departmentData}
              multiple
              placeholder="Portal渲染模式"
              style={{ width: 300 }}
              renderInline={false}
            />
          </div>
        </div>
        <div className="demo-item">
          <label>内联渲染：</label>
          <div
            style={{
              border: '2px dashed #f4a261',
              padding: '16px',
              overflow: 'hidden',
              height: '250px',
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#666' }}>
              下拉菜单在组件内渲染，受父容器overflow限制
            </p>
            <TreeSelect
              data={departmentData}
              multiple
              placeholder="内联渲染模式"
              style={{ width: 300 }}
              renderInline={true}
            />
          </div>
        </div>
        <div className="demo-item">
          <label>适用场景说明：</label>
          <div
            style={{
              background: '#f6f8fa',
              border: '1px solid #e1e4e8',
              borderRadius: '6px',
              padding: '16px',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            <div>
              <strong>Portal渲染（默认）:</strong>
            </div>
            <ul style={{ margin: '8px 0 16px 20px' }}>
              <li>✅ 避免z-index冲突，确保下拉菜单在最顶层</li>
              <li>✅ 不受父容器overflow限制，可以正常显示</li>
              <li>✅ 适合复杂布局和嵌套结构</li>
              <li>❌ 需要绝对定位计算，稍微复杂</li>
            </ul>
            <div>
              <strong>内联渲染:</strong>
            </div>
            <ul style={{ margin: '8px 0 0 20px' }}>
              <li>✅ 实现简单，样式继承更自然</li>
              <li>✅ 更好的封装性，便于测试</li>
              <li>✅ 适合简单布局和固定容器</li>
              <li>❌ 受父容器overflow影响，可能被裁剪</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>滚动位置同步</h2>
        <p>使用 scroll + requestAnimationFrame 实现高性能的位置跟随</p>
        <div className="demo-item">
          <label>滚动容器测试：</label>
          <div
            style={{
              height: '300px',
              overflow: 'auto',
              border: '2px solid #1890ff',
              borderRadius: '6px',
              padding: '20px',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
          >
            {/* 创建足够的内容让容器可滚动 */}
            <div
              style={{
                height: '150px',
                background: 'rgba(24, 144, 255, 0.1)',
                marginBottom: '20px',
                padding: '20px',
                borderRadius: '6px',
                border: '1px dashed #1890ff',
              }}
            >
              <h4 style={{ margin: '0 0 10px', color: '#1890ff' }}>📋 测试步骤</h4>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                1. 点击下方的 TreeSelect 打开下拉菜单
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>2. 保持下拉菜单打开状态</p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                3. 滚动此容器，观察下拉菜单位置变化
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#52c41a' }}>
                ✨ 下拉菜单会实时跟随输入框位置！
              </p>
            </div>

            <TreeSelect
              data={departmentData}
              multiple
              placeholder="🎯 打开我，然后滚动试试"
              style={{ width: 320, marginBottom: '20px' }}
              renderInline={false} // 使用Portal渲染测试
            />

            <div
              style={{
                height: '200px',
                background: 'rgba(82, 196, 26, 0.1)',
                padding: '20px',
                borderRadius: '6px',
                border: '1px dashed #52c41a',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ margin: '0 0 10px', color: '#52c41a' }}>⚡ 性能优势</h4>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • scroll 事件 + requestAnimationFrame 优化
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>• capture: true 捕获所有层级滚动</p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>• 防抖机制避免重复渲染</p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • 实时 getBoundingClientRect() 精确定位
              </p>
            </div>

            <div
              style={{
                height: '150px',
                background: 'rgba(250, 173, 20, 0.1)',
                padding: '20px',
                borderRadius: '6px',
                border: '1px dashed #faad14',
              }}
            >
              <h4 style={{ margin: '0 0 10px', color: '#faad14' }}>🔧 技术细节</h4>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>• passive: true 不阻塞滚动性能</p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                • requestAnimationFrame 同步浏览器刷新率
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>• 自动取消重复的位置计算请求</p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>确认模式</h2>
        <p>开启确认模式后，多选时需要点击确定按钮才生效，支持取消操作</p>
        <div className="demo-item">
          <label>基础确认模式：</label>
          <TreeSelect
            data={departmentData}
            multiple
            confirmSelect={true}
            placeholder="选择部门（需要确认）"
            style={{ width: 350 }}
            onChange={(value, nodes) => {
              console.log('确认选择:', { value, nodes })
            }}
          />
        </div>
        <div className="demo-item">
          <label>对比普通模式：</label>
          <TreeSelect
            data={departmentData}
            multiple
            confirmSelect={false}
            placeholder="选择部门（无需确认）"
            style={{ width: 350 }}
            onChange={(value, nodes) => {
              console.log('直接选择:', { value, nodes })
            }}
          />
        </div>
        <div className="demo-item">
          <label>确认模式说明：</label>
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '6px',
              padding: '16px',
              color: '#0369a1',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>✨ 确认模式特性：</div>
            <div>
              • 📋 <strong>使用TreeList组件</strong>：下拉内容由TreeList渲染，性能更优
            </div>
            <div>
              • ✅ <strong>确认机制</strong>：选择后需点击"确定"按钮才生效
            </div>
            <div>
              • ❌ <strong>取消操作</strong>：点击"取消"按钮恢复到之前的选择状态
            </div>
            <div>
              • 🔄 <strong>临时状态</strong>：选择过程中不触发onChange，仅在确认时触发
            </div>
            <div>
              • 🎯 <strong>适用场景</strong>：重要选择、批量操作、需要二次确认的场景
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>回调事件</h2>
        <p>多选模式下的各种事件回调</p>
        <div className="demo-item">
          <label>监听事件：</label>
          <TreeSelect
            data={departmentData}
            multiple
            placeholder="查看控制台日志"
            style={{ width: 400 }}
            onChange={(value, nodes) => {
              console.log('onChange:', { value, nodes })
            }}
            onDropdownVisibleChange={(visible) => {
              console.log('onDropdownVisibleChange:', visible)
            }}
            onFocus={() => {
              console.log('onFocus')
            }}
            onBlur={() => {
              console.log('onBlur')
            }}
          />
        </div>
      </div>
    </div>
  )
}
