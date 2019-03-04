// backend
val presentationFeelings = when (is) {
  is Audience.Attentive -> 🤗,
  is Audience.Questioning -> 😅,
  is Audience.StaringAtOpenZipper -> 🤭,
  is Audience.Sleeping -> 💩,
  is Applause.DrinkingHeavily -> 🙄
}

// frontend
const presentationFeelings = Presentation.match(pres, {
  Attentive: _ -> 🤗,
  Questioning: _ -> 😅,
  StaringAtOpenZipper: _ -> 🤭,
  Sleeping -> 💩,
  DrinkingHeavily -> 🙄
})