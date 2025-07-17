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

  const handleScroll = (
    top: number,
    rightLogicalPosition: 'start' | 'center' | 'end' | 'nearest' = 'start',
  ) => {
    treeRef.current?.scroll(undefined, top, {
      behavior: 'smooth',
      rightLogicalPosition,
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
      <br />
      <button onClick={() => handleScroll(100, 'start')} style={{ margin: '5px' }}>
        滚动到 100px (start)
      </button>
      <button onClick={() => handleScroll(200, 'center')} style={{ margin: '5px' }}>
        滚动到 200px (center)
      </button>
      <button onClick={() => handleScroll(300, 'end')} style={{ margin: '5px' }}>
        滚动到 300px (end)
      </button>
      <button onClick={() => handleScroll(150, 'nearest')} style={{ margin: '5px' }}>
        滚动到 150px (nearest)
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
