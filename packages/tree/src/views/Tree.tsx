import { VGridList, VGridListRef } from '@grid-table/core'
import type { GridTreeProps, GridTreeRef } from '../types'
import { forwardRef, useCallback, useEffect, useRef } from 'react'
import TreeItem from './TreeItem'
import { GridTreeProvider, iniAtom, showIdsAtom } from './../state'
import { useStore } from '../hooks'
import { useAtomValue, useSetAtom } from '@einfach/react'
import { viewOptionAtom } from './state'
import { easyMergeOptions } from '../utils/easyMergeOptions'
import { useStayIndexList } from '../hooks/useStayIndexList'
import { relationAtom } from '../state/state'
import { useCustomMenthods } from '../hooks/useCustomMenthods'

const GridTree = forwardRef<GridTreeRef, GridTreeProps>((props, ref) => {
  const { store } = useStore()

  const setRelation = useSetAtom(relationAtom, { store })
  useEffect(() => {
    setRelation(props.relation)
  }, [setRelation, props.relation])

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
    init({
      root: props.root,
      expendLevel: props.expendLevel,
      minLengthExpandAll: props.minLengthExpandAll,
      showRoot: props.showRoot,
    })
  }, [init, props.expendLevel, props.minLengthExpandAll, props.root, props.showRoot])

  const showIds = useAtomValue(showIdsAtom, { store })

  const Item = props.ItemComponent || TreeItem

  const stayIndexList = useStayIndexList(showIds, props.stayIds)

  const gridRef = useRef<VGridListRef>(null)
  useCustomMenthods(ref, gridRef)

  return (
    <VGridList
      ref={gridRef}
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
})

export default forwardRef<GridTreeRef, GridTreeProps>((props, ref) => {
  return (
    <GridTreeProvider store={props.store}>
      <GridTree {...props} ref={ref} />
    </GridTreeProvider>
  )
})
