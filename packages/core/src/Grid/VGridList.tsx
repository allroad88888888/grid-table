import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { ListProps, VGridListRef } from './type'
import { useAutoSizer } from '../AutoSizer'
import { useVScroll } from '../Basic/useVScroll'

interface VGridListProps extends Omit<ListProps, 'width' | 'height'> {
  baseSize: number
  stayIndexList?: number[]
}

export const VGridList = forwardRef<VGridListRef, VGridListProps>((props, gridRef) => {
  const { style, className, tag = 'div', 'data-testid': dataTestId } = props
  const { baseSize, children } = props

  const ref = useRef<HTMLDivElement>(null)

  useImperativeHandle(gridRef, () => {
    return {
      scrollTo: (index: number, { behavior, logicalPosition = 'start' } = {}) => {
        if (!ref.current) return

        const containerHeight = height
        const elementTop = index * baseSize
        let scrollTop = elementTop

        switch (logicalPosition) {
          case 'start':
            scrollTop = elementTop
            break
          case 'center':
            scrollTop = elementTop - (containerHeight - baseSize) / 2
            break
          case 'end':
            scrollTop = elementTop - (containerHeight - baseSize)
            break
          case 'nearest': {
            const currentScrollTop = ref.current.scrollTop
            const elementBottom = elementTop + baseSize
            const viewportTop = currentScrollTop
            const viewportBottom = currentScrollTop + containerHeight

            // 如果元素已经在视口内，不需要滚动
            if (elementTop >= viewportTop && elementBottom <= viewportBottom) {
              return
            }

            // 计算到上边界和下边界的距离，选择最小的
            const distanceToTop = Math.abs(elementTop - viewportTop)
            const distanceToBottom = Math.abs(elementBottom - viewportBottom)

            if (distanceToTop <= distanceToBottom) {
              scrollTop = elementTop // 对齐到顶部
            } else {
              scrollTop = elementTop - (containerHeight - baseSize) // 对齐到底部
            }
            break
          }
          default:
            scrollTop = elementTop
        }

        ref.current.scrollTo({
          top: Math.max(0, scrollTop), // 确保不会滚动到负值
          behavior: behavior,
        })
      },
    }
  })

  const { width, height } = useAutoSizer(ref)

  const { onScroll, totalLength, sizeList, showIndexList, isPending } = useVScroll({
    width,
    height,
    ...props,
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
