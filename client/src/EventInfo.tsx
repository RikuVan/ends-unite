import * as React from "react"

import { EventDetails } from "./Event"
import { Card } from "antd"
import { Status } from "./App"

export const EventContext = React.createContext(undefined) as any

interface Props {
  status: Status
  event: EventDetails
}

const titles = {
  open: "Sign up now!",
  full: "We are filled up. Join the wait list.",
  cancelled: "Sorry, the event has been cancelled."
}

export const EventInfo = ({ status, event }: Props) => (
  <Card title="Web Dev & Sausages">
    <Card.Meta title={titles[status]} />
    <div style={{ paddingTop: "20px" }}>
      <p>
        <strong>Location:</strong> {event.place}
      </p>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Registrations:</strong> {event.participants.length}
      </p>
    </div>
  </Card>
)
