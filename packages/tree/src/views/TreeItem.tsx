import type { CSSProperties } from 'react'
import { memo } from 'react'
import type { Id } from '../types'
import { useItem } from '../hooks/useItem'
import clsx from 'clsx'
import './TreeItem.css'

interface ItemProps {
  index: number
  style: CSSProperties
}

function TreeItem(props: ItemProps) {
  const { index, style } = props

  const { id, ItemTag, arrow, level, levelSize, Component, itemClassName, onArrowClick } =
    useItem(index)

  return (
    <ItemTag style={style} className={itemClassName}>
      {/* 层级空 */}
      <span
        style={{
          width: level * levelSize,
          display: 'inline-block',
        }}
      ></span>
      {arrow !== undefined ? (
        <span
          className="grid-tree-arrow"
          onClick={() => {
            onArrowClick(id)
          }}
        >
          <i
            className={clsx({
              'grid-tree-arrow-expand': arrow === false,
              'grid-tree-arrow-collapse': arrow,
            })}
          ></i>
        </span>
      ) : null}

      <Component id={id} />
    </ItemTag>
  )
}

export function DemoItemComponent({ id }: { id: Id }) {
  return <>{id}</>
}

export default memo(TreeItem)
