import GridTree from '@grid-tree/core/src'
import mock from './mock'
import './Tree.css'
import TreeItem from './TreeItem'

const stayIds = ['ROOT', 'AC']

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
      stayIds={stayIds}
      showRoot
      ItemComponent={TreeItem}
    />
  )
}
