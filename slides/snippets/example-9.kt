

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