import { useAtomValue, useStore } from '@einfach/state'
import { useMemo } from 'react'
import type { EventsCellSet, EventsItem, PositionId } from '@grid-table/basic'
import { useBasic } from '@grid-table/basic'

export function useTheadCellEvents(position: PositionId) {
  const store = useStore()
  const { theadCellEventsAtom } = useBasic()

  const events = useAtomValue(theadCellEventsAtom, { store })

  return useMemo(() => {
    const eventObj: Partial<EventsItem> = {}
    const tempList = Object.keys(events) as (keyof EventsCellSet)[]
    tempList.map((key) => {
      eventObj[key] = (e) => {
        events[key].forEach((event) => {
          // @ts-ignore
          event(position, e)
        })
      }
    })
    return eventObj

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, position.rowId, position.columnId])
}
