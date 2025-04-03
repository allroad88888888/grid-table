/** @jsxImportSource solid-js */
import { createSignal, createEffect, createMemo, onCleanup } from 'solid-js'
import type { UseVScrollProps } from './type'

export function useVScroll(props: UseVScrollProps) {
    const { itemCount, overscanCount = 10, calcItemSize, onItemsRendered, direction = 'row' } = props

    const length = direction === 'row' ? props.height : props.width


    const [realOverCount, setRealOverCount] = createSignal(overscanCount)

    // 改为使用signal模式管理滚动状态
    const [scrollTop, setScrollTop] = createSignal(0)
    const [scrollLeft, setScrollLeft] = createSignal(0)


    const sizeAndTotal = createMemo(() => {
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
    })

    const indices = createMemo(() => {
        if (!itemCount || length === 0) {
            return {
                topLength: 0,
                bottomLength: sizeAndTotal().totalLength,
                startIndex: -1,
                endIndex: -1,
            }
        }

        const sizeList = sizeAndTotal().sizeList
        const totalLength = sizeAndTotal().totalLength

        // 使用signal值而不是直接访问stateCurrent对象
        const currentScroll = direction === 'row' ? scrollTop() : scrollLeft()

        const visibleStartIndex = sizeList.findIndex((index) => {
            return index >= currentScroll
        })

        let visibleEndIndex: number
        if (currentScroll + length >= totalLength) {
            visibleEndIndex = sizeList.length
        } else {
            visibleEndIndex =
                sizeList.slice(visibleStartIndex).findIndex((index) => {
                    return index >= currentScroll + length
                }) + visibleStartIndex
        }

        return {
            startIndex: Math.max(0, visibleStartIndex - realOverCount()),
            endIndex: Math.min(itemCount, visibleEndIndex + realOverCount()),
        }
    })

    createEffect(() => {
        const startIndex = indices().startIndex
        const endIndex = indices().endIndex

        if (onItemsRendered && startIndex >= 0) {
            onItemsRendered({
                overscanStartIndex: startIndex,
                overscanStopIndex: endIndex,
            })
        }
    })

    createEffect(() => {
        const timer = setTimeout(() => {
            setRealOverCount(overscanCount * 2)
        }, props.overCountIncrementTime || 1000)

        onCleanup(() => clearTimeout(timer))
    })

    // 使用requestAnimationFrame实现滚动节流
    let ticking = false
    let lastScrollTop = 0
    let lastScrollLeft = 0
    let rafId: number | null = null

    const onScroll = (event: Event) => {
        const { scrollTop: newScrollTop, scrollLeft: newScrollLeft } = event.currentTarget as Element

        // 存储最新的滚动位置
        lastScrollTop = Math.max(newScrollTop, 0)
        lastScrollLeft = Math.max(newScrollLeft, 0)

        // 如果当前没有等待执行的更新，则安排一个
        if (!ticking) {
            ticking = true

            rafId = requestAnimationFrame(() => {
                // 更新signal值 (仅在动画帧中更新，减少重渲染)
                setScrollTop(lastScrollTop)
                setScrollLeft(lastScrollLeft)

                // 重置标志，允许安排下一次更新
                ticking = false
            })
        }
    }

    // 在组件卸载时清理
    onCleanup(() => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId)
        }
    })

    const showIndexList = createMemo(() => {
        const startIndex = indices().startIndex
        const endIndex = indices().endIndex

        if (!props.stayIndexList) {
            return Array.from({ length: endIndex - startIndex }, (_, index) => startIndex + index)
        }
        const indexList = new Set(props.stayIndexList)
        for (let index = startIndex; index < endIndex; index += 1) {
            indexList.add(index)
        }
        return Array.from(indexList)
    })

    return {
        onScroll,
        totalLength: () => sizeAndTotal().totalLength,
        sizeList: () => sizeAndTotal().sizeList,
        startIndex: () => indices().startIndex,
        endIndex: () => indices().endIndex,
        showIndexList: () => showIndexList(),
    }
} 