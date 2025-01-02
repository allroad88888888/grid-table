import { useColumnHide } from '../theadColumnHide/useColumnHide'
import { columnContextMenuOptionsAtom, columnContextMenuPositionAtom } from './state'
import { useTheadContextMenu } from './useTheadContextMenu'
import { useStore, useAtomValue, useAtom } from 'einfach-state'
import './theadContextMenu.css'

export function TheadContextMenu() {
  const store = useStore()
  useTheadContextMenu({ enable: true })
  const [position, setTheadContextMenuPosition] = useAtom(columnContextMenuPositionAtom, { store })
  const list = useAtomValue(columnContextMenuOptionsAtom, { store })

  useColumnHide()

  if (!position) {
    return null
  }
  return (
    <>
      <ul
        style={{
          position: 'absolute',
          width: '100px',
          height: 'auto',
          left: position.x,
          top: position.y,
        }}
        className="grid-table-thead-context-menu-container"
        onClick={() => {
          setTheadContextMenuPosition(undefined)
        }}
      >
        {list.map(({ component }, index) => {
          const Component = component
          return <Component key={index} />
        })}
      </ul>
    </>
  )
}