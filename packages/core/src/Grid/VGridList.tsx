import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { ListProps, VGridListRef } from './type'
import { useAutoSizer } from '../AutoSizer'
import { useVScroll } from '../Basic/useVScroll'
import { useScrollTo1D } from './hooks/useScrollTo1D'

interface VGridListProps extends Omit<ListProps, 'width' | 'height'> {
  baseSize: number
  stayIndexList?: number[]
}

export const VGridList = forwardRef<VGridListRef, VGridListProps>((props, gridRef) => {
  const { style, className, tag = 'div', 'data-testid': dataTestId } = props
  const { baseSize, children } = props

  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useAutoSizer(ref)

  const { onScroll, totalLength, sizeList, showIndexList, isPending } = useVScroll({
    width,
    height,
    ...props,
  })
  const { scrollTo, scroll } = useScrollTo1D(ref, {
    containerHeight: height,
    sizeList,
  })

  useImperativeHandle(gridRef, () => {
    return {
      scrollTo,
      scroll,
    }
  })
  const Children = children

  useEffect(() => {
    if (!ref.current) {
      return
    }

    ref.current.addEventListener('scroll', onScroll, { passive: true })
  }, [])

  const Tag = tag

  return (
    <div
      ref={ref}
      style={{
        overflow: 'auto',
        willChange: 'scroll-position',
        contain: 'paint',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        overscrollBehavior: 'contain',
        ...style,
      }}
      className={className}
      data-testid={dataTestId}
    >
      <Tag
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(auto-fill, ${baseSize}px)`,
          height: totalLength,
        }}
      >
        {showIndexList.map((index) => {
          return (
            <Children
              key={index}
              index={index}
              isPending={isPending}
              style={{
                gridColumnStart: 1,
                gridColumnEnd: 1,
                gridRowStart: sizeList[index] / baseSize + 1,
                gridRowEnd: sizeList[index + 1] / baseSize + 1,
              }}
            />
          )
        })}
      </Tag>
    </div>
  )
})
