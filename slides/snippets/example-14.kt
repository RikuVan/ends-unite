
val vibesAtEnd = when (pres) {
  Presentation.FriendlyQuestion -> 🤗,
  Presentation.HostileQuestion -> 😨,
  Presentation.Silence -> 💩,
  Applause -> 😍,
  else -> 🍺
}

const vibesAtEnd = Presentation.match(pres, {
  FriendlyQuestion: _ -> 🤗,
  HostileQuestion: _ -> 😨,
  Silence: _ -> 💩,
  Applause: _ -> 😍,
  default: _ -> 🍺
})