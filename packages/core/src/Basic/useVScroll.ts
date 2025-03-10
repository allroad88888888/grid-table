import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Options } from './option'
import { useDoRender } from '../utils/useDoRender'
import type { UseVScrollProps } from './type'
import { useTransition } from './useTransition'

export function useVScroll(props: UseVScrollProps) {
  const { itemCount, overscanCount = 10, calcItemSize, onItemsRendered, direction = 'row' } = props

  const length = direction === 'row' ? props.height : props.width

  const [isPending, startTransition] = useTransition()

  const { stateProp } = Options[direction]

  const [realOverCount, setRealOverCount] = useState(overscanCount)

  const doRender = useDoRender()
  const { current: stateCurrent } = useRef({
    stateScrollTop: 0,
    stateScrollLeft: 0,
  })

  const { totalLength, sizeList } = useMemo(() => {
    const tempListSize = [0]
    let tempTotalHeight = 0
    for (let i = 0; i < itemCount; i += 1) {
      const tempCurrentHeight = calcItemSize(i)
      tempTotalHeight += tempCurrentHeight
      tempListSize.push(tempTotalHeight)
    }

    return {
      totalLength: tempTotalHeight,
      sizeList: tempListSize,
    }
  }, [itemCount, calcItemSize])
  const { startIndex, endIndex } = useMemo(() => {
    if (!itemCount || length === 0) {
      return {
        topLength: 0,
        bottomLength: totalLength,
        startIndex: -1,
        endIndex: -1,
      }
    }
    const visibleStartIndex = sizeList.findIndex((index) => {
      return index >= stateCurrent[stateProp]
    })

    let visibleEndIndex: number
    if (stateCurrent[stateProp] + length >= totalLength) {
      visibleEndIndex = sizeList.length
    } else {
      visibleEndIndex =
        sizeList.slice(visibleStartIndex).findIndex((index) => {
          return index >= stateCurrent[stateProp] + length
        }) + visibleStartIndex
    }

    const res = {
      startIndex: Math.max(0, visibleStartIndex - realOverCount),
      endIndex: Math.min(itemCount, visibleEndIndex + realOverCount),
    }
    return res
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCurrent[stateProp], itemCount, length, realOverCount, calcItemSize])

  useEffect(() => {
    if (onItemsRendered && startIndex >= 0) {
      onItemsRendered({
        overscanStartIndex: startIndex,
        overscanStopIndex: endIndex,
      })
    }
  })

  useEffect(() => {
    setTimeout(() => {
      setRealOverCount(overscanCount * 2)
    }, props.overCountIncrementTime || 1000)
  }, [])

  const tickingRef = useRef(false)

  const scrollHandler = useCallback(() => {
    tickingRef.current = false

    startTransition(doRender)
  }, [])
  const onScroll = useCallback((event: Event) => {
    const { scrollTop, scrollLeft } = event.currentTarget as Element
    stateCurrent.stateScrollTop = Math.max(scrollTop, 0)
    stateCurrent.stateScrollLeft = Math.max(scrollLeft, 0)
    if (tickingRef.current === false) {
      requestAnimationFrame(scrollHandler)
      tickingRef.current = true
    }
  }, [])

  const showIndexList = useMemo(() => {
    if (!props.stayIndexList) {
      return Array.from({ length: endIndex - startIndex }, (_, index) => startIndex + index)
    }
    const indexList = new Set(props.stayIndexList)
    for (let index = startIndex; index < endIndex; index += 1) {
      indexList.add(index)
    }
    return Array.from(indexList)
  }, [endIndex, props.stayIndexList, startIndex])

  return {
    onScroll,
    totalLength,
    sizeList,
    startIndex,
    endIndex,
    showIndexList,
    isPending,
  }
}
