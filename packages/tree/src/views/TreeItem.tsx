import type { CSSProperties } from 'react'
import { memo } from 'react'
import { useAtomValue, useSetAtom } from 'einfach-state'

import { useStore, useLevel, useIdByIndex, useArrowAtom } from '../hooks'
import { viewOptionAtom } from './state'
import type { Id } from '../types'
import { collapseNodeSetAtom } from '../state'

interface ItemProps {
  index: number
  style: CSSProperties
}

function TreeItem(props: ItemProps) {
  const { index, style } = props

  const { store } = useStore()
  const id = useIdByIndex(index)
  const level = useLevel({ id })

  const arrowAtom = useArrowAtom(id)
  const { levelSize, itemTag, Component, itemClassName } = useAtomValue(viewOptionAtom, { store })

  const arrow = useAtomValue(arrowAtom, { store })

  const setCollapseNodeSet = useSetAtom(collapseNodeSetAtom, { store })

  const ItemTag = itemTag

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
          style={{
            height: '100%',
            display: 'inline-block',
            padding: '4px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setCollapseNodeSet((prev) => {
              if (prev.has(id)) {
                prev.delete(id)
              } else {
                prev.add(id)
              }
              return new Set(prev)
            })
          }}
        >
          <i
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderLeft: '1px solid black',
              borderBottom: '1px solid black',
              transform: arrow ? 'rotate(-45deg)' : 'rotate(-135deg)',
            }}
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
