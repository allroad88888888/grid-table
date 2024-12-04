import GridTree from '@grid-tree/core/src/Tree'
import mock from './mock'
import './Tree.css'

export function TreeDemo() {
  return (
    <GridTree
      relation={mock.relation}
      className="grid-tree-container"
      itemClassName="grid-tree-item"
      style={{
        width: 300,
        height: 400,
        border: '1px solid red',
        overflow: 'auto',
      }}
    />
  )
}
