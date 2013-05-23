window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Aquest valor sembla ser invàlid."
      , type: {
            email:      "Aquest valor ha de ser una adreça de correu electrònic vàlida."
          , url:        "Aquest valor ha de ser una URL vàlida."
          , urlstrict:  "Aquest valor ha de ser una URL vàlida."
          , number:     "Aquest valor ha de ser un nombre vàlid."
          , digits:     "Aquest valor ha només pot contenir dígits."
          , dateIso:    "Aquest valor ha de ser una data vàlida (YYYY-MM-DD)."
          , alphanum:   "Aquest valor ha de ser alfanumèric."
        }
      , notnull:        "Aquest valor no pot ser nul."
      , notblank:       "Aquest valor no pot ser buit."
      , required:       "Aquest valor és requerit."
      , regexp:         "Aquest valor és incorrecte."
      , min:            "Aquest valor no pot ser menor que %s."
      , max:            "Aquest valor no pot ser major que %s."
      , range:          "Aquest valor ha d'estar entre %s i %s."
      , minlength:      "Aquest valor és massa curt. La longitud mínima és de %s caràcters."
      , maxlength:      "Aquest valor és massa llarg. La longitud màxima és de %s caràcters."
      , rangelength:    "La longitud d'aquest valor ha de ser d'entre %s i %s caràcters."
      , equalto:        "Aquest valor ha de ser idèntic."
      , mincheck:       "Has de marcar un mínim de %s opcions."
      , maxcheck:       "Has de marcar un màxim de %s opcions."
      , rangecheck:     "Has de marcar entre %s i %s opcions."

      // parsley.extend ///////////////////////////////
      , minwords:       "Aquest valor ha de tenir %s paraules com a mínim."
      , maxwords:       "Aquest valor no pot superar les %s paraules."
      , rangewords:     "Aquest valor ha de tenir entre %s i %s paraules."
      , greaterthan:    "Aquest valor no pot ser major que %s."
      , lessthan:       "Aquest valor no pot ser menor que %s."
    }
  });
}(window.jQuery || window.Zepto));