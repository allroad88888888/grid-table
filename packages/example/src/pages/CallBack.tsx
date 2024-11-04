import { useCallback, useState } from 'react'

export function CallBackDemo() {
  const [state, setState] = useState(0)

  const onClick = useCallback(() => {
    setState(state + 1)
  }, [])

  return (
    <div>
      {state} <button onClick={onClick}>+1</button>{' '}
    </div>
  )
}
