import type { PositionId } from './basic'

export type EventsSet = {
  [P in keyof EventsItem]: Set<EventsItem[P]>
}

export type EventsCellSet = {
  [P in keyof EventsItem]: Set<
    (position: PositionId, ...args: Parameters<EventsItem[P]>) => ReturnType<EventsItem[P]>
  >
}

export interface EventsItem {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseOver: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseOut: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onCopy: (e: React.ClipboardEvent<HTMLDivElement>) => void
}
