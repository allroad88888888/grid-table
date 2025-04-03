/** @jsxImportSource solid-js */
import { createEffect, onCleanup, createSignal } from 'solid-js'
import { For, Dynamic } from 'solid-js/web'
import type { ListProps } from './type'
import { useAutoSizer } from '../AutoSizer'
import { useVScroll } from '../Basic/useVScroll'

interface VGridListProps extends Omit<ListProps, 'width' | 'height'> {
  baseSize: number
  stayIndexList?: number[]
}

export function VGridList(props: VGridListProps) {
  const { style, className, tag = 'div' } = props
  const { baseSize, children } = props

  const [ref, setRef] = createSignal<HTMLDivElement>()

  const size = useAutoSizer({ 
    current: ref 
  })

  const vscroll = useVScroll({
    width: size.width,
    height: size.height,
    ...props,
  })

  createEffect(() => {
    const element = ref()
    if (!element) {
      return
    }

    element.addEventListener('scroll', vscroll.onScroll, { passive: true })
    
    onCleanup(() => {
      element?.removeEventListener('scroll', vscroll.onScroll)
    })
  })

  return (
    <div
      ref={setRef}
      style={{
        overflow: 'auto',
        "will-change": 'scroll-position',
        contain: 'paint',
        transform: 'translateZ(0)',
        "backface-visibility": 'hidden',
        "overscroll-behavior": 'contain',
        ...(style || {})
      }}
      class={className}
    >
      <Dynamic
        component={tag}
        style={{
          display: 'grid',
          "grid-template-rows": `repeat(auto-fill, ${baseSize}px)`,
          height: `${vscroll.totalLength()}px`,
        }}
      >
        <For each={vscroll.showIndexList()}>
          {(index) => (
            <Dynamic
              component={children}
              index={index}
              // isPending={vscroll.isPending()}
              style={{
                "grid-column-start": 1,
                "grid-column-end": 1,
                "grid-row-start": Math.floor(vscroll.sizeList()[index] / baseSize) + 1,
                "grid-row-end": Math.floor(vscroll.sizeList()[index + 1] / baseSize) + 1,
              }}
            />
          )}
        </For>
      </Dynamic>
    </div>
  )
} 