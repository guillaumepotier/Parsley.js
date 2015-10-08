// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.pl = $.extend(window.ParsleyConfig.i18n.pl || {}, {
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

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('pl', window.ParsleyConfig.i18n.pl, true);
