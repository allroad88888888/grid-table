import { createRoot } from 'react-dom/client'
import { useAtom } from '@einfach/react'
import { currentRouterAtom, Empty, RouterMapping } from './router'
import './index.css'
import { Suspense } from 'react'

function App() {
  const [currentUrl, setUrl] = useAtom(currentRouterAtom)
  const routerInfo = RouterMapping[currentUrl]
  const { component: Component = Empty } = routerInfo || {}
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
                setUrl(key)
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
