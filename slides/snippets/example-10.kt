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