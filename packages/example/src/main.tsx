import { createRoot } from 'react-dom/client'
import { useAtom } from '@einfach/react'
import { currentRouterAtom, Empty, RouterMapping } from './router'
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

  // 处理路由切换
  const handleRouteChange = (newUrl: string) => {
    // 更新 atom 状态
    setUrl(newUrl)
    // 更新浏览器URL
    window.history.pushState(null, '', newUrl)
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">当前页面链接</div>
          <div className="current-url">{currentUrl}</div>
        </div>
        <div className="nav-list" data-count={Object.keys(RouterMapping).length}>
          {Object.keys(RouterMapping).map((key) => {
            const isActive = currentUrl === key
            const routeInfo = RouterMapping[key]
            return (
              <div
                className={`nav-item ${isActive ? 'active' : ''}`}
                key={key}
                onClick={() => {
                  handleRouteChange(key)
                }}
                title={`${routeInfo?.label || key} (${key})`} // 显示标签和路径
              >
                {routeInfo?.label || key}
              </div>
            )
          })}
        </div>
      </div>
      <div className="main-content">
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
