import GridTree from '@grid-tree/core/src'
import './Tree.css'
import TreeItem from './TreeItem'
import { useAtomValue } from '@einfach/react'
import { relationAsyncAtom } from './atoms'

const stayIds = ['_ROOT']

export function TreeDemo() {
  const relation = useAtomValue(relationAsyncAtom)
  return (
    <GridTree
      relation={relation}
      className="grid-tree-container"
      itemClassName="grid-tree-item"
      style={{
        width: 300,
        height: 400,
        border: '1px solid red',
        overflow: 'auto',
      }}
      stayIds={stayIds}
      showRoot
      root="_ROOT"
      ItemComponent={TreeItem}
      expendLevel={1}
      minLengthExpandAll={20}
    />
  )
}
