import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Options } from './option'
import { useDoRender } from '../utils/useDoRender'
import type { UseVScrollProps } from './type'

export function useVScroll<T extends HTMLElement>(props: UseVScrollProps) {
  const { itemCount, overscanCount = 10, calcItemSize, onItemsRendered, direction = 'row' } = props

  const length = direction === 'row' ? props.height : props.width

  const { stateProp } = Options[direction]

  const doRender = useDoRender()
  const { current: stateCurrent } = useRef({
    stateScrollTop: 0,
    stateScrollLeft: 0,
  })

  const [overCount, setOverCount] = useState(4)

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
      startIndex: Math.max(0, visibleStartIndex - overCount),
      endIndex: Math.min(itemCount, visibleEndIndex + overCount),
    }
    return res
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCurrent[stateProp], itemCount, length, overCount, calcItemSize])

  useEffect(() => {
    if (onItemsRendered && startIndex >= 0) {
      onItemsRendered({
        overscanStartIndex: startIndex,
        overscanStopIndex: endIndex,
      })
    }
  })

  const onScroll = useCallback((event: React.UIEvent<T, UIEvent>) => {
    const { scrollTop, scrollLeft } = event.currentTarget
    stateCurrent.stateScrollTop = Math.max(scrollTop, 0)
    stateCurrent.stateScrollLeft = Math.max(scrollLeft, 0)
    doRender()
  }, [])

  useEffect(() => {
    const ct = setTimeout(() => {
      setOverCount(overscanCount)
    }, 1000)
    return () => {
      clearTimeout(ct)
    }
  }, [itemCount, overscanCount])

  const showIndexList = useMemo(() => {
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
  }
}
