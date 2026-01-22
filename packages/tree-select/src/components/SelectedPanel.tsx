import { useCallback } from 'react'
import type { TreeNode } from '../types'
import './SelectedPanel.css'

export interface SelectedPanelProps {
  /** 已选中的节点列表 */
  selectedNodes: TreeNode[]
  /** 移除节点回调 */
  onRemove: (nodeId: string) => void
  /** 清空所有回调 */
  onClear: () => void
  /** 标题 */
  title?: string
  /** 空状态提示 */
  emptyText?: string
}

/**
 * 已选中项面板
 * 显示已选中的项目列表，支持单独移除和清空操作
 */
export function SelectedPanel({
  selectedNodes,
  onRemove,
  onClear,
  title = '已选',
  emptyText = '暂无选中项',
}: SelectedPanelProps) {
  const handleRemove = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation()
      onRemove(nodeId)
    },
    [onRemove],
  )

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onClear()
    },
    [onClear],
  )

  return (
    <div className="tree-select-selected-panel">
      <div className="tree-select-selected-panel-header">
        <span className="tree-select-selected-panel-title">
          {title}
          {selectedNodes.length > 0 && (
            <span className="tree-select-selected-panel-count">({selectedNodes.length})</span>
          )}
        </span>
        {selectedNodes.length > 0 && (
          <button type="button" className="tree-select-selected-panel-clear" onClick={handleClear}>
            清空
          </button>
        )}
      </div>
      <div className="tree-select-selected-panel-content">
        {selectedNodes.length === 0 ? (
          <div className="tree-select-selected-panel-empty">{emptyText}</div>
        ) : (
          <ul className="tree-select-selected-panel-list">
            {selectedNodes.map((node) => (
              <li key={node.id} className="tree-select-selected-panel-item">
                <span className="tree-select-selected-panel-item-label">{node.label}</span>
                <button
                  type="button"
                  className="tree-select-selected-panel-item-remove"
                  onClick={(e) => handleRemove(e, node.id)}
                  aria-label={`移除 ${node.label}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
