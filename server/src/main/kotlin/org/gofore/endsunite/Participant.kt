package org.gofore.endsunite

import java.util.*

enum class ParticipantStatus(val tag: String) {
    PENDING("Pending"),
    REGISTERED("Registered"),
    WAITING("Waiting"),
    CANCELLED("Cancelled");

    companion object {
        fun from(findValue: String): ParticipantStatus =
            ParticipantStatus
                .values()
                .first { it.tag == findValue }
    }
}

data class ParticipantDetails(
    var id: String?,
    val name: String,
    val email: String,
    var tag: String,
    val affiliation: String?
                             )

sealed class Participant {
    data class Pending(val details: ParticipantDetails) : Participant()
    data class Registered(val details: ParticipantDetails) : Participant()
    data class Waiting(val details: ParticipantDetails) : Participant()
    data class Cancelled(val details: ParticipantDetails) : Participant()
    object Error : Participant() {
        val message = "Sorry, something went wrong"
        val code = 500
        val tag = "error"
    }

    companion object {
        fun from(data: ParticipantDetails?): Participant {
            return data?.let {
                when (ParticipantStatus.from(data.tag)) {
                    ParticipantStatus.PENDING -> Pending(data)
                    ParticipantStatus.REGISTERED -> Registered(data)
                    ParticipantStatus.WAITING -> Waiting(data)
                    ParticipantStatus.CANCELLED -> Cancelled(data)
                    else -> Error
                }
            } ?: Error
        }
    }
}

inline fun <B> Participant.fold(onError: (Participant.Error) -> B, onOk: (ParticipantDetails) -> B) = when (this) {
    is Participant.Pending -> onOk(this.details)
    is Participant.Registered -> onOk(this.details)
    is Participant.Waiting -> onOk(this.details)
    is Participant.Cancelled -> onOk(this.details)
    is Participant.Error -> onError(this)
}

inline fun Participant.flatMap(f: (ParticipantDetails) -> Event) = this.fold({ it }, { event -> f(event) })

inline fun Participant.map(f: (ParticipantDetails) -> ParticipantDetails) =
    this.fold({ it }, { details -> Participant.from(f(details)) })

inline fun <B> Participant.getOrElse(default: () -> B) = this.fold({ default() }, { v -> v })

inline fun Participant.tap(f: (ParticipantDetails) -> Unit) = this.fold(
    { it },
    { p ->
        p.apply { f(p) }
        Participant.from(p)
    })

fun Iterable<Participant>.partition(): Pair<List<ParticipantDetails>, List<Participant.Error>> {
    val oks = mutableListOf<ParticipantDetails>()
    val errs = mutableListOf<Participant.Error>()
    forEach {
        it.fold<Unit>(
            { e -> errs.add(e) },
            { p -> oks.add(p) }
                     )

    }
    return Pair(oks, errs)
}

fun Iterable<Participant>.anyValues(): List<ParticipantDetails> = this.partition().first

fun Participant.register(eventStatus: EventStatus) =
    this.map { part ->
        part.copy(
            id = "${UUID.randomUUID()}",
            tag = if (eventStatus == EventStatus.OPEN) "Registered" else "Waiting"
                 )
    }