// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('lt', {
  dateiso:  "Šis įrašas turi būti teisingo formato data (YYYY-MM-DD).",
  minwords: "Šis įrašas turi turėti ne mažiau kaip %s žodžių.",
  maxwords: "Šis įrašas turi turėti ne daugiau kaip %s žodžių.",
  words:    "Šis įrašas turi turėti nuo %s iki %s žodžių.",
  gt:       "Ši vertė turi būti didesnė.",
  gte:      "Ši vertė turi būti didesnė arba lygi.",
  lt:       "Ši vertė turi būti mažesnė.",
  lte:      "Ši vertė turi būti mažesnė arba lygi.",
  notequalto: "Ši vertė turi būti skirtinga."
});
