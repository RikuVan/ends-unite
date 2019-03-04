
"/events/current" bind GET to { _: Request ->
    Database
      .getCurrent()
      .fold(
        {
          when (it) {
            Event.Error.DatabaseError -> errorLens(
                    Event.Error.DatabaseError, Response(INTERNAL_SERVER_ERROR))
            Event.Error.NotFound -> errorLens(
                Event.Error.NotFound, Response(NOT_FOUND))
                    }
        },
        { eventLens(it, Response(OK)) }
      )
  },
