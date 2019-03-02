import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { WDSEvent, EventType } from "../event"

type AxiosOptions = {
  method: string
  data?: any
}

const API_ROOT = "http://localhost:5000/"
export const endpoints = {
  currentEvent: () => `${API_ROOT}events/current`,
  register: (id: String) => `${API_ROOT}events/${id}/participants`
}

const defaultState = {
  method: "get",
  endpoint: endpoints.currentEvent(),
  payload: null,
  called: false,
  errorCb: () => {},
  successCb: () => {}
}

export type Query = { payload?: any; endpoint?: string; method?: string }

export function useEventApi(immediate = true) {
  const [event, setEvent] = useState<EventType>(WDSEvent.NotAsked())

  const mountedRef = useRef(false)

  const [query, setQuery] = useState(defaultState)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const setRequestStateSafely = (requestState: any) => mountedRef.current && setEvent(requestState)

  async function handleFetch() {
    const config: AxiosOptions = { method: query.method }
    if (typeof query.payload === "object") config.data = query.payload
    try {
      const { data } = await axios(query.endpoint, config)
      if (query.method !== "post") {
        setRequestStateSafely(WDSEvent.from(data))
      }
      query.successCb()
    } catch (e) {
      if (query.method !== "post") {
        setRequestStateSafely(WDSEvent.Error({ error: e.message }))
      }
      query.errorCb()
    }
  }

  useEffect(() => {
    if (immediate || (query && query.called)) {
      setRequestStateSafely(WDSEvent.Pending())
      handleFetch()
    }
  }, [query])

  return {
    event,
    query: (data: Query) => {
      setQuery({ ...query, called: true, ...data })
    },
    reset: () => {
      setQuery(defaultState)
      setEvent(WDSEvent.NotAsked())
    }
  }
}
