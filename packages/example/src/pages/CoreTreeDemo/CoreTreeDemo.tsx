import { useState, useRef } from 'react'
import { useAtomValue } from '@einfach/react'
import type { GridTreeRef } from '@grid-tree/core/src';
import GridTree from '@grid-tree/core/src'
import { relationAsyncAtom } from '../Tree/atoms'
import { BasicContent, RichContent } from './ContentComponent'
import './CoreTreeDemo.css'

const stayIds = ['_ROOT']

type ContentType = 'basic' | 'rich'

const contentComponents = {
  basic: BasicContent,
  rich: RichContent,
}

const contentLabels = {
  basic: '基础样式',
  rich: '丰富样式',
}

export function CoreTreeDemo() {
  const relation = useAtomValue(relationAsyncAtom)
  const treeRef = useRef<GridTreeRef>(null)

  const [contentType, setContentType] = useState<ContentType>('basic')
  const [itemSize, setItemSize] = useState(32)
  const [levelSize, setLevelSize] = useState(20)
  const [showRoot, setShowRoot] = useState(true)

  const ContentComponent = contentComponents[contentType]

  const handleScrollToNode = (nodeId: string, position: 'start' | 'center' | 'end' = 'center') => {
    treeRef.current?.scrollTo(nodeId, {
      behavior: 'smooth',
      logicalPosition: position,
    })
  }

  return (
    <div className="core-tree-demo">
      <div className="demo-header">
        <h2>@grid-tree/core 核心组件演示</h2>
        <p>
          这个页面展示了如何使用 @grid-tree/core 的核心 TreeItem 组件，通过 ContentComponent
          自定义内容渲染。
        </p>
      </div>

      <div className="demo-controls">
        <div className="control-group">
          <label>内容样式：</label>
          {Object.entries(contentLabels).map(([key, label]) => (
            <button
              key={key}
              className={`style-button ${contentType === key ? 'active' : ''}`}
              onClick={() => setContentType(key as ContentType)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="control-group">
          <label>行高：</label>
          <select value={itemSize} onChange={(e) => setItemSize(Number(e.target.value))}>
            <option value={24}>紧凑 (24px)</option>
            <option value={32}>标准 (32px)</option>
            <option value={40}>宽松 (40px)</option>
            <option value={48}>超宽松 (48px)</option>
          </select>
        </div>

        <div className="control-group">
          <label>层级缩进：</label>
          <select value={levelSize} onChange={(e) => setLevelSize(Number(e.target.value))}>
            <option value={16}>小 (16px)</option>
            <option value={20}>标准 (20px)</option>
            <option value={24}>大 (24px)</option>
            <option value={32}>超大 (32px)</option>
          </select>
        </div>

        <div className="control-group">
          <label>显示设置：</label>
          <button
            className={`toggle-button ${showRoot ? 'active' : ''}`}
            onClick={() => setShowRoot(!showRoot)}
          >
            {showRoot ? '隐藏根节点' : '显示根节点'}
          </button>
        </div>
      </div>

      <div className="demo-actions">
        <button onClick={() => handleScrollToNode('ACBA', 'start')}>滚动到 ACBA (顶部)</button>
        <button onClick={() => handleScrollToNode('ACBA', 'center')}>滚动到 ACBA (居中)</button>
        <button onClick={() => handleScrollToNode('ACBA', 'end')}>滚动到 ACBA (底部)</button>
      </div>

      <div className="demo-tree-container">
        <GridTree
          ref={treeRef}
          relation={relation}
          className="core-tree-container"
          itemClassName="core-tree-item"
          style={{
            width: '100%',
            height: 500,
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
          }}
          size={itemSize}
          levelSize={levelSize}
          stayIds={stayIds}
          showRoot={showRoot}
          root="_ROOT"
          ContentComponent={ContentComponent}
          expendLevel={3}
          minLengthExpandAll={20}
        />
      </div>

      <div className="demo-features">
        <h3>核心特性展示</h3>
        <ul>
          <li>✅ 使用 @grid-tree/core 的原生 TreeItem 组件</li>
          <li>✅ 通过 ContentComponent 自定义内容渲染</li>
          <li>✅ 支持 CSS 变量主题定制</li>
          <li>✅ 响应式设计和现代化交互</li>
          <li>✅ 高性能虚拟滚动</li>
          <li>✅ 灵活的样式配置和根节点显示控制</li>
          <li>✅ 基础样式和丰富样式两种展示模式</li>
        </ul>
      </div>
    </div>
  )
}
