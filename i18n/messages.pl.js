window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley ////////PL/by/Tymek///////////////////
        defaultMessage: "Wartość wygląda na nieprawidłową"
      , type: {
            email:      "Wpisz poprawny adres e-mail"
          , url:        "Wpisz poprawny adres URL"
          , urlstrict:  "Wpisz poprawny adres URL"
          , number:     "Wpisz poprawną liczbę"
          , digits:     "Dozwolone jedynie cyfry"
          , dateIso:    "Wpisz poprawny format daty (RRRR-MM-DD)"
          , alphanum:   "Dozwolone jedynie znaki alfanumeryczne"
        }
      , notnull:        "Wartość musi być różna od zera"
      , notblank:       "Pole nie może pozostać puste"
      , required:       "Pole wymagane"
      , regexp:         "Wartość wygląda na nieprawidłową"
      , min:            "Wartość powinna być większa od %s"
      , max:            "Wartość powinna być mniejsza od %s"
      , range:          "Wartość powinna być większa od %s i mniejsza od %s"
      , minlength:      "Ilość znaków powinna wynosić %s lub więcej"
      , maxlength:      "Ilość znaków powinna wynosić %s lub mniej"
      , rangelength:    "Ilość znaków powinna wynosić od %s do %s"
      , mincheck:       "Wybierz %s lub więcej opcji"
      , maxcheck:       "Wybierz %s lub mniej opcji"
      , rangecheck:     "Wybierz od %s do %s opcji"
      , equalto:        "Wartość musi być identyczna"

      // parsley.extend ///////////////////////////////
      , minwords:       "Wpisz więcej niż %s wyrazów"
      , maxwords:       "Wartość nie może przekraczać %s wyrazów"
      , rangewords:     "Wartość musi zawierać od %s do %s wyrazów"
      , greaterthan:    "Wartość musi być większa niż %s"
      , lessthan:       "Wartość musi być mniejsza niż %s"
    }
  });
}(window.jQuery || window.Zepto));
