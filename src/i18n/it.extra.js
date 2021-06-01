// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('it', {
  dateiso: "Inserire una data valida (AAAA-MM-GG).",
  date: "Deve essere una data valida nel formato %s",
  datebeforenow: "La data deve essere valida nel formato %s e precedere la data attuale",
  dateafternow: "La data deve essere valida nel formato %s e posteriore alla data attuale",
  minwords:   "Questo valore deve avere almeno %s parole.",
  maxwords:   "Questo valore deve avere meno di %s parole.",
  words:      "Questo valore deve avere tra %s e %s parole.",
  gt:         "Questo valore deve essere maggiore di %s.",
  gte:        "Questo valore deve essere maggiore o uguale a %s.",
  lt:         "Questo valore deve essere minore di %s.",
  lte:        "Questo valore deve essere minore o uguale a %s.",
  notequalto: "Questo valore deve essere differente da %s."
});
