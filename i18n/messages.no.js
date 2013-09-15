window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Denne verdien er ikke gyldig."
      , type: {
            email:      "Denne verdien må være en gyldig e-post."
          , url:        "Denne verdien må være en gyldig nettadresse."
          , urlstrict:  "Denne verdien må være en gyldig nettadresse."
          , number:     "Denne verdien må være et gyldig tall."
          , digits:     "Denne verdien må være tall."
          , dateIso:    "Denne verdien må være en gyldig dato (YYYY-MM-DD)."
          , alphanum:   "Denne verdien må være alfanumerisk(tall eller bokstaver)."
          , phone:      "Denne verdien må være et gyldig telefonnummer."
        }
      , notnull:        "Denne verdien kan ikke være tom."
      , notblank:       "Denne verdien kan ikke være blank."
      , required:       "Dette feltet er obligatorisk."
      , regexp:         "Denne verdien er ikke gyldig."
      , min:            "Denne verdien må være større enn %s."
      , max:            "Denne verdien må være mindre enn %s."
      , range:          "Denne verdien må være mellom %s og %s."
      , minlength:      "Denne verdien er for kort. Den må være minst %s tegn."
      , maxlength:      "Denne verdien er for lang. Den må ikke være lenger enn %s tegn."
      , rangelength:    "Denne verdien har feil lengde. Lengden må være mellom %s og %s tegn."
      , mincheck:       "Du må velge minst %s alternativer."
      , maxcheck:       "Du kan ikke velge mer enn %s alternativer."
      , rangecheck:     "Du må velge mellom %s og %s alternativer."
      , equalto:        "Denne verdien må være lik."

      // parsley.extend ///////////////////////////////
      , minwords:       "Denne verdien må inneholde minst %s ord."
      , maxwords:       "Denne verdien kan ikke inneholde mer enn %s ord."
      , rangewords:     "Denne verdien må ha mellom %s og %s ord."
      , greaterthan:    "Denne verdien må være større enn %s."
      , lessthan:       "Denne verdien må være mindre enn %s."
      , beforedate:     "Datoen må være før %s."
      , afterdate:      "Datoen må være etter %s."
      , americandate:   "Datoen må være på gyldig format (MM/DD/YYYY)."
    }
  });
}(window.jQuery || window.Zepto));
