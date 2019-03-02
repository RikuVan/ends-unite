package org.gofore.endsunite

import java.time.OffsetDateTime

enum class EventStatus(val tag: String) {
    PLANNING("Planning"),
    OPEN("Open"),
    FULL("Full"),
    CLOSED("Closed"),
    CANCELLED("Cancelled"),
    ERROR("Error");

    companion object {
        fun from(findValue: String): EventStatus =
            EventStatus
                .values()
                .first { it.tag == findValue }
    }
}

data class EventDetails(
    val id: String,
    val place: String,
    val date: OffsetDateTime,
    val participants: List<ParticipantDetails>,
    val registrationOpens: OffsetDateTime,
    val max: Int,
    val tag: String
                       )

sealed class Event {
    data class Planning(val details: EventDetails) : Event()
    data class Open(val details: EventDetails) : Event()
    data class Full(val details: EventDetails) : Event()
    data class Closed(val details: EventDetails) : Event()
    data class Cancelled(val details: EventDetails) : Event()
    sealed class Error(val message: String, val code: Int) : Event() {
        val tag = EventStatus.ERROR

        object NotFound : Error("Sorry, couldn't find an event with this id", 404)
        object DatabaseError : Error("Sorry something bad happened", 500)
    }

    companion object {
        fun from(data: EventDetails?): Event {
            return data?.let {
                when (EventStatus.from(data.tag)) {
                    EventStatus.PLANNING -> Planning(data)
                    EventStatus.CLOSED -> Closed(data)
                    EventStatus.OPEN -> Open(data)
                    EventStatus.FULL -> Full(data)
                    EventStatus.CANCELLED -> Cancelled(data)
                    else -> Error.DatabaseError
                }
            } ?: Error.NotFound
        }
    }
}

inline fun <B> Event.fold(onError: (Event.Error) -> B, onOk: (EventDetails) -> B) = when (this) {
    is Event.Planning -> onOk(this.details)
    is Event.Open -> onOk(this.details)
    is Event.Full -> onOk(this.details)
    is Event.Closed -> onOk(this.details)
    is Event.Cancelled -> onOk(this.details)
    is Event.Error -> onError(this)
}


inline fun Event.flatMap(f: (EventDetails) -> Event) = this.fold({ it }, { event -> f(event) })

inline fun Event.map(f: (EventDetails) -> EventDetails) = this.fold({ it }, { details -> Event.from(f(details)) })

inline fun <B> Event.getOrElse(default: () -> B) = this.fold({ default() }, { v -> v })

inline fun Event.tap(f: (EventDetails) -> Unit) = this.fold(
    { it },
    { ev ->
        ev.apply { f(ev) }
        Event.from(ev)
    })

fun Iterable<Event>.partition(): Pair<List<EventDetails>, List<Event.Error>> {
    val oks = mutableListOf<EventDetails>()
    val errs = mutableListOf<Event.Error>()
    forEach {
        it.fold<Unit>(
            { e -> errs.add(e) },
            { p -> oks.add(p) }
                     )

    }
    return Pair(oks, errs)
}

fun Iterable<Event>.anyValues(): List<EventDetails> = this.partition().first

val Event.takingRegistrations get() = this is Event.Open || this is Event.Full



