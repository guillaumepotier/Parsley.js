// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('pl', {
  defaultMessage: "Wartość wygląda na nieprawidłową",
  type: {
    email:        "Wpisz poprawny adres e-mail.",
    url:          "Wpisz poprawny adres URL.",
    number:       "Wpisz poprawną liczbę.",
    integer:      "Dozwolone jedynie liczby człkowite.",
    digits:       "Dozwolone jedynie cyfry.",
    alphanum:     "Dozwolone jedynie znaki alfanumeryczne."
  },
  notblank:       "Pole nie może zostać puste",
  required:       "Pole jest wymagane.",
  pattern:        "Wartość wygląda na nieprawidłową.",
  min:            "Wartość powinna być większa od %s.",
  max:            "Wartość powinna być mniejsza od %s.",
  range:          "Wartość powinna być większa od %s i mniejsza od %s.",
  minlength:      "Ilość znaków powinna wynosić %s lub więcej.",
  maxlength:      "Ilość znaków powinna wynosić %s lub mniej.",
  length:         "Ilość znaków powinna wynosić od %s do %s.",
  mincheck:       "Musisz wybrać minimum %s opcji.",
  maxcheck:       "Możesz wybrać maksymalnie %s opcji.",
  check:          "Minimalnie możesz wybrać od %s do %s opcji",
  equalto:        "Wartości nie są identyczne"
});

Parsley.setLocale('pl');
