import { unionize, ofType, UnionOf } from "unionize"

/******************************* BASICS *******************************/

export interface ParticipantDetails {
  name: string
  email: string
}

export const Participant = unionize({
  Pending: ofType<ParticipantDetails>(),
  Registered: ofType<ParticipantDetails>(),
  Waiting: ofType<ParticipantDetails>(),
  Invalid: ofType<any>()
})

export type ParticipantType = UnionOf<typeof Participant>
