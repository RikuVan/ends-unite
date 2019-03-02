import { unionize, ofType, UnionOf } from "unionize"
import merge from "ramda/es/merge"

export interface ParticipantDetails {
  name: string
  email: string
  affiliation?: string
}

const Participant = unionize({
  None: {},
  Pending: ofType<ParticipantDetails>(),
  Registered: ofType<ParticipantDetails>(),
  WaitListed: ofType<ParticipantDetails>(),
  Error: ofType<any>()
})

type ParticipantType = UnionOf<typeof Participant>

const map = (f: (details: ParticipantDetails) => ParticipantDetails) => (val: ParticipantType) => {
  return Participant.match(val, {
    Error: _ => val,
    default: v => merge(v, f(v))
  })
}

const flatMap = (f: (a: ParticipantDetails) => ParticipantType) => (val: ParticipantType) =>
  Participant.match(val, {
    Error: _ => val,
    default: (data: ParticipantDetails) => f(data)
  })

const tap = (f: Function) => (val: ParticipantType) =>
  Participant.match(val, {
    default: (ctx: any) => {
      f(ctx)
      return val
    }
  })

const from = (values: any) => Participant.Pending(values)

const WDSParticipant = Object.assign(Participant, { map, flatMap, tap, from })

export { WDSParticipant, ParticipantType }
