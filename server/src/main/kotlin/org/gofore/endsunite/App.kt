package org.gofore.endsunite

import org.http4k.core.Body
import org.http4k.core.Method.GET
import org.http4k.core.Method.POST
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.INTERNAL_SERVER_ERROR
import org.http4k.core.Status.Companion.NOT_FOUND
import org.http4k.core.Status.Companion.OK
import org.http4k.core.Status.Companion.UNPROCESSABLE_ENTITY
import org.http4k.core.then
import org.http4k.filter.CorsPolicy.Companion.UnsafeGlobalPermissive
import org.http4k.filter.DebuggingFilters
import org.http4k.filter.ServerFilters.Cors
import org.http4k.format.Jackson.auto
import org.http4k.routing.bind
import org.http4k.routing.path
import org.http4k.routing.routes
import org.http4k.server.Jetty
import org.http4k.server.asServer


fun main(args: Array<String>) {
    val port = if (args.isNotEmpty()) args[0].toInt() else 5000

    val eventLens = Body.auto<EventDetails>().toLens()
    val eventListLens = Body.auto<List<EventDetails>>().toLens()
    val errorLens = Body.auto<Event.Error>().toLens()
    val participantLens = Body.auto<ParticipantDetails>().toLens()

    DebuggingFilters
        .PrintRequestAndResponse()
        .then(Cors(UnsafeGlobalPermissive))
        .then(
            routes(
                "/events" bind GET to { _: Request ->
                    eventListLens(Database.all().anyValues(), Response(OK))
                },
                "/events/current" bind GET to { _: Request ->
                    Database.getCurrent().fold({
                        when (it) {
                            Event.Error.DatabaseError -> errorLens(
                                Event.Error.DatabaseError, Response(
                                    INTERNAL_SERVER_ERROR
                                                                   )
                                                                  )
                            Event.Error.NotFound -> errorLens(
                                Event.Error.NotFound, Response(
                                    NOT_FOUND
                                                              )
                                                             )
                        }
                    },
                        { eventLens(it, Response(OK)) })
                },
                "/events/{id}/participants" bind POST to { req ->
                    val eventId = req.path("id")
                    val participant = Participant.from(participantLens(req))

                    if (eventId.isNullOrBlank() || participant == Participant.Error) Response(UNPROCESSABLE_ENTITY)

                    Database.get(eventId as String).map { details ->
                        val registered = participant.register(EventStatus.from(details.tag))
                            .fold({ Response(INTERNAL_SERVER_ERROR) }, { it })
                        details.copy(participants = details.participants.plusElement(registered as ParticipantDetails))
                    }.fold(
                        {
                            Response(INTERNAL_SERVER_ERROR)
                        },
                        { details ->
                            Database.update(eventId, details)
                            // log updated event
                            Database.get(eventId).tap { v -> println(v) }
                            Response(OK)
                        }
                          )
                })
             )
        .asServer(Jetty(port)).start().block()
}