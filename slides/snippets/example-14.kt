
val feelingsAtThisPoint = when (is) {
  Presentation.FriendlyQuestion -> 🤗,
  Presentation.HostileQuestion -> 😨,
  Presentation.Silence -> 💩,
  Applause -> 😍,
  else -> 🍺
}

const feelingsAtThisPoint = Presentation.match(pres, {
  FriendlyQuestion: _ -> 🤗,
  HostileQuestion: _ -> 😨,
  Silence: _ -> 💩,
  Applause: _ -> 😍,
  default: _ -> 🍺
})