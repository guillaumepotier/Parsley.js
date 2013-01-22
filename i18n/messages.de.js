window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Die Eingabe scheint nicht korrekt zu sein."
      , type: {
            email:      "Die Eingabe muss eine gültige E-Mail-Adresse sein."
          , url:        "Die Eingabe muss eine gültige URL sein."
          , urlstrict:  "Die Eingabe muss eine gültige URL sein."
          , number:     "Die Eingabe muss eine Zahl sein."
          , digits:     "Die Eingabe muss numerisch sein. "
          , dateIso:    "Die Eingabe muss ein gültiges Datum sein (YYYY-MM-DD)."
          , alphanum:   "Die Eingabe muss alphanumerisch sein."
        }
      , notnull:        "Die Eingabe darf nicht leer sein."
      , notblank:       "Die Eingabe darf nicht leer sein."
      , required:       "Die Eingabe ist ein Pflichtfeld."
      , regexp:         "Die Eingabe scheint ungültig zu sein."
      , min:            "Die Eingabe muss größer als %s sein."
      , max:            "Die Eingabe muss kleiner als %s sein."
      , range:          "Die Eingabe muss zwischen %s und %s sein."
      , minlength:      "Die Eingabe ist zu kurz. Es müssen mindestens %s Zeichen eingegeben werden."
      , maxlength:      "Die Eingabe ist zu lang. Es dürfen höchstens %s Zeichen eingegeben werden."
      , rangelength:    "Die Länge der Eingabe ist ungültig. Es müssen zwischen %s und %s Zeichen eingegeben werden."
      , equalto:        "Die Eingabe darf nicht identisch sein."

      // parsley.extend ///////////////////////////////
    }
  });
}(window.jQuery || window.Zepto));
