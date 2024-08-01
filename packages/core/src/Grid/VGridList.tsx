import type { ReactNode } from 'react'
import { useRef } from 'react'
import type { ListProps } from './type'
import { useAutoSizer } from '../AutoSizer'
import { useVScroll } from '../Basic/useVScroll'

interface VGridListProps extends Omit<ListProps, 'width' | 'height'> {
  baseSize: number
}

export function VGridList(props: VGridListProps) {
  const { style, className } = props
  const { baseSize, children } = props

  const ref = useRef<HTMLDivElement>(null)

  const { width, height } = useAutoSizer(ref)

  const { onScroll, totalLength, sizeList, startIndex, endIndex } = useVScroll({
    width,
    height,
    ...props,
  })

  const Children = children

  const $items: ReactNode[] = []
  for (let index = startIndex; index < endIndex; index += 1) {
    $items.push(
      <Children
        key={index}
        index={index}
        style={{
          border: '1px solid red',
          gridColumnStart: 1,
          gridColumnEnd: 1,
          gridRowStart: sizeList[index] / baseSize + 1,
          gridRowEnd: sizeList[index + 1] / baseSize + 1,
        }}
      />,
    )
  }

  return (
    <div ref={ref} style={style} className={className} onScroll={onScroll}>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(auto-fill, ${baseSize}px)`,
          height: totalLength,
        }}
      >
        {$items}
      </div>
    </div>
  )
}
