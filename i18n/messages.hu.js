window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "A megadott érték érvénytelen."
        , type: {
            email:      "A megadott érték nem email cím."
          , url:        "A megadott érték nem URL cím."
          , urlstrict:  "A megadott érték nem URL cím."
          , number:     "A megadott érték nem szám."
          , digits:     "A megadott érték nem számjegy."
          , dateIso:    "A megadott érték nem dátum (ÉÉÉÉ-HH-NN)."
          , alphanum:   "A megadott érték nem szöveg (a-z)."
          , phone:      "A megadott érték nem telefonszám."
        }
      , notnull:        "A mező nem lehet kitöltettlen."
      , notblank:       "A mező nem lehet üres."
      , required:       "A mező kitöltése kötelező."
      , regexp:         "A megadott érték érvénytelen."
      , min:            "A megadott érték nem lehet kisebb, mint %s."
      , max:            "A megadott érték nem lehet nagyobb, mint %s."
      , range:          "A megadott értéknek %s és %s között kell lennie."
      , minlength:      "A megadott szöveg túl rövid! Legalább %s karakter legyen."
      , maxlength:      "A megadott szöveg túl hosszú. Maximum %s karakter legyen."
      , rangelength:    "A szövegben a karakterek száma %s és %s között legyen."
      , mincheck:       "Önnek a %s megadott lehetőségek közül kell választania."
      , maxcheck:       "Válasszon ki legalább %s-t."
      , rangecheck:     "Válasszon ki %s és %s között."
      , equalto:        "A megadott értékeknek egyezniük kell!"

      // parsley.extend ///////////////////////////////
      , minwords:       "A mezőben a szavak száma nem érni el a %s-t."
      , maxwords:       "A mezőben a szavak száma maximum %s lehet."
      , rangewords:     "A mezőben a szavak számának %s és %s között kell lennie."
      , greaterthan:    "A megadott érték több mint a %s."
      , lessthan:       "A megadott érték kevesebb, mint a %s."
      , beforedate:     "A megadott dátum nem lehet %s vagy ez után."
      , afterdate:      "A megadott dátum nem lehet %s vagy ez elött."
      , americandate:  "A megadott érték nem dátum! (HH/NN/ÉÉÉÉ)."
    }
  });
}(window.jQuery || window.Zepto));
