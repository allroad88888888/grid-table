import { addItemAtom, useExpandAll, useItem, useStore } from '@grid-tree/core/src'
import type { CSSProperties } from 'react'
import { Suspense } from 'react'
import clsx from 'clsx'
import { useCollapseAll } from './useCollapseAll'
import { useAtomValue, useSetAtom } from '@einfach/react'
import { getInfoAtomById } from './atoms'

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
  const { index, style } = props

  const { store } = useStore()

  const addItem = useSetAtom(addItemAtom, { store })
  const { id, isCollapse, level, levelSize, onExpandOrCollapseClick } = useItem(index)

  useAtomValue(getInfoAtomById(id))

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
      <button
        onClick={() => {
          addItem({
            id,
            newId: `${id}-1`,
            position: 'child-first',
          })
        }}
      >
        add
      </button>
      {id === 'ROOT' ? <ExpandAll /> : null}
    </li>
  )
}

export default (props: ItemProps) => {
  return (
    <Suspense
      fallback={
        <li style={props.style} className={clsx('grid-tree-item')}>
          loading
        </li>
      }
    >
      <TreeItem {...props} />
    </Suspense>
  )
}
