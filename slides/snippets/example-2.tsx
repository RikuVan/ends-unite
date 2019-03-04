import { Participant, ParticipantDetails } from "example-1"

/******************************* COMPONENT *******************************/

const Main = ({ participant }: { participant: ParticipantDetails }) => (
  <main
    className={`container ${Participant.is.Pending(participant) ? " loading" : ""}`}
    data-testid="toggle-container"
  >
    {Participant.match(participant, {
      Pending: () => <div>Loading...</div>,
      Registered: ({ data }) => <div>{data.name} you are registered.</div>,
      Waiting: ({ data }) => <div>{data.name}, you are in line.</div>,
      Failure: () => <div className="error">Oops</div>
    })}
  </main>
)
