import { unionize, ofType, UnionOf } from "unionize"
import merge from "ramda/es/merge"

export interface EventDetails {
  id: number
  place: string
  date: string
  participants: any[]
  registrationOpens: string
  max: number
}

const Event = unionize({
  NotAsked: {},
  Pending: {},
  Planning: ofType<EventDetails>(),
  Open: ofType<EventDetails>(),
  Full: ofType<EventDetails>(),
  Closed: ofType<EventDetails>(),
  Cancelled: ofType<EventDetails>(),
  Error: ofType<any>()
})

type EventType = UnionOf<typeof Event>

const map = (f: (details: EventDetails) => EventDetails) => (val: Event) =>
  Event.match(val, {
    Error: _ => val,
    default: v => merge(v, f(v))
  })

const flatMap = (f: (a: EventDetails) => EventType) => (val: EventType) =>
  Event.match(val, {
    Error: _ => val,
    default: (data: EventDetails) => f(data)
  })

const tap = (f: Function) => (val: EventType) =>
  Event.match(val, {
    default: (ctx: any) => {
      f(ctx)
      return val
    }
  })

const from = (val: EventType) =>
  Event.match(val, {
    Planning: () => val,
    Open: () => val,
    Full: () => val,
    Closed: () => val,
    Cancelled: () => val,
    default: () => Event.Error()
  })

const WDSEvent = Object.assign(Event, { map, flatMap, tap, from })

export { WDSEvent, EventType }
