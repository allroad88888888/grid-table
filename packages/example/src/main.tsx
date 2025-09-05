import { createRoot } from 'react-dom/client'
import { useAtom } from '@einfach/react'
import { currentRouterAtom, Empty, RouterMapping } from './router'
import { Navigation } from './components/Navigation'
import './index.css'
import { Suspense, useEffect } from 'react'

function App() {
  const [currentUrl, setUrl] = useAtom(currentRouterAtom)
  const routerInfo = RouterMapping[currentUrl]
  const { component: Component = Empty } = routerInfo || {}

  // 监听浏览器前进后退事件
  useEffect(() => {
    const handlePopState = () => {
      setUrl(location.pathname)
    }

    // 初始化时同步浏览器URL和路由状态
    if (location.pathname !== currentUrl) {
      window.history.replaceState(null, '', currentUrl)
    }

    window.addEventListener('popstate', handlePopState)

    // 清理事件监听器
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [setUrl, currentUrl])

  return (
    <div className="app-container">
      <div className="sidebar">
        <Navigation />
      </div>
      <div className="main-content">
        <div className="content-header">
          <div className="current-route-info">
            <span className="route-path">{currentUrl}</span>
            <span className="route-label">{routerInfo?.label || '未知页面'}</span>
          </div>
        </div>
        <div className="content-wrapper">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Component />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('view-root')!)
root.render(<App />)
