import { useEffect } from 'react'

export function useDocumentHandler<T extends () => void>(handler: T, event: string = 'click') {
  useEffect(() => {
    document.addEventListener(event, handler)

    // 清理函数，组件卸载时移除监听器
    return () => {
      document.removeEventListener(event, handler)
    }
  }, [handler, event])
}
