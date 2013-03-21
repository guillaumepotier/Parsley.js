/**
* Estonian i18n
*/

window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Palun kontrolli välja väärtust."
        , type: {
            email:      "Välja väärtus peaks olema korrektne e-mail."
          , url:        "Välja väärtus peaks olema korrektne internetiaadress."
          , urlstrict:  "Välja väärtus peaks olema korrektne internetiaadress."
          , number:     "Välja väärtus peaks olema korrektne number."
          , digits:     "Välja väärtus peaks olema korrektne täisarv."
          , dateIso:    "Välja väärtus peaks olema korrektne kuupäev (YYYY-MM-DD)."
          , alphanum:   "Välja väärtus peaks sisaldama ainult tähti ja numbreid."
        }
      , notnull:        "Väli väärtus ei tohiks olla tühi."
      , notblank:       "Välja väärtus peaks olema täidetud."
      , required:       "See väli peaks olema täidetud."
      , regexp:         "Vigane väärtus."
      , min:            "Välja väärtus peaks olema suurem kui %s."
      , max:            "Välja väärtus peaks olema väiksem kui %s."
      , range:          "Välja väärtus peaks olema %s ja %s vahel."
      , minlength:      "Väärtus on liiga lühike, pikkus peaks olema %s või rohkem märki."
      , maxlength:      "Väärtus on liiga pikk, pikkus peaks olema %s või vähem märki."
      , rangelength:    "Välja pikkus peaks olema %s ja %s tähemärgi vahel."
      , mincheck:       "Pead valima minimaalselt %s valikut."
      , maxcheck:       "Pead valima maksimaalselt %s valikut."
      , rangecheck:     "Pead valima %s kuni %s valikut."
      , equalto:        "Välja väärtus peaks kattuma."

      // parsley.extend ///////////////////////////////
      , minwords:       "Välja väärtus peaks sisaldama vähemalt %s sõna."
      , maxwords:       "Välja väärtus ei tohi ületada %s sõna."
      , rangewords:     "Välja väärtus peaks olema %s kuni %s sõna."
      , greaterthan:    "Välja väärtus peaks olema suurem kui %s."
      , lessthan:       "Välja väärtus peaks olema väiksem kui %s."
      , beforedate:     "Kuupäev peaks olema varasem kui %s."
      , afterdate:      "Kuupäev peaks olema hilisem kui %s."
    }
  });
}(window.jQuery || window.Zepto));