import React, { useCallback, useRef, useState, useEffect } from 'react'

type ResizableContainerProps = {
  children: React.ReactNode
  initialWidth?: number
  initialHeight?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  className?: string
  style?: React.CSSProperties
}

type ResizeDirection = 'se' | 'e' | 's' | 'sw' | 'ne' | 'nw' | 'n' | 'w'

export function ResizableContainer({
  children,
  initialWidth = 800,
  initialHeight = 400,
  minWidth = 200,
  minHeight = 150,
  maxWidth = window.innerWidth - 50,
  maxHeight = window.innerHeight - 50,
  className = '',
  style = {},
}: ResizableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  })

  const [resizeState, setResizeState] = useState({
    isResizing: false,
    direction: null as ResizeDirection | null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  })

  // 计算新的尺寸
  const calculateNewDimensions = useCallback(
    (clientX: number, clientY: number, direction: ResizeDirection) => {
      const deltaX = clientX - resizeState.startX
      const deltaY = clientY - resizeState.startY

      let newWidth = resizeState.startWidth
      let newHeight = resizeState.startHeight

      switch (direction) {
        case 'se': // 右下角
          newWidth = resizeState.startWidth + deltaX
          newHeight = resizeState.startHeight + deltaY
          break
        case 'e': // 右边
          newWidth = resizeState.startWidth + deltaX
          break
        case 's': // 下边
          newHeight = resizeState.startHeight + deltaY
          break
        case 'sw': // 左下角
          newWidth = resizeState.startWidth - deltaX
          newHeight = resizeState.startHeight + deltaY
          break
        case 'ne': // 右上角
          newWidth = resizeState.startWidth + deltaX
          newHeight = resizeState.startHeight - deltaY
          break
        case 'nw': // 左上角
          newWidth = resizeState.startWidth - deltaX
          newHeight = resizeState.startHeight - deltaY
          break
        case 'n': // 上边
          newHeight = resizeState.startHeight - deltaY
          break
        case 'w': // 左边
          newWidth = resizeState.startWidth - deltaX
          break
      }

      // 限制最小和最大尺寸
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))

      return { width: newWidth, height: newHeight }
    },
    [resizeState, minWidth, minHeight, maxWidth, maxHeight],
  )

  // 开始拖拽
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      e.preventDefault()
      e.stopPropagation()

      setResizeState({
        isResizing: true,
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: dimensions.width,
        startHeight: dimensions.height,
      })
    },
    [dimensions],
  )

  // 拖拽过程中
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizeState.isResizing || !resizeState.direction) return

      const newDimensions = calculateNewDimensions(e.clientX, e.clientY, resizeState.direction)
      setDimensions(newDimensions)
    },
    [resizeState, calculateNewDimensions],
  )

  // 结束拖拽
  const handleMouseUp = useCallback(() => {
    setResizeState((prev) => ({
      ...prev,
      isResizing: false,
      direction: null,
    }))
  }, [])

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
      // 防止文本选择
      document.body.style.userSelect = 'none'
      document.body.style.cursor = getCursor(resizeState.direction)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }
    }
    return
  }, [resizeState.isResizing, handleMouseMove, handleMouseUp, resizeState.direction])

  // 获取光标样式
  const getCursor = (direction: ResizeDirection | null) => {
    switch (direction) {
      case 'se':
        return 'nw-resize'
      case 'sw':
        return 'ne-resize'
      case 'ne':
        return 'sw-resize'
      case 'nw':
        return 'se-resize'
      case 'n':
      case 's':
        return 'ns-resize'
      case 'e':
      case 'w':
        return 'ew-resize'
      default:
        return 'default'
    }
  }

  // 拖拽手柄组件
  const ResizeHandle = ({ direction }: { direction: ResizeDirection }) => {
    const getHandleStyle = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        position: 'absolute',
        backgroundColor: 'transparent',
        cursor: getCursor(direction),
        zIndex: 10,
      }

      switch (direction) {
        case 'se':
          return {
            ...base,
            bottom: -5,
            right: -5,
            width: 10,
            height: 10,
            cursor: 'nw-resize',
          }
        case 'e':
          return {
            ...base,
            top: 0,
            right: -5,
            width: 10,
            height: '100%',
            cursor: 'ew-resize',
          }
        case 's':
          return {
            ...base,
            bottom: -5,
            left: 0,
            width: '100%',
            height: 10,
            cursor: 'ns-resize',
          }
        case 'sw':
          return {
            ...base,
            bottom: -5,
            left: -5,
            width: 10,
            height: 10,
            cursor: 'ne-resize',
          }
        case 'ne':
          return {
            ...base,
            top: -5,
            right: -5,
            width: 10,
            height: 10,
            cursor: 'sw-resize',
          }
        case 'nw':
          return {
            ...base,
            top: -5,
            left: -5,
            width: 10,
            height: 10,
            cursor: 'se-resize',
          }
        case 'n':
          return {
            ...base,
            top: -5,
            left: 0,
            width: '100%',
            height: 10,
            cursor: 'ns-resize',
          }
        case 'w':
          return {
            ...base,
            top: 0,
            left: -5,
            width: 10,
            height: '100%',
            cursor: 'ew-resize',
          }
        default:
          return base
      }
    }

    return <div style={getHandleStyle()} onMouseDown={(e) => handleMouseDown(e, direction)} />
  }

  return (
    <div
      ref={containerRef}
      className={`resizable-container ${className}`}
      style={{
        position: 'relative',
        width: dimensions.width,
        height: dimensions.height,
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}

      {/* 拖拽手柄 */}
      <ResizeHandle direction="se" />
      <ResizeHandle direction="e" />
      <ResizeHandle direction="s" />
      <ResizeHandle direction="sw" />
      <ResizeHandle direction="ne" />
      <ResizeHandle direction="nw" />
      <ResizeHandle direction="n" />
      <ResizeHandle direction="w" />

      {/* 可视化指示器 - 仅在拖拽时显示 */}
      {resizeState.isResizing && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          {dimensions.width} × {dimensions.height}
        </div>
      )}
    </div>
  )
}
