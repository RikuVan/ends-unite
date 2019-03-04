/******************************* REDUCER *******************************/

const handlers = {
  [LOGIN]: (state: Auth) => User.LOADING(),
  [COMPLETE_LOGIN]: (state: Auth, { payload }: { payload: { error: any } & UserData }) => {
    const { error, data, status, pagePrivileges = [] } = payload
    if (status === 200) {
      return User.OK({
        ...state,
        data,
        pagePrivileges
      })
    }
    return User.FAILED({ error })
  },
  [LOGOUT]: (state: Auth) => {
    return User.NOT_ASKED()
  },
  [VERIFY]: (state: Auth) => {
    return !User.is.OK(state) ? User.LOADING() : state
  },
  [CLEAR_AUTH_ERROR]: (state: Auth) => {
    return User.is.FAILED(state) ? User.NOT_ASKED() : state
  }
}

const user = (state = initialState.user, action: fromActions.Actions): Auth =>
  handlers[action.type] ? handlers[action.type](state, action) : state

export default user
