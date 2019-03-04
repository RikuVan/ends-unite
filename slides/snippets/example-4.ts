function epic(action$: Observable<Action>) {
  return action$
    .filter(Actions.is.ADD_PARTICIPANT)
    .mergeMap(({ payload }) => console.log(payload.text))
}
