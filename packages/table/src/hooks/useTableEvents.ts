import { incrementAtom, useAtomValue } from '@einfach/state'
import type {} from '@einfach/state'
import { useMemo } from 'react'
import type { EventsItem, EventsSet } from '@grid-table/basic'

export const tableEventsAtom = incrementAtom({} as EventsSet)

export function useTableEvents() {
  const events = useAtomValue(tableEventsAtom)

  return useMemo(() => {
    const eventObj: Partial<EventsItem> = {}
    ;(Object.keys(events) as (keyof EventsSet)[]).map((key) => {
      eventObj[key] = (e: any) => {
        events[key].forEach((event) => {
          event(e)
        })
      }
    })
    return eventObj
  }, [events])
}
