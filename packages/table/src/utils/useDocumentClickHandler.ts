import { useEffect } from 'react'

export function useDocumentClickHandler<T extends () => void>(handler: T) {
  useEffect(() => {
    document.addEventListener('click', handler)

    // 清理函数，组件卸载时移除监听器
    return () => {
      document.removeEventListener('click', handler)
    }
  }, [handler])
}
