import { useMemo, useCallback, useState, useEffect } from 'react'
import clsx from 'clsx'
import { Dropdown } from './Dropdown'
import { Selector, DropdownContent, DropdownFooter, SelectedPanel } from './components'
import { TreeList } from './TreeList'
import { convertRelationToNodes, convertNodesToRelation } from './utils'
import { useSelection } from './hooks/useSelection'
import { useDropdown } from './hooks/useDropdown'
import type { TreeSelectProps, TreeNode } from './types'
import './TreeSelect.css'

export function TreeSelect(props: TreeSelectProps) {
  const {
    data,
    relation,
    value,
    defaultValue,
    onChange,
    disabled = false,
    readonly = false,
    // loading = false,
    placeholder = '请选择...',
    allowClear = true,
    multiple = false,
    confirmSelect = false,
    showSelectedPanel = false,
    className,
    style,
    dropdownClassName,
    dropdownStyle,
    size = 'middle',
    dropdownMaxHeight = 300,
    maxTagCount = 3,
    autoMaxTagCount = false,
    renderInline = false,
    treeProps, // GridTree 统一配置
    onDropdownVisibleChange,
    onFocus,
    onBlur,
    suffixIcon,
    clearIcon,
    notFoundContent = '暂无数据',
    renderCheckbox,
    renderSelectedIcon,
    renderItem,
  } = props

  // 准备树形数据
  const treeNodes = useMemo(() => {
    if (data) {
      return data
    } else if (relation) {
      const root = treeProps?.root || '_ROOT'
      return convertRelationToNodes(relation, root)
    }
    return []
  }, [data, relation, treeProps?.root])

  // 构建节点映射
  const nodeMap = useMemo(() => {
    const map = new Map<string, TreeNode>()

    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        map.set(node.id, node)
        if (node.children) {
          traverse(node.children)
        }
      })
    }

    traverse(treeNodes)
    return map
  }, [treeNodes])

  // 转换为relation格式供GridTree使用
  const treeRelation = useMemo(() => {
    const showRoot = treeProps?.showRoot ?? false
    const root = treeProps?.root || '_ROOT'
    return convertNodesToRelation(treeNodes, showRoot, root)
  }, [treeNodes, treeProps?.showRoot, treeProps?.root])

  // 选择状态管理
  const { selectedValue, selectedNodes, handleSelect, handleClear, getDisplayLabel } = useSelection(
    treeNodes,
    {
      value,
      defaultValue,
      multiple,
      onChange,
    },
  )

  // 确认模式下的临时选中状态
  const [tempSelectedValue, setTempSelectedValue] = useState<string | string[]>(selectedValue)

  // 同步selectedValue到tempSelectedValue
  useEffect(() => {
    setTempSelectedValue(selectedValue)
  }, [selectedValue])

  // 下拉状态管理
  const { visible, handleToggle, handleClose, containerRef, dropdownRef } = useDropdown({
    disabled,
    readonly,
    onVisibleChange: onDropdownVisibleChange,
  })

  // 确认模式下的确认操作
  const handleConfirm = useCallback(() => {
    if (multiple && confirmSelect) {
      // 获取临时选中的节点
      const tempNodes = Array.isArray(tempSelectedValue)
        ? (tempSelectedValue.map((id) => nodeMap.get(id)).filter(Boolean) as TreeNode[])
        : tempSelectedValue
          ? ([nodeMap.get(tempSelectedValue)].filter(Boolean) as TreeNode[])
          : []

      // 触发onChange回调
      if (onChange) {
        onChange(tempSelectedValue, multiple ? tempNodes : tempNodes[0])
      }
    }
    handleClose()
  }, [tempSelectedValue, onChange, multiple, confirmSelect, nodeMap, handleClose])

  // 确认模式下的取消操作
  const handleCancel = useCallback(() => {
    // 重置临时选中状态为当前实际选中状态
    setTempSelectedValue(selectedValue)
    handleClose()
  }, [selectedValue, handleClose])

  // 处理节点选择
  const handleNodeSelect = useCallback(
    (id: string, node: TreeNode) => {
      if (multiple && confirmSelect) {
        // 确认模式下，只更新临时状态
        setTempSelectedValue((prev) => {
          if (Array.isArray(prev)) {
            const newValue = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            return newValue
          } else {
            return prev === id ? [] : [id]
          }
        })
      } else {
        // 非确认模式，直接选择
        handleSelect(id, node)
        if (!multiple) {
          handleClose() // 单选时选择后关闭下拉
        }
      }
    },
    [handleSelect, handleClose, multiple, confirmSelect],
  )

  // 处理标签移除（多选模式）
  const handleTagRemove = useCallback(
    (nodeId: string) => {
      const node = nodeMap.get(nodeId)
      if (node) {
        handleSelect(nodeId, node) // 在多选模式下，再次选择即为取消选择
      }
    },
    [nodeMap, handleSelect],
  )

  // 渲染选择器
  const renderSelector = () => {
    return (
      <Selector
        displayLabel={getDisplayLabel()}
        placeholder={placeholder}
        disabled={disabled}
        readonly={readonly}
        visible={visible}
        allowClear={allowClear}
        multiple={multiple}
        selectedNodes={selectedNodes}
        maxTagCount={maxTagCount}
        autoMaxTagCount={autoMaxTagCount}
        size={size}
        style={style}
        suffixIcon={suffixIcon}
        clearIcon={clearIcon}
        onFocus={onFocus}
        onBlur={onBlur}
        onClear={handleClear}
        onTagRemove={handleTagRemove}
      />
    )
  }

  // 渲染下拉内容
  const renderDropdown = () => {
    const currentSelectedValue = multiple && confirmSelect ? tempSelectedValue : selectedValue

    const treeContent =
      multiple && confirmSelect ? (
        // 确认模式使用TreeList + Footer
        <div className="tree-select-confirm-mode">
          <TreeList
            data={treeNodes}
            value={currentSelectedValue}
            onChange={(value) => {
              // 确认模式下更新临时状态
              setTempSelectedValue(value)
            }}
            multiple={multiple}
            maxHeight={dropdownMaxHeight}
            notFoundContent={notFoundContent}
            renderCheckbox={renderCheckbox}
            renderSelectedIcon={renderSelectedIcon}
            renderItem={renderItem}
            treeProps={treeProps}
          />
          <DropdownFooter onConfirm={handleConfirm} onCancel={handleCancel} />
        </div>
      ) : (
        // 非确认模式使用原有的DropdownContent
        <DropdownContent
          treeNodes={treeNodes}
          treeRelation={treeRelation}
          nodeMap={nodeMap}
          selectedValue={currentSelectedValue}
          multiple={multiple}
          dropdownMaxHeight={dropdownMaxHeight}
          notFoundContent={notFoundContent}
          onNodeSelect={handleNodeSelect}
          renderCheckbox={renderCheckbox}
          renderSelectedIcon={renderSelectedIcon}
          renderItem={renderItem}
          treeProps={treeProps}
        />
      )

    // 如果启用了已选面板，使用双栏布局
    if (showSelectedPanel && multiple) {
      return (
        <div className="tree-select-dual-panel">
          <div className="tree-select-dual-panel-left">{treeContent}</div>
          <SelectedPanel
            selectedNodes={selectedNodes}
            onRemove={handleTagRemove}
            onClear={handleClear}
          />
        </div>
      )
    }

    return treeContent
  }

  return (
    <div ref={containerRef} className={clsx('tree-select', className)}>
      <Dropdown
        visible={visible}
        onVisibleChange={handleToggle} // 修复点击控制
        className={dropdownClassName}
        style={dropdownStyle}
        overlay={renderDropdown()}
        dropdownRef={dropdownRef}
        renderInline={renderInline}
      >
        {renderSelector()}
      </Dropdown>
    </div>
  )
}
