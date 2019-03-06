function fold<B>(onError: (e: any) => B, onOk: (data: ParticipantDetails) => B) {
  return function(value: ParticipantType) {
    return Participant.match(value, {
      Invalid: onError,
      default: onOk
    })
  }
}

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

export const WDSParticipant = Object.assign(Participant, { fold, map, flatMap, tap, from })
