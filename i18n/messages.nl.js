window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Deze waarde lijkt onjuist."
      , type: {
            email:      "Dit lijkt geen geldig e-mail adres te zijn."
          , url:        "Dit lijkt geen geldige URL te zijn."
          , urlstrict:  "Dit is geen geldige URL."
          , number:     "Deze waarde moet een nummer zijn."
          , digits:     "Deze waarde moet numeriek zijn."
          , dateIso:    "Deze waarde moet een datum in het volgende formaat zijn: (YYYY-MM-DD)."
          , alphanum:   "Deze waarde moet alfanumeriek zijn."
        }
      , notnull:        "Deze waarde mag niet leeg zijn."
      , notblank:       "Deze waarde mag niet leeg zijn."
      , required:       "Dit veld is verplicht"
      , regexp:         "Deze waarde lijkt onjuist te zijn."
      , min:            "Deze waarde mag niet lager zijn dan %s."
      , max:            "Deze waarde mag niet groter zijn dan %s."
      , range:          "Deze waarde moet tussen %s en %s liggen."
      , minlength:      "Deze tekst is te kort. Deze moet uit minimaal %s karakters bestaan."
      , maxlength:      "Deze waarde is te lang. Deze mag maximaal %s karakters lang zijn."
      , rangelength:    "Deze waarde moet tussen %s en %s karakters lang zijn."
      , equalto:        "Deze waardes moeten identiek zijn."

      // parsley.extend ///////////////////////////////
      , minwords:       "Deze waarde moet minstens %s woorden bevatten."
      , maxwords:       "Deze waarde mag maximaal %s woorden bevatten."
      , rangewords:     "Deze waarde moet tussen de %s en %s woorden bevatten."
      , greaterthan:    "Deze waarde moet groter dan %s zijn."
      , lessthan:       "Deze waarde moet kleiner dan %s zijn."
    }
  });
}(window.jQuery || window.Zepto));
