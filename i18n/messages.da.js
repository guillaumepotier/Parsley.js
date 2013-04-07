window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
      defaultMessage: "Denne værdi ser ud til at være ugyldig."
      , type: {
        email:      "Denne værdi skal være en gyldig e-mail."
        , url:        "Denne værdi skal være en gyldig url."
        , urlstrict:  "Denne værdi skal være en gyldig url."
        , number:     "Denne værdi skal være et gyldigt tal."
        , digits:     "Denne værdi skal være et eller flere cifre."
        , dateIso:    "Denne værdi skal være en gyldig dato (ÅÅÅÅ-MM-DD)."
        , alphanum:   "Denne værdi skal være alfanumerisk."
        , phone:      "Denne værdi skal være et gyldigt telefonnummer."
      }
      , notnull:        "Denne værdi må ikke være nul."
      , notblank:       "Denne værdi må ikke være tom."
      , required:       "Denne værdi er påkrævet."
      , regexp:         "Denne værdi ser ud til at være ugyldig."
      , min:            "Denne værdi skal være større end %s."
      , max:            "Denne værdi skal være mindre end %s."
      , range:          "Denne værdi skal være mellem %s og %s."
      , minlength:      "Denne værdi er for kort. Den skal have %s tegn eller derover."
      , maxlength:      "Denne værdi er for lang. Den skal have %s tegn eller mindre."
      , rangelength:    "Denne værdi har en ugyldig længde. Den skal være mellem %s og %s tegn."
      , mincheck:       "Du skal vælge mindst %s valg."
      , maxcheck:       "Du skal vælge %s valg eller derunder."
      , rangecheck:     "Du skal vælge mellem %s og %s valg."
      , equalto:        "Denne værdi skal være den samme."

      // parsley.extend ///////////////////////////////
      , minwords:       "Denne værdi skal have mindst %s ord."
      , maxwords:       "Denne værdi skal have maksimum %s ord."
      , rangewords:     "Denne værdi skal have mellem %s og %s ord."
      , greaterthan:    "Denne værdi skal være større end %s."
      , lessthan:       "Denne værdi skal være mindre end %s."
      , beforedate:     "Denne dato skal være før %s."
      , afterdate:      "Denne dato skal være efter %s."
    }
  });
}(window.jQuery || window.Zepto));