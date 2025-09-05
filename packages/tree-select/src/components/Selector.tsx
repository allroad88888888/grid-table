import { type CSSProperties, type ReactNode, useRef, useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'
import type { TreeNode } from '../types'
import { calculateAdaptiveTagsWithDOM, type AdaptiveTagsConfig } from '../utils'

/**
 * 选择器组件属性
 */
export interface SelectorProps {
  /** 显示标签 */
  displayLabel: string
  /** 占位符 */
  placeholder: string
  /** 是否禁用 */
  disabled: boolean
  /** 是否只读 */
  readonly: boolean
  /** 是否显示下拉框 */
  visible: boolean
  /** 是否允许清除 */
  allowClear: boolean
  /** 是否多选 */
  multiple?: boolean
  /** 选中的节点（多选时使用） */
  selectedNodes?: TreeNode[]
  /** 最大标签显示数量 */
  maxTagCount?: number
  /** 是否自动计算最大标签数量 */
  autoMaxTagCount?: boolean
  /** 尺寸 */
  size: 'small' | 'middle' | 'large'
  /** 样式 */
  style?: CSSProperties
  /** 后缀图标 */
  suffixIcon?: ReactNode
  /** 清除图标 */
  clearIcon?: ReactNode
  /** 焦点事件 */
  onFocus?: () => void
  /** 失焦事件 */
  onBlur?: () => void
  /** 清除事件 */
  onClear: () => void
  /** 标签移除事件（多选时使用） */
  onTagRemove?: (nodeId: string) => void
}

/**
 * 选择器组件
 * 负责渲染输入框选择器的外观和交互
 */
export function Selector({
  displayLabel,
  placeholder,
  disabled,
  readonly,
  visible,
  allowClear,
  multiple = false,
  selectedNodes = [],
  maxTagCount = 3,
  autoMaxTagCount = false,
  size,
  style,
  suffixIcon,
  clearIcon,
  onFocus,
  onBlur,
  onClear,
  onTagRemove,
}: SelectorProps) {
  const isEmpty = multiple ? selectedNodes.length === 0 : !displayLabel
  const containerRef = useRef<HTMLDivElement>(null)
  const [calculatedMaxTagCount, setCalculatedMaxTagCount] = useState<number>(maxTagCount)

  // 自适应计算最大标签数量
  const calculateAdaptiveTagCount = useCallback(() => {
    if (!autoMaxTagCount || !multiple || !containerRef.current || selectedNodes.length === 0) {
      return
    }

    const config: Partial<AdaptiveTagsConfig> = {
      reservedWidth: 60, // 为清除按钮和下拉箭头预留空间
      minTagCount: 1,
      maxTagCount: Math.min(maxTagCount, selectedNodes.length),
    }

    try {
      const result = calculateAdaptiveTagsWithDOM(selectedNodes, containerRef.current, config)
      setCalculatedMaxTagCount(result.visibleTagCount)
    } catch (error) {
      console.warn('Failed to calculate adaptive tag count, using default maxTagCount:', error)
      setCalculatedMaxTagCount(maxTagCount)
    }
  }, [autoMaxTagCount, multiple, selectedNodes, maxTagCount])

  // 使用 ResizeObserver 监听容器大小变化
  useEffect(() => {
    if (!autoMaxTagCount || !containerRef.current) {
      setCalculatedMaxTagCount(maxTagCount)
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      calculateAdaptiveTagCount()
    })

    resizeObserver.observe(containerRef.current)

    // 初始计算
    calculateAdaptiveTagCount()

    return () => {
      resizeObserver.disconnect()
    }
  }, [calculateAdaptiveTagCount, autoMaxTagCount, maxTagCount])

  // 当选中节点变化时重新计算
  useEffect(() => {
    if (autoMaxTagCount) {
      calculateAdaptiveTagCount()
    }
  }, [selectedNodes, calculateAdaptiveTagCount, autoMaxTagCount])

  // 决定实际使用的最大标签数量
  const effectiveMaxTagCount = autoMaxTagCount ? calculatedMaxTagCount : maxTagCount

  return (
    <div
      ref={containerRef}
      className={clsx('tree-select-selector', {
        'tree-select-selector-disabled': disabled,
        'tree-select-selector-readonly': readonly,
        'tree-select-selector-focused': visible,
        [`tree-select-selector-${size}`]: size,
      })}
      style={style}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={disabled ? -1 : 0}
    >
      <div className="tree-select-selection">
        {multiple ? (
          <div className="tree-select-selection-multiple">
            {selectedNodes.slice(0, effectiveMaxTagCount).map((node) => (
              <span
                key={node.id}
                className={clsx('tree-select-tag', {
                  'tree-select-tag-disabled': disabled || readonly,
                })}
              >
                <span className="tree-select-tag-content">{node.label}</span>
                {!disabled && !readonly && onTagRemove && (
                  <span
                    className="tree-select-tag-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTagRemove(node.id)
                    }}
                  >
                    ×
                  </span>
                )}
              </span>
            ))}
            {selectedNodes.length > effectiveMaxTagCount && (
              <span className="tree-select-tag tree-select-tag-more">
                +{selectedNodes.length - effectiveMaxTagCount}
              </span>
            )}
            {isEmpty && <span className="tree-select-selection-placeholder">{placeholder}</span>}
          </div>
        ) : (
          <div
            className={clsx('tree-select-selection-content', {
              placeholder: isEmpty,
              selected: !isEmpty,
            })}
          >
            {isEmpty ? placeholder : displayLabel}
          </div>
        )}
      </div>

      <div className="tree-select-arrow">
        {allowClear && !isEmpty && !disabled && !readonly ? (
          <span
            className="tree-select-clear"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
          >
            {clearIcon || '✕'}
          </span>
        ) : (
          <span
            className={clsx('tree-select-suffix', {
              'tree-select-suffix-open': visible,
            })}
          >
            {suffixIcon || '▼'}
          </span>
        )}
      </div>
    </div>
  )
}
