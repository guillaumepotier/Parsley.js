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
          , digits:     "Die Eingabe darf nur Ziffern enthalten."
          , dateIso:    "Die Eingabe muss ein gültiges Datum im Format YYYY-MM-DD sein."
          , alphanum:   "Die Eingabe muss alphanumerisch sein."
          , phone:      "Die Eingabe muss eine gültige Telefonnummer sein."
        }
      , notnull:        "Die Eingabe darf nicht leer sein."
      , notblank:       "Die Eingabe darf nicht leer sein."
      , required:       "Dies ist ein Pflichtfeld."
      , regexp:         "Die Eingabe scheint ungültig zu sein."
      , min:            "Die Eingabe muss größer oder gleich %s sein."
      , max:            "Die Eingabe muss kleiner oder gleich %s sein."
      , range:          "Die Eingabe muss zwischen %s und %s liegen."
      , minlength:      "Die Eingabe ist zu kurz. Es müssen mindestens %s Zeichen eingegeben werden."
      , maxlength:      "Die Eingabe ist zu lang. Es dürfen höchstens %s Zeichen eingegeben werden."
      , rangelength:    "Die Länge der Eingabe ist ungültig. Es müssen zwischen %s und %s Zeichen eingegeben werden."
      , equalto:        "Dieses Feld muss dem anderen entsprechen."

      // parsley.extend ///////////////////////////////
      , minwords:       "Die Eingabe muss mindestens %s Wörter enthalten."
      , maxwords:       "Die Eingabe darf höchstens %s Wörter enthalten."
      , rangewords:     "Die Eingabe muss zwischen %s und %s Wörter enthalten."
      , greaterthan:    "Die Eingabe muss größer als %s sein."
      , lessthan:       "Die Eingabe muss kleiner als %s sein."
    }
  });
}(window.jQuery || window.Zepto));
