// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('hu', {
  dateiso:  "A mező értéke csak érvényes dátum lehet (YYYY-MM-DD).",
  minwords: "Minimum %s szó megadása szükséges.",
  maxwords: "Maximum %s szó megadása engedélyezett.",
  words:    "Minimum %s, maximum %s szó megadása szükséges.",
  gt:       "A mező értéke nagyobb kell legyen.",
  gte:      "A mező értéke nagyobb vagy egyenlő kell legyen.",
  lt:       "A mező értéke kevesebb kell legyen.",
  lte:      "A mező értéke kevesebb vagy egyenlő kell legyen.",
  notequalto: "Az érték különböző kell legyen."
});
