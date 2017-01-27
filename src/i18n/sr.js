// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('sr', {
  defaultMessage: "Uneta vrednost nije validna.",
  type: {
    email:        "Unesite pravilnu email adresu.",
    url:          "Unesite pravilnu url adresu.",
    number:       "Unesite numeričku vrednost.",
    integer:      "Unesite ceo broj bez decimala.",
    digits:       "Unesite samo brojeve.",
    alphanum:     "Unesite samo alfanumeričke znake (slova i brojeve)."
  },
  notblank:       "Ovo polje ne sme biti prazno.",
  required:       "Ovo polje je obavezno.",
  pattern:        "Uneta vrednost nije validna.",
  min:            "Vrednost mora biti veća ili jednaka %s.",
  max:            "Vrednost mora biti manja ili jednaka %s.",
  range:          "Vrednost mora biti između %s i %s.",
  minlength:      "Unos je prekratak. Mora imati najmanje %s znakova.",
  maxlength:      "Unos je predug. Može imati najviše %s znakova.",
  length:         "Dužina unosa je pogrešna. Broj znakova mora biti između %s i %s.",
  mincheck:       "Morate izabrati minimalno %s opcija.",
  maxcheck:       "Možete izabrati najviše %s opcija.",
  check:          "Broj izabranih opcija mora biti između %s i %s.",
  equalto:        "Unos mora biti jednak."
});

Parsley.setLocale('sr');
