import { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import type { DropdownProps } from './types'

export function Dropdown({
  visible,
  onVisibleChange,
  children,
  overlay,
  className,
  style,
  getPopupContainer,
  dropdownRef,
  renderInline = false,
}: DropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })

  // 计算下拉位置
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || renderInline) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    setPosition({
      top: triggerRect.bottom + scrollTop,
      left: triggerRect.left + scrollLeft,
      width: triggerRect.width,
    })
  }, [renderInline])

  // 使用 scroll + requestAnimationFrame 监听位置变化
  useEffect(() => {
    if (!visible || renderInline) return

    // 初始位置计算
    updatePosition()

    let rafId: number | null = null

    // 优化的滚动处理函数
    const handleScroll = () => {
      // 取消之前的 requestAnimationFrame
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }

      // 在下一帧更新位置
      rafId = requestAnimationFrame(() => {
        updatePosition()
        rafId = null
      })
    }

    // 监听全局滚动事件（capture=true 确保能捕获所有层级的滚动）
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [visible, renderInline, updatePosition])

  // 获取容器
  const getContainer = () => {
    if (getPopupContainer) {
      return getPopupContainer()
    }
    return document.body
  }

  // Portal模式下的下拉菜单
  const portalDropdownElement =
    visible && !renderInline ? (
      <div
        ref={dropdownRef}
        className={clsx('tree-select-dropdown', className)}
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          minWidth: position.width,
          // zIndex: 1050,
          ...style,
        }}
      >
        {overlay}
      </div>
    ) : null

  // 内联模式下的下拉菜单
  const inlineDropdownElement =
    visible && renderInline ? (
      <div
        ref={dropdownRef}
        className={clsx('tree-select-dropdown', 'tree-select-dropdown-inline', className)}
        style={{
          position: 'relative',
          width: '100%',
          ...style,
        }}
      >
        {overlay}
      </div>
    ) : null

  return (
    <div
      className={clsx('tree-select-dropdown-wrapper', {
        'tree-select-dropdown-wrapper-inline': renderInline,
      })}
    >
      <div
        ref={triggerRef}
        onClick={(e) => {
          // 只有点击触发器本身才切换状态，防止内部元素点击冒泡
          if (
            e.target === e.currentTarget ||
            (e.target as Element).closest('.tree-select-selector')
          ) {
            onVisibleChange(!visible)
          }
        }}
      >
        {children}
      </div>
      {/* 内联渲染 */}
      {inlineDropdownElement}
      {/* Portal渲染 */}
      {portalDropdownElement && createPortal(portalDropdownElement, getContainer())}
    </div>
  )
}
