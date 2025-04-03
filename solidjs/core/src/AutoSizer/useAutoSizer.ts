/** @jsxImportSource solid-js */
import { createSignal, onCleanup, onMount } from 'solid-js'
import { throttle } from './throttle'

interface Params {
    height: number
    width: number
}

export interface AutoSizerOptions {
    /**
     * 如果高度变动有动画效果，请设置为true
     * @default false
     */
    withAnimation?: boolean
}

export function useAutoSizer<T extends HTMLElement>(
    ref: { current: (() => T | undefined) | T | undefined | null },
    { withAnimation = false }: AutoSizerOptions = { withAnimation: false },
) {
    // 初始值设为1而不是0，避免首次渲染时计算问题
    const [param, setParam] = createSignal<Params>({
        height: 1,
        width: 1,
    })

    onMount(() => {
        const getElement = () => {
            const current = ref.current;
            if (typeof current === 'function') {
                return current();
            }
            return current;
        };

        const element = getElement();
        if (!element) {
            return;
        }

        function change(parentNode: HTMLElement) {
            const rect = parentNode.getBoundingClientRect()
            // 判断隐藏 nothing todo
            if (rect.height === 0 && rect.width === 0) {
                return
            }
            const styleTemp = window.getComputedStyle(parentNode) || {}
            const paddingLeft = parseFloat(styleTemp.paddingLeft ?? '0')
            const paddingRight = parseFloat(styleTemp.paddingRight ?? '0')
            const paddingTop = parseFloat(styleTemp.paddingTop ?? '0')
            const paddingBottom = parseFloat(styleTemp.paddingBottom ?? '0')

            const borderBottom = parseFloat(styleTemp.borderBottomWidth ?? '0')
            const borderTop = parseFloat(styleTemp.borderTopWidth ?? '0')
            const borderLeft = parseFloat(styleTemp.borderLeftWidth ?? '0')
            const borderRight = parseFloat(styleTemp.borderRightWidth ?? '0')
            const next = {
                height: Math.max(1, parentNode.offsetHeight - paddingTop - paddingBottom - borderBottom - borderTop),
                width: Math.max(1, parentNode.offsetWidth - paddingLeft - paddingRight - borderLeft - borderRight),
            }

            // 只有当尺寸真正变化时才更新
            if (next.width !== param().width || next.height !== param().height) {
                setParam(next);

            }
        }

        // 初始化测量
        setTimeout(() => {
            change(element);
        }, 0);

        const debChange = throttle(change, 100); // 减少节流时间提高响应速度

        let resizeObserver: ResizeObserver
        if (withAnimation) {
            let ticking = false
            resizeObserver = new ResizeObserver((t) => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        change(t[0].target as HTMLElement)
                        ticking = false
                    })

                    ticking = true
                }
            })
        } else {
            resizeObserver = new ResizeObserver((t) => {
                debChange(t[0].target as HTMLElement)
            })
        }

        resizeObserver.observe(element)

        onCleanup(() => {
            resizeObserver.disconnect()
        })
    })

    return {
        width: param().width,
        height: param().height,
    }
} 