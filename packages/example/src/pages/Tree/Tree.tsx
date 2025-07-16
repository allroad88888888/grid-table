import GridTree, { GridTreeRef } from '@grid-tree/core/src'
import './Tree.css'
import TreeItem from './TreeItem'
import { useAtomValue } from '@einfach/react'
import { relationAsyncAtom } from './atoms'
import { useState, useRef } from 'react'

const stayIds = ['_ROOT']

export function TreeDemo() {
  const relation = useAtomValue(relationAsyncAtom)
  const treeRef = useRef<GridTreeRef>(null)

  const [size, setSize] = useState(22)

  const handleScrollToACBA = (
    logicalPosition: 'start' | 'center' | 'end' | 'nearest' = 'start',
  ) => {
    treeRef.current?.scrollTo('ACBA', {
      behavior: 'smooth',
      logicalPosition,
    })
  }

  return (
    <>
      <button
        onClick={() => {
          setSize(48)
        }}
      >
        chang size
      </button>
      <button onClick={() => handleScrollToACBA('start')} style={{ marginLeft: '10px' }}>
        滚动到 ACBA (start)
      </button>
      <button onClick={() => handleScrollToACBA('center')} style={{ marginLeft: '10px' }}>
        滚动到 ACBA (center)
      </button>
      <button onClick={() => handleScrollToACBA('end')} style={{ marginLeft: '10px' }}>
        滚动到 ACBA (end)
      </button>
      <button onClick={() => handleScrollToACBA('nearest')} style={{ marginLeft: '10px' }}>
        滚动到 ACBA (nearest)
      </button>
      <GridTree
        ref={treeRef}
        relation={relation}
        className="grid-tree-container"
        itemClassName="grid-tree-item"
        style={{
          width: 300,
          height: 400,
          border: '1px solid red',
          overflow: 'auto',
        }}
        size={size}
        stayIds={stayIds}
        showRoot
        root="_ROOT"
        ItemComponent={TreeItem}
        expendLevel={1}
        minLengthExpandAll={20}
      />
    </>
  )
}
