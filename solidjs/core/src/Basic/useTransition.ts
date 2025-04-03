/** @jsxImportSource solid-js */
import { startTransition as solidStartTransition } from 'solid-js'

export function useTransition() {
    // SolidJS的startTransition不返回isPending，为了保持API兼容，这里返回假值
    const startTransition = (fn: () => void) => {
        solidStartTransition(fn)
    }

    // 由于SolidJS中没有直接对应React的isPending状态
    // 我们返回false和startTransition函数以保持与React API兼容
    return [false, startTransition] as [boolean, typeof startTransition]
} 