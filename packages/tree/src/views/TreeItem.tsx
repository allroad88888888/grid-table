import type { CSSProperties } from 'react'
import { memo } from 'react'
import { useItem } from '../hooks/useItem'
import clsx from 'clsx'
import './TreeItem.css'

interface ItemProps {
  index: number
  style: CSSProperties
}

function TreeItem(props: ItemProps) {
  const { index, style } = props

  const {
    id,
    ItemTag,
    isCollapse,
    level,
    levelSize,
    ContentComponent,
    itemClassName,
    onExpandOrCollapseClick: onArrowClick,
  } = useItem(index)

  return (
    <ItemTag style={style} className={itemClassName}>
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
            onArrowClick(id)
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

      <ContentComponent id={id} />
    </ItemTag>
  )
}

export default memo(TreeItem)
