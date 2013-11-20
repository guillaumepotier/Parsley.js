window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Dette felt er ikke gyldigt."
        , type: {
            email:      "Dette felt skal være en gyldig email."
          , url:        "Dette felt skal være en gyldig url."
          , urlstrict:  "Dette felt skal være en gyldig url."
          , number:     "Dette felt skal være et gyldig nummer."
          , digits:     "Dette felt skal være tal."
          , dateIso:    "Dette felt skal være en gyldig dato (YYYY-MM-DD)."
          , alphanum:   "Dette felt skal være bogstaver."
          , phone:      "Dette felt skal være et gyldigt telefon nummer."
        }
      , notnull:        "Dette felt må ikke være null."
      , notblank:       "Dette felt må ikke være tome."
      , required:       "Dette felt skal udfyldes."
      , regexp:         "Dette felt er ikke gyldigt."
      , min:            "Dette felt skal være større end %s."
      , max:            "Dette felt skal være mindre end %s."
      , range:          "Dette felt skal være mellem %s og %s."
      , minlength:      "Dette felt er for kort. Det skal have %s tegn eller mere."
      , maxlength:      "Dette felt is too langt. Det skal have %s tegn eller mindre."
      , rangelength:    "Længden på dette felt er ikke gyldigt. Det skal være %s og %s tegn langt."
      , mincheck:       "Du skal vælge mindst %s valg."
      , maxcheck:       "Du skal vælge %s valg eller mindre."
      , rangecheck:     "Du skal vælge mellem %s og %s valg."
      , equalto:        "Dette felt skal være det samme."

      // parsley.extend ///////////////////////////////
      , minwords:       "Dette felt skal indeholde mindst %s ord."
      , maxwords:       "Dette felt skal indeholde højst %s ord."
      , rangewords:     "Dette felt skal indeholde mellem %s og %s ord."
      , greaterthan:    "Dette felt skal være større end %s."
      , lessthan:       "Dette felt skal være mindre end %s."
      , beforedate:     "Denne dato skal være før %s."
      , afterdate:      "Denne dato skal være efter %s."
    }
  });
}(window.jQuery || window.Zepto));
