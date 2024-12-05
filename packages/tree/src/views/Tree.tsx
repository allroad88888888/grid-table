import { VGridList } from '@grid-table/core'
import type { GridTreeProps } from '../types'
import { useCallback, useEffect } from 'react'
import TreeItem from './TreeItem'
import { GridTreeProvider, iniAtom, showIdsAtom } from './../state'
import { useStore } from '../hooks'
import { useAtomValue, useSetAtom } from 'einfach-state'
import { viewOptionAtom } from './state'
import { easyMergeOptions } from '../utils/easyMergeOptions'
import { useStayIndexList } from '../hooks/useStayIndexList'

function GridTree(props: GridTreeProps) {
  const { store } = useStore()

  const setViewOptions = useSetAtom(viewOptionAtom, { store })

  useEffect(() => {
    setViewOptions((viewOption) => {
      return easyMergeOptions(viewOption, {
        levelSize: props.levelSize,
        itemTag: props.itemTag,
        ContentComponent: props.ContentComponent,
        itemClassName: props.itemClassName,
      })
    })
  }, [props.levelSize, props.itemTag, props.ContentComponent, props.itemClassName, setViewOptions])

  const { size = 36 } = props

  const calcItemSize = useCallback(() => {
    return size
  }, [size])

  const init = useSetAtom(iniAtom, { store })
  useEffect(() => {
    init(props.relation, {
      root: props.root,
      expendLevel: props.expendLevel,
      minLengthExpandAll: props.minLengthExpandAll,
      showRoot: props.showRoot,
    })
  }, [
    init,
    props.expendLevel,
    props.minLengthExpandAll,
    props.relation,
    props.root,
    props.showRoot,
  ])

  const showIds = useAtomValue(showIdsAtom, { store })

  const Item = props.ItemComponent || TreeItem

  const stayIndexList = useStayIndexList(showIds, props.stayIds)

  return (
    <VGridList
      baseSize={size}
      calcItemSize={calcItemSize}
      itemCount={showIds.length}
      className={props.className}
      style={props.style}
      tag={props.tag || 'ul'}
      overscanCount={props.overscanCount}
      stayIndexList={stayIndexList}
    >
      {Item}
    </VGridList>
  )
}

export default (props: GridTreeProps) => {
  return (
    <GridTreeProvider>
      <GridTree {...props} />
    </GridTreeProvider>
  )
}
