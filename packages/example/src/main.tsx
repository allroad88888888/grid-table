import { createRoot } from 'react-dom/client'
import { useAtom } from 'einfach-state'
import { currentRouterAtom, Empty, RouterMapping } from './router'
import './index.css'

function App() {
  const [currentUrl, setUrl] = useAtom(currentRouterAtom)
  const routerInfo = RouterMapping[currentUrl]
  const { component: Component = Empty } = routerInfo || {}
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '180px 1260px',
      }}
    >
      <div>
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
      <div>
        <Component />
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('view-root')!)
root.render(<App />)
