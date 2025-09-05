import { useState } from 'react'
import { useAtomValue } from '@einfach/react'
import GridTree from '@grid-tree/core/src'
import { relationAsyncAtom } from '../Tree/atoms'
import './SimpleTreeDemo.css'

export function SimpleTreeDemo() {
  const relation = useAtomValue(relationAsyncAtom)
  const [showRoot, setShowRoot] = useState(true)

  return (
    <div className="simple-tree-demo">
      <h2>简洁树形组件</h2>
      <p>@grid-tree/core 提供开箱即用的基础样式，支持 CSS 变量自定义。</p>

      <div className="simple-controls">
        <label>
          <input
            type="checkbox"
            checked={showRoot}
            onChange={(e) => setShowRoot(e.target.checked)}
          />
          显示根节点
        </label>
      </div>

      <div className="tree-container">
        <GridTree
          relation={relation}
          className="grid-tree-container"
          itemClassName="grid-tree-item"
          style={{
            width: '100%',
            height: 400,
          }}
          size={32}
          levelSize={20}
          showRoot={showRoot}
          root="_ROOT"
          expendLevel={2}
        />
      </div>
    </div>
  )
}
