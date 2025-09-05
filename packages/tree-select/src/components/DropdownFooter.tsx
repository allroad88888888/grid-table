import type { ReactNode } from 'react'

/**
 * 下拉框底部确认按钮组件属性
 */
export interface DropdownFooterProps {
  /** 是否显示footer */
  visible?: boolean
  /** 确定按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确定按钮点击回调 */
  onConfirm?: () => void
  /** 取消按钮点击回调 */
  onCancel?: () => void
  /** 自定义footer内容 */
  children?: ReactNode
}

/**
 * 下拉框底部确认按钮组件
 */
export function DropdownFooter({
  visible = true,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  children,
}: DropdownFooterProps) {
  if (!visible) return null

  if (children) {
    return <div className="tree-select-dropdown-footer">{children}</div>
  }

  return (
    <div className="tree-select-dropdown-footer">
      <div className="tree-select-dropdown-footer-buttons">
        <button
          type="button"
          className="tree-select-dropdown-footer-button tree-select-dropdown-footer-cancel"
          onClick={onCancel}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className="tree-select-dropdown-footer-button tree-select-dropdown-footer-confirm"
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  )
}
