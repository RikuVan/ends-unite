import { pipe, assoc } from "ramda"
const { from, map, tap, flatMap, is } = WDSParticipant

const data = {
  tag: "Pending",
  name: "Leo Melin",
  email: "leo.melin@gofore.com"
}

// pipe just takes the returned value from each function and passes it to the next
const registered = pipe(
  from,
  map(assoc("name", "Mr. Leo Melin")),
  tap(console.log),
  flatMap<ParticipantType>(WDSParticipant.Registered),
  is.Registered,
  tap(console.log)
)(data)
