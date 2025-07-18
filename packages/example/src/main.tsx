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
    <div
      style={{
        display: 'flex',
      }}
    >
      <div
        style={{
          width: '180px',
          flexShrink: 0,
        }}
      >
        <div>
          当前页面链接
          {currentUrl}
        </div>
        {Object.keys(RouterMapping).map((key) => {
          return (
            <div
              style={{
                border: '1px solid red',
                cursor: 'pointer',
              }}
              key={key}
              onClick={() => {
                handleRouteChange(key)
              }}
            >
              {key}
            </div>
          )
        })}
      </div>
      <div
        style={{
          flexGrow: 1,
          width: 1,
        }}
      >
        <Suspense fallback={<div>loading</div>}>
          <Component />
        </Suspense>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('view-root')!)
root.render(<App />)
