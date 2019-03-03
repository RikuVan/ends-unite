import { unionize, ofType, UnionOf } from "unionize"
import merge from "ramda/es/merge"
import identity from "ramda/es/identity"

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

const fold = <B extends {}>(onError: (e: any) => B, onOk: (details: EventDetails) => B) => (
  event: EventType
) =>
  Event.match(event, {
    Error: onError,
    default: onOk
  })

const map = (f: (details: EventDetails) => EventDetails) => (event: Event) =>
  fold<EventType>(identity, v => merge(v, f(v)))(event)

const flatMap = <A extends {}>(f: (a: EventDetails) => A) => (event: EventType) =>
  fold<A>(identity, f)(event)

const tap = (f: Function) => (event: EventType) =>
  fold<EventType>(identity, details => {
    f(details)
    return event
  })(event)

const from = (event: EventType) =>
  Event.match(event, {
    Planning: () => event,
    Open: () => event,
    Full: () => event,
    Closed: () => event,
    Cancelled: () => event,
    default: () => Event.Error()
  })

const WDSEvent = Object.assign(Event, { fold, map, flatMap, tap, from })

export { WDSEvent, EventType }
