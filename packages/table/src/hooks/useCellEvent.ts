import { useAtomValue } from 'einfach-state'
import { useMemo } from 'react'
import type { EventsCellSet, EventsItem, PositionId } from '@grid-table/basic/src'
import { useBasic } from '@grid-table/basic/src'

export function useCellEvents(position: PositionId) {
  const { store, cellEventsAtom } = useBasic()

  const events = useAtomValue(cellEventsAtom, { store })

  return useMemo(() => {
    const eventObj: Partial<EventsItem> = {}
    const tempList = Object.keys(events) as (keyof EventsCellSet)[]
    tempList.map((key) => {
      eventObj[key] = (e) => {
        events[key].forEach((event) => {
          event(position, e)
        })
      }
    })
    return eventObj
  }, [events, position.rowId, position.columnId])
}
