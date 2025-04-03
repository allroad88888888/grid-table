export interface ItemsRenderedProps {
    overscanStartIndex: number
    overscanStopIndex: number
}

export interface UseVScrollProps {
    height: number
    width: number
    calcItemSize: (index: number) => number
    itemCount: number
    overscanCount?: number
    direction?: 'row' | 'column'
    onItemsRendered?: (param: ItemsRenderedProps) => any
    stayIndexList?: number[]
    /**
     * 首次加载好之后，间隔1s 会把overCount自增一倍，提供更好的滚动体验
     * @default 1000ms
     */
    overCountIncrementTime?: number
} 