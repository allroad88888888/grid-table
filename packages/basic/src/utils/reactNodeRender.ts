import type { ReactNode } from 'react'

export function reactNodeRender(node: ReactNode | (() => ReactNode)) {
  if (typeof node === 'function') {
    return node()
  }
  return node
}
