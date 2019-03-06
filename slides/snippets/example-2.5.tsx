const useEventMatcher = (matchers, defaultValue, event) => {
  const [result, setResult] = useState(defaultValue)
  useEffect(() => {
    setResult(
      Event.match(event, matchers)
    )
  }, event)
  return result
}

const matchers = {
  Pending: () => <div>Loading...</div>,
  Registered: ({ data }) => <div>{data.name} you are registered.</div>,
  Waiting: ({ data }) => <div>{data.name}, you are in line.</div>,
  Invalid: () => <div className="error">Oops</div>
}

function App({event}: {event: WDSEvent}) {
  const result = useEventMatcher(matchers)}, null, event)
  return <div>{result}</div>
}