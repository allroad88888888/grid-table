import { useAtomValue } from 'einfach-state'
import type { EventsItem, EventsCellSet } from '../basic'
import { useBasic } from '../basic'
import { useMemo } from 'react'
import type { Position } from '@grid-table/core'

export function useCellEvents(position: Position) {
  const { store, cellEventsAtom } = useBasic()

  const events = useAtomValue(cellEventsAtom, { store })

  return useMemo(() => {
    const eventObj: Partial<EventsItem> = {}
    ;(Object.keys(events) as (keyof EventsCellSet)[]).map((key) => {
      eventObj[key] = (e: any) => {
        events[key].forEach((event) => {
          event(
            {
              rowIndex: position.rowIndex,
              columnIndex: position.columnIndex,
            },
            e,
          )
        })
      }
    })
    return eventObj
  }, [events, position.columnIndex, position.rowIndex])
}
