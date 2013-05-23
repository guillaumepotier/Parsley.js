window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley ////////PL/by/Tymek.Cz////////////////
        defaultMessage: "Wartość nieprawidłowa"
      , type: {
            email:      "Niepoprawny adres e-mail"
          , url:        "Niepoprawny adres URL"
          , urlstrict:  "Niepoprawny format adresu adres URL"
          , number:     "Wpisz poprawną liczbę"
          , digits:     "Dozwolone tylko cyfry"
          , dateIso:    "Niepoprawny format  (użyj RRRR-MM-DD)"
          , alphanum:   "Dozwolone tylko znaki alfanumeryczne"
        }
      , notnull:        "Wartość nie może być równa zero"
      , notblank:       "Pole nie może pozostać puste"
      , required:       "Pole wymagane"
      , regexp:         "Niepoprawna wartość"
      , min:            "Wpisz wartość większą od %s"
      , max:            "Wpisz wartość mniejszą od %s"
      , range:          "Wpisz wartość pomiędzy %s i %s"
      , minlength:      "Wpisz %s lub więcej znaków"
      , maxlength:      "Wpisz %s lub mniej znaków"
      , rangelength:    "Wpisz od %s do %s znaków"
      , mincheck:       "Wybierz %s lub więcej opcji"
      , maxcheck:       "Wybierz %s lub mniej opcji"
      , rangecheck:     "Wybierz od %s do %s opcji"
      , equalto:        "Wartość nie jest identyczna"

      // parsley.extend /PL/by/Tymek.Cz////////////////
      , minwords:       "Wpisz więcej niż %s wyrazów"
      , maxwords:       "Wpisz co najwyżej %s wyrazów"
      , rangewords:     "Wpisz od %s do %s wyrazów"
      , greaterthan:    "Podaj wartość większą od %s"
      , lessthan:       "Podaj wartość mniejszą od %s"
    }
  });
}(window.jQuery || window.Zepto));
