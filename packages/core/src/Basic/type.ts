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
}
