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
      , equalto:        "Denne verdien må være lik."

      // parsley.extend ///////////////////////////////
    }
  });
}(window.jQuery || window.Zepto));
