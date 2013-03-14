/**
* Swedish i18n.
*/
window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Ogiltigt värde."
        , type: {
            email:      "Värdet måste vara en giltig e-postadress."
          , url:        "Värdet måste vara en giltig URL."
          , urlstrict:  "Värdet måste vara en giltig URL."
          , number:     "Värdet måste vara ett giltigt nummer."
          , digits:     "Värdet får enbart innehålla siffror."
          , dateIso:    "Värdet måste vara ett giltigt datum (YYYY-MM-DD)."
          , alphanum:   "Värdet får bara innehålla bokstäver och siffror."
        }
      , notnull:        "Värdet får inte vara null."
      , notblank:       "Fältet får inte vara tomt."
      , required:       "Måste fyllas i."
      , regexp:         "Värdet verkar inte vara giltigt."
      , min:            "Värdet måste vara större än %s."
      , max:            "Värdet måste vara mindre än %s."
      , range:          "Värdet måste vara mellan %s och %s."
      , minlength:      "Värdet är för kort. Det måste innehålla minst %s tecken."
      , maxlength:      "Värdet är för långt. Det får maximalt innehålla %s tecken."
      , rangelength:    "Värdets längd är felaktig. Det måste innehålla mellan %s och %s tecken."
      , mincheck:       "Minst %s värden måste väljas."
      , maxcheck:       "Maximalt %s värden får väljas."
      , rangecheck:     "Du måste göra minst %s och maximalt %s val."
      , equalto:        "Värdet måste vara lika."

      // parsley.extend ///////////////////////////////
      , minwords:       "Fältet måste innehålla minst %s ord."
      , maxwords:       "Fältet får maximalt innehålla %s ord."
      , rangewords:     "Fältet ska innehålla mellan %s och %s ord."
      , greaterthan:    "Värdet måste vara större än %s."
      , lessthan:       "Värdet måste vara mindre än %s."
      , beforedate:     "Datumet måste vara före %s."
      , afterdate:      "Datumet måste vara efter %s."
    }
  });
}(window.jQuery || window.Zepto));