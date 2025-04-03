/** @jsxImportSource solid-js */
import { render } from 'solid-js/web'
import { createSignal, Switch, Match } from 'solid-js'
import { VGridTableMillionDemo } from './VGridTableMillionDemo'
import { VGridListDemo } from './VGridListDemo'

function App() {
  const [activeDemo, setActiveDemo] = createSignal('list')
  
  return (
    <div style={{ 
      padding: "20px", 
      "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    }}>
      <h1>SolidJS Grid Table 示例</h1>
      
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        margin: "20px 0", 
        "border-bottom": "1px solid #eee",
        "padding-bottom": "20px" 
      }}>
        <button 
          onClick={() => setActiveDemo('list')}
          style={{
            padding: "10px 20px",
            background: activeDemo() === 'list' ? "#1976d2" : "#e0e0e0",
            color: activeDemo() === 'list' ? "white" : "black",
            border: "none",
            "border-radius": "4px",
            cursor: "pointer",
            "font-size": "16px"
          }}
        >
          VGridList 演示
        </button>
        <button 
          onClick={() => setActiveDemo('table')}
          style={{
            padding: "10px 20px",
            background: activeDemo() === 'table' ? "#1976d2" : "#e0e0e0",
            color: activeDemo() === 'table' ? "white" : "black",
            border: "none",
            "border-radius": "4px",
            cursor: "pointer",
            "font-size": "16px"
          }}
        >
          VGridTable 演示
        </button>
      </div>
      
      <Switch>
        <Match when={activeDemo() === 'list'}>
          <VGridListDemo />
        </Match>
        <Match when={activeDemo() === 'table'}>
          <VGridTableMillionDemo />
        </Match>
      </Switch>
    </div>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

render(() => <App />, root) 