import * as React from "react"
import { Form, Input, Button, Card, message } from "antd"
import { WDSParticipant, ParticipantDetails, ParticipantType } from "./Participant"
import assoc from "ramda/es/assoc"
import { EventContext, Status } from "./App"
import { endpoints } from "./hooks/useEventApi"

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
}

const submitItemLayout = {
  wrapperCol: {
    xs: {
      span: 8,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 4
    }
  }
}

const success = () => {
  message.success("You are successfully registered.")
}

const failure = () => {
  message.error("Oops, an error occurred. Try again.")
}

type Evt = React.ChangeEvent<HTMLInputElement>

const updateParticipant: ParticipantType = (prop: string) => (
  e: Evt,
  participant: ParticipantType
) =>
  WDSParticipant.map((values: ParticipantDetails) => assoc(prop, e.target.value, values))(
    participant
  )

interface Props {
  status: Status
}

export const RegistrationForm: React.SFC<Props> = ({ status }: Props) => {
  const [participant, setParticipant] = React.useState(
    WDSParticipant.Pending({
      name: "",
      email: "",
      affiliation: ""
    })
  )

  const { event, query } = React.useContext(EventContext)

  const setName = (e: Evt) => setParticipant(updateParticipant("name")(e, participant))
  const setEmail = (e: Evt) => setParticipant(updateParticipant("email")(e, participant))
  const setAffiliation = (e: Evt) =>
    setParticipant(updateParticipant("affiliation")(e, participant))

  const refetchEvent = () =>
    query({
      endpoint: endpoints.currentEvent(),
      method: "get"
    })

  const handleSubmit = (e: Evt) => {
    e.preventDefault()
    query({
      payload: participant,
      endpoint: endpoints.register(event.id),
      method: "post",
      successCb: () => {
        refetchEvent()
        success()
      },
      failureCb: () => {
        refetchEvent()
        failure()
      }
    })
  }

  return (
    <Card>
      <Form onSubmit={handleSubmit}>
        <Form.Item label="Name:" {...formItemLayout}>
          <Input value={participant.name} onChange={setName} />
        </Form.Item>
        <Form.Item label="Email:" {...formItemLayout}>
          <Input value={participant.email} onChange={setEmail} />
        </Form.Item>
        <Form.Item label="Affiliation:" {...formItemLayout}>
          <Input value={participant.affiliation} onChange={setAffiliation} />
        </Form.Item>
        <Form.Item {...submitItemLayout}>
          <Button type="primary" htmlType="submit">
            {status === "open" ? "Register" : "Join the Waiting List"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
