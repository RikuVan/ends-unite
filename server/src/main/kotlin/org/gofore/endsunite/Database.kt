package org.gofore.endsunite

import java.time.OffsetDateTime

val oldEvent = EventDetails(
    id = "9aa51864-92e1-40a3-afbb-206ca9825582",
    place = "Nokia",
    date = OffsetDateTime.now().plusMonths(1),
    participants = emptyList(),
    registrationOpens = OffsetDateTime.now().minusDays(1),
    max = 20,
    tag = "Closed"
                           )

val currentEvent = EventDetails(
    id = "56e94174-dd02-4ed5-b285-19ffd8385cf9",
    place = "Tampere",
    date = OffsetDateTime.now().plusMonths(1),
    participants = emptyList(),
    registrationOpens = OffsetDateTime.now().minusDays(1),
    max = 10,
    tag = "Open"
                               )

object Database {
    private val events = mutableMapOf(
        "56e94174-dd02-4ed5-b285-19ffd8385cf9" to currentEvent,
        "9aa51864-92e1-40a3-afbb-206ca9825582" to oldEvent
                                     )
    private val isCurrent =
        { event: EventDetails -> EventStatus.from(event.tag) == EventStatus.OPEN || EventStatus.from(event.tag) == EventStatus.FULL }

    fun all(): List<Event> = events.toList().map { Event.from(it.second) }

    fun get(id: String) = Event.from(events[id])

    fun getCurrent() = Event.from(events.toList().map { it.second }.filter(isCurrent).firstOrNull())

    fun update(id: String, event: EventDetails): Boolean {
        val ev = events[id]
        return ev?.let {
            events[id] = event
            return true
        } ?: false
    }
}