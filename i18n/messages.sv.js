window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Ogiltigt värde."
        , type: {
            email:      "Ange en giltig e-postadress."
          , url:        "Ange en giltig URL."
          , urlstrict:  "Ange en giltig URL."
          , number:     "Ange ett giltigt nummer."
          , digits:     "Ange endast siffror."
          , dateIso:    "Ange ett giltigt datum (ÅÅÅÅ-MM-DD)."
          , alphanum:   "Ange endast bokstäver och siffror."
          , phone:      "Ange ett giltigt telefonnummer."
        }
      , notnull:        "Värdet får inte vara null."
      , notblank:       "Värdet får inte vara tomt."
      , required:       "Måste fyllas i."
      , regexp:         "Värdet är ej giltigt."
      , min:            "Värdet måste vara större än %s."
      , max:            "Värdet måste vara mindre än %s."
      , range:          "Värdet måste vara mellan %s och %s."
      , minlength:      "Värdet måste vara minst %s tecken."
      , maxlength:      "Värdet får maximalt innehålla %s tecken."
      , rangelength:    "Värdets måste vara mellan %s och %s tecken."
      , mincheck:       "Minst %s val måste göras."
      , maxcheck:       "Maximalt %s val får göras."
      , rangecheck:     "Du måste göra minst %s och maximalt %s val."
      , equalto:        "Värdena måste vara lika."

      // parsley.extend ///////////////////////////////
      , minwords:       "Fältet måste innehålla minst %s ord."
      , maxwords:       "Fältet får maximalt innehålla %s ord."
      , rangewords:     "Fältet ska innehålla mellan %s och %s ord."
      , greaterthan:    "Värdet måste vara större än %s."
      , lessthan:       "Värdet måste vara mindre än %s."
      , beforedate:     "Datumet måste vara före %s."
      , afterdate:      "Datumet måste vara efter %s."
      , americandate:   "Ange ett giltigt datum (MM/DD/ÅÅÅÅ)."
    }
  });
}(window.jQuery || window.Zepto));
