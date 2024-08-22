import { useAtomValue } from 'einfach-state'
import type { EventsItem, EventsSet } from '../basic'
import { incrementAtom } from '../utils/incrementAtom'
import type {} from 'einfach-state'
import { useMemo } from 'react'

export const tableEventsAtom = incrementAtom({} as EventsSet)

export function useTableEvents() {
  const events = useAtomValue(tableEventsAtom)

  return useMemo(() => {
    const eventObj: Partial<EventsItem> = {};
    (Object.keys(events) as (keyof EventsSet)[]).map((key) => {
      eventObj[key] = (e: any) => {
        events[key].forEach((event) => {
          event(e)
        })
      }
    })
    return eventObj
  }, [events])
}
