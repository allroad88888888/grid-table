import { VGridList } from '@grid-table/core'
import type { GridTreeProps } from '../types'
import { useCallback, useEffect } from 'react'
import TreeItem from './TreeItem'
import { GridTreeProvider, iniAtom, showIdsAtom } from './../state'
import { useStore } from '../hooks'
import { useAtomValue, useSetAtom } from 'einfach-state'
import { viewOptionAtom } from './state'
import { easyMergeOptions } from '../utils/easyMergeOptions'

function GridTree(props: GridTreeProps) {
  const { store } = useStore()

  const setViewOptions = useSetAtom(viewOptionAtom, { store })

  useEffect(() => {
    setViewOptions((viewOption) => {
      return easyMergeOptions(viewOption, {
        levelSize: props.levelSize,
        itemTag: props.itemTag,
        Component: props.Component,
        itemClassName: props.itemClassName,
      })
    })
  }, [props.levelSize, props.itemTag, props.Component, props.itemClassName, setViewOptions])

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
    })
  }, [init, props.expendLevel, props.minLengthExpandAll, props.relation, props.root])

  const showIds = useAtomValue(showIdsAtom, { store })

  return (
    <VGridList
      baseSize={size}
      calcItemSize={calcItemSize}
      itemCount={showIds.length}
      className={props.className}
      style={props.style}
      tag={props.tag || 'ul'}
      overscanCount={props.overscanCount}
    >
      {TreeItem}
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
