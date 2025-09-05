import { useState, useCallback, useEffect, useRef } from 'react'
import type { UseDropdownReturn } from '../types'

interface UseDropdownOptions {
  defaultVisible?: boolean
  disabled?: boolean
  readonly?: boolean
  onVisibleChange?: (visible: boolean) => void
}

export function useDropdown(options: UseDropdownOptions = {}): UseDropdownReturn {
  const { defaultVisible = false, disabled = false, readonly = false, onVisibleChange } = options

  const [visible, setVisibleState] = useState(defaultVisible)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 设置显示状态
  const setVisible = useCallback(
    (newVisible: boolean) => {
      if (disabled || readonly) return

      setVisibleState(newVisible)
      onVisibleChange?.(newVisible)
    },
    [disabled, readonly, onVisibleChange],
  )

  // 切换显示状态
  const handleToggle = useCallback(() => {
    setVisible(!visible)
  }, [visible, setVisible])

  // 关闭下拉
  const handleClose = useCallback(() => {
    setVisible(false)
  }, [setVisible])

  // 监听外部点击事件
  useEffect(() => {
    if (!visible) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // 检查点击是否在 TreeSelect 容器内
      if (containerRef.current && containerRef.current.contains(target)) {
        return
      }

      // 检查点击是否在下拉框内（因为下拉框使用 createPortal 渲染到 body）
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return
      }

      // 只有点击在外部时才关闭
      handleClose()
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [visible, handleClose])

  return {
    visible,
    setVisible,
    handleToggle,
    handleClose,
    containerRef,
    dropdownRef,
  }
}
