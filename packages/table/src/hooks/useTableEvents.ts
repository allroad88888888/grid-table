import { incrementAtom, useAtomValue, useStore } from '@einfach/react'
import type {} from '@einfach/react'
import { useMemo } from 'react'
import type { EventsItem, EventsSet } from '@grid-table/basic'

export const tableEventsAtom = incrementAtom({} as EventsSet)

export function useTableEvents() {
  const store = useStore()
  const events = useAtomValue(tableEventsAtom,{store})

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
