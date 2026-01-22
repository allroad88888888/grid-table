import { useState } from 'react'
import { TreeSelect } from '@grid-tree/select'
import { relationAsyncAtom } from '../Tree/atoms'
import { useAtomValue } from '@einfach/react'
import './TreeSelectDemo.css'

// 标准树形数据格式示例
const standardTreeData = [
  {
    id: 'A',
    label: '节点A',
    children: [
      {
        id: 'AA',
        label: '节点AA',
      },
      {
        id: 'AB',
        label: '节点AB',
      },
      {
        id: 'AC',
        label: '节点AC',
        children: [
          {
            id: 'ACA',
            label: '节点ACA',
          },
          {
            id: 'ACB',
            label: '节点ACB',
            children: [
              {
                id: 'ACBA',
                label: '节点ACBA',
              },
            ],
          },
        ],
      },
      {
        id: 'AD',
        label: '节点AD',
        disabled: true, // 禁用节点示例
      },
    ],
  },
  {
    id: 'B',
    label: '节点B',
    children: [
      {
        id: 'BA',
        label: '节点BA',
      },
      {
        id: 'BB',
        label: '节点BB',
      },
    ],
  },
  {
    id: 'C',
    label: '节点C（无子节点）',
  },
]

export function TreeSelectDemo() {
  const relationData = useAtomValue(relationAsyncAtom)

  const [selectedValue1, setSelectedValue1] = useState<string>('')
  const [selectedValue2, setSelectedValue2] = useState<string>('')
  const [selectedValue3, setSelectedValue3] = useState<string>('')
  const [disabled, setDisabled] = useState(false)
  const [readonly, setReadonly] = useState(false)
  const [size, setSize] = useState<'small' | 'middle' | 'large'>('middle')

  return (
    <div className="tree-select-demo">
      <h2>TreeSelect 树形选择器演示</h2>
      <p>基于 @grid-tree/core 构建的树形选择器组件，支持单选模式和丰富的配置选项。</p>

      <div className="demo-section">
        <h3>基础使用</h3>
        <div className="demo-row">
          <div className="demo-item">
            <h4>标准树形数据</h4>
            <TreeSelect
              data={standardTreeData}
              value={selectedValue1}
              onChange={(value, node) => {
                setSelectedValue1(value as string)
                console.log('选中:', value, node)
              }}
              placeholder="请选择节点..."
              style={{ width: 200 }}
              allowClear
            />
            <p className="demo-result">选中值: {selectedValue1 || '未选择'}</p>
          </div>

          <div className="demo-item">
            <h4>Relation 数据格式</h4>
            <TreeSelect
              relation={relationData}
              value={selectedValue2}
              onChange={(value, node) => {
                setSelectedValue2(value as string)
                console.log('选中:', value, node)
              }}
              placeholder="请选择节点..."
              style={{ width: 200 }}
              treeProps={{
                showRoot: false,
                root: '_ROOT',
              }}
              allowClear
            />
            <p className="demo-result">选中值: {selectedValue2 || '未选择'}</p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h3>状态控制</h3>
        <div className="demo-controls">
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            禁用状态
          </label>
          <label>
            <input
              type="checkbox"
              checked={readonly}
              onChange={(e) => setReadonly(e.target.checked)}
            />
            只读状态
          </label>
          <label>
            尺寸:
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as 'small' | 'middle' | 'large')}
            >
              <option value="small">小</option>
              <option value="middle">中</option>
              <option value="large">大</option>
            </select>
          </label>
        </div>

        <div className="demo-item">
          <TreeSelect
            data={standardTreeData}
            value={selectedValue3}
            onChange={(value) => setSelectedValue3(value as string)}
            placeholder="状态演示..."
            style={{ width: 200 }}
            disabled={disabled}
            readonly={readonly}
            size={size}
            allowClear
          />
          <p className="demo-result">选中值: {selectedValue3 || '未选择'}</p>
        </div>
      </div>

      <div className="demo-section">
        <h3>自定义样式</h3>
        <div className="demo-row">
          <div className="demo-item">
            <h4>自定义主题</h4>
            <div className="custom-theme">
              <TreeSelect
                data={standardTreeData}
                placeholder="自定义主题..."
                style={{ width: 200 }}
                allowClear
              />
            </div>
          </div>

          <div className="demo-item">
            <h4>无边框样式</h4>
            <TreeSelect
              data={standardTreeData}
              placeholder="无边框样式..."
              style={{ width: 200 }}
              className="tree-select-borderless"
              allowClear
            />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h3>配置选项</h3>
        <div className="demo-row">
          <div className="demo-item">
            <h4>自定义下拉高度和展开层级</h4>
            <TreeSelect
              data={standardTreeData}
              placeholder="自定义配置..."
              style={{ width: 200 }}
              dropdownMaxHeight={200}
              treeProps={{
                expendLevel: 1,
                size: 28,
                levelSize: 16,
              }}
              allowClear
            />
          </div>

          <div className="demo-item">
            <h4>自动展开小型树（minLengthExpandAll）</h4>
            <TreeSelect
              data={standardTreeData}
              placeholder="少于10个节点时全部展开..."
              style={{ width: 200 }}
              treeProps={{
                minLengthExpandAll: 10,
              }}
              allowClear
            />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h3>GridTree 高级参数</h3>
        <div className="demo-row">
          <div className="demo-item">
            <h4>显示已选面板（showSelectedPanel）</h4>
            <TreeSelect
              data={standardTreeData}
              placeholder="选择项目..."
              style={{ width: 200 }}
              multiple
              showSelectedPanel
              dropdownMaxHeight={300}
              allowClear
            />
          </div>

          <div className="demo-item">
            <h4>使用 treeProps 统一配置</h4>
            <TreeSelect
              data={standardTreeData}
              placeholder="treeProps 方式..."
              style={{ width: 200 }}
              treeProps={{
                overscanCount: 5,
                minLengthExpandAll: 10,
                disabledIds: ['AB', 'BA'],
              }}
              allowClear
            />
          </div>
        </div>

        <div className="demo-row">
          <div className="demo-item">
            <h4>已选面板 + 确认模式</h4>
            <TreeSelect
              data={standardTreeData}
              placeholder="已选面板 + 确认..."
              style={{ width: 200 }}
              multiple
              confirmSelect
              showSelectedPanel
              dropdownMaxHeight={300}
              allowClear
            />
          </div>

          <div className="demo-item">
            <h4>禁用特定节点</h4>
            <TreeSelect
              data={standardTreeData}
              placeholder="禁用指定节点..."
              style={{ width: 200 }}
              treeProps={{
                disabledIds: ['AB', 'BA'],
              }}
              allowClear
            />
          </div>
        </div>

        <div className="demo-row">
          <div className="demo-item">
            <h4>自定义容器标签</h4>
            <TreeSelect
              data={standardTreeData}
              placeholder="使用 div 而非 ul..."
              style={{ width: 200 }}
              treeProps={{
                tag: 'div',
                itemTag: 'div',
              }}
              allowClear
            />
          </div>

          <div className="demo-item">
            <h4>固定显示的节点</h4>
            <TreeSelect
              data={standardTreeData}
              placeholder="固定节点..."
              style={{ width: 200 }}
              treeProps={{
                stayIds: ['A', 'B'],
              }}
              allowClear
            />
          </div>
        </div>
      </div>

      <div className="demo-features">
        <h3>功能特性</h3>
        <ul>
          <li>✅ 支持标准树形数据和 relation 数据格式</li>
          <li>✅ 单选模式，点击节点直接选择</li>
          <li>✅ 支持禁用和只读状态</li>
          <li>✅ 支持清空功能</li>
          <li>✅ 响应式设计，支持不同尺寸</li>
          <li>✅ 丰富的 CSS 变量支持主题定制</li>
          <li>✅ 基于 @grid-tree/core 的高性能渲染</li>
          <li>✅ 完整的 TypeScript 类型支持</li>
          <li>⭐ treeProps 统一配置，未来新参数自动支持</li>
          <li>🆕 已选面板（showSelectedPanel）- 类似穿梭框效果</li>
        </ul>
      </div>
    </div>
  )
}
