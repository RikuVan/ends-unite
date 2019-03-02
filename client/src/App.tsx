import * as React from "react"

import { useEventApi, Query } from "./hooks/useEventApi"
import { WDSEvent, EventType } from "./Event"
import "antd/dist/antd.css"
import { Spin } from "antd"
import { RegistrationForm } from "./Registration"
import { EventInfo } from "./EventInfo"

export type EventCtx = {
  event: EventType
  query: (data: Query) => void
}

export let EventContext = React.createContext<any>(undefined)

export type Status = "open" | "full" | "cancelled"

interface EventProps {
  event: EventType
  status: Status
}

const Event = ({ event, status }: EventProps) => (
  <React.Fragment>
    <EventInfo status={status} event={event} />
    {event !== "cancelled" && <RegistrationForm status={status} />}
  </React.Fragment>
)

const App = () => {
  const { event, query } = useEventApi(true)
  return (
    <EventContext.Provider value={{ event, query } as EventCtx}>
      <main
        className={`container ${WDSEvent.is.Pending(event) ? "full" : ""}`}
        data-testid="toggle-container"
      >
        {WDSEvent.match(event, {
          Pending: () => <Spin size="large" style={{ paddingTop: "200px" }} />,
          Open: event => <Event event={event} status="open" />,
          Full: event => <Event event={event} status="full" />,
          Cancelled: event => <Event event={event} status="cancelled" />,
          Closed: () => <h3>Web Dev & Sausages: The event is over</h3>,
          default: () => <h3>Web Dev & Sausages: No current events</h3>
        })}
      </main>
    </EventContext.Provider>
  )
}

export default App
