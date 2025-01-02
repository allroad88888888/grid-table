import { useExpandAll, useItem } from '@grid-tree/core/src/hooks'
import type { CSSProperties } from 'react'
import { memo } from 'react'
import clsx from 'clsx'
import { useCollapseAll } from './useCollapseAll'

interface ItemProps {
  index: number
  style: CSSProperties
  isPending?: boolean
}

function ExpandAll() {
  const expandAll = useExpandAll()
  const collapseAll = useCollapseAll()
  return (
    <div className="grid-tree-item-root-todo">
      <span onClick={collapseAll}>+</span>
      <span onClick={expandAll}>-</span>
    </div>
  )
}

// const

function TreeItem(props: ItemProps) {
  const { index, style, isPending } = props

  const { id, isCollapse, level, levelSize, onExpandOrCollapseClick } = useItem(index)

  if (isPending) {
    return (
      <li style={style} className={clsx('grid-tree-item')}>
        loading
      </li>
    )
  }

  return (
    <li
      style={style}
      className={clsx(
        {
          sticky: id === 'ROOT',
        },
        'grid-tree-item',
      )}
    >
      {/* 层级空 */}
      <span
        style={{
          width: level * levelSize,
          display: 'inline-block',
        }}
      ></span>
      {isCollapse !== undefined ? (
        <span
          className="grid-tree-arrow"
          onClick={() => {
            onExpandOrCollapseClick(id)
          }}
        >
          <i
            className={clsx({
              'grid-tree-arrow-expand': isCollapse === false,
              'grid-tree-arrow-collapse': isCollapse,
            })}
          ></i>
        </span>
      ) : null}
      {id}

      {id === 'ROOT' ? <ExpandAll /> : null}
    </li>
  )
}

export default memo(TreeItem)
