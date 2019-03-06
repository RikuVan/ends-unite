// backend
val vibesAtBeginning = when (this) {
  is Audience.Attentive -> 🤗,
  is Audience.Questioning -> 😅,
  is Audience.StaringAtOpenZipper -> 🤭,
  is Audience.Sleeping -> 💩,
  is Applause.DrinkingHeavily -> 🙄
}

// frontend
const vibesAtBeginning = Presentation.match(pres, {
  Attentive: _ -> 🤗,
  Questioning: _ -> 😅,
  StaringAtOpenZipper: _ -> 🤭,
  Sleeping: _ -> 💩,
  DrinkingHeavily: _ -> 🙄
})