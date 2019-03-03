import { unionize, ofType, UnionOf } from "unionize"
import merge from "ramda/es/merge"
import identity from "ramda/es/identity"

export interface ParticipantDetails {
  name: string
  email: string
  affiliation?: string
}

const Participant = unionize({
  None: {},
  Pending: ofType<ParticipantDetails>(),
  Registered: ofType<ParticipantDetails>(),
  Waiting: ofType<ParticipantDetails>(),
  Cancelled: ofType<ParticipantDetails>(),
  Error: ofType<any>()
})

type ParticipantType = UnionOf<typeof Participant>

const fold = <B extends {}>(onError: (e: any) => B, onOk: (data: ParticipantDetails) => B) => (
  event: ParticipantType
) =>
  Participant.match(event, {
    Error: onError,
    default: onOk
  })

const map = (f: (details: ParticipantDetails) => ParticipantDetails) => (
  participant: ParticipantType
) => fold<ParticipantType>(identity, v => merge(v, f(v)))(participant)

const flatMap = <A extends {}>(f: (a: ParticipantDetails) => A) => (participant: ParticipantType) =>
  fold<ParticipantType>(identity, f)(participant)

const tap = (f: Function) => (participant: ParticipantType) =>
  fold<ParticipantType>(identity, details => {
    f(details)
    return participant
  })(participant)

const from = (values: any) => Participant.Pending(values)

const WDSParticipant = Object.assign(Participant, { fold, map, flatMap, tap, from })

/*
  EXAMPLE USAGE

 const {from, map, tap, flatMap, is} = WDSParticipant

  const part = WDSParticipant.from({
    tag: "Pending",
    name: "John Doe",
    email: "john.doe@gmail.com"
  })

  const registered = R.pipe(
    map(R.assoc("name", "Billy Bob")),
    tap(console.log),
    flatMap<ParticipantType>(WDSParticipant.Registered),
    is.Registered,
    tap(console.log)
  )(part)

 */

export { WDSParticipant, ParticipantType }
