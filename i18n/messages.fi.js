window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Tämä arvo on virheellinen."
      , type: {
            email:      "Tämän arvo pitäisi olla sähköpostiosoite."
          , url:        "Tämän arvo pitäisi olla URL-osoite."
          , urlstrict:  "Tämän arvo pitäisi olla URL-osoite."
          , number:     "Tämän arvo pitäisi olla numero."
          , digits:     "Tämän arvo pitäisi olla numeroita."
          , dateIso:    "Tämän arvo pitäisi olla päivämäärä (VVVV-KK-PP)."
          , alphanum:   "Tämän arvo pitäisi olla alfanumeerinen."
        }
      , notnull:        "Tämän arvo ei pitäisi olla nolla."
      , notblank:       "Tämän arvo ei pitäisi olla tyhjä."
      , required:       "Tämä arvo on pakollinen."
      , regexp:         "Tämä arvo vaikuttaa virheelliseltä."
      , min:            "Tämän arvo pitäisi olla suurempi kuin %s."
      , max:            "Tämän arvo pitäisi olla pienempi kuin %s."
      , range:          "Tämän arvo pitäisi olla lukujen %s ja %s välillä."
      , minlength:      "Tämän arvo on liian lyhyt. Tässä pitäisi olla %s merkkiä tai enemmän."
      , maxlength:      "Tämän arvo on liian pitkä. Tässä pitäisi olla %s merkkiä tai vähemmän."
      , rangelength:    "Tämän arvon pituus on virheellinen. Tämän pitäisi olla %s-%s merkkiä pitkä."
      , equalto:        "Tämän arvon pitäisi vastata toista arvoa."
      , mincheck:       "Sinun pitää valita vähintään %s valikoima(a)."
      , maxcheck:       "Sinun pitää valita %s valikoima(a) tai vähemmän."
      , rangecheck:     "Sinun pitää valita %s-%s valikoima(a)."

      // parsley.extend ///////////////////////////////
      , minwords:       "Tämän arvon pitäisi sisältää vähintään %s sana(a)."
      , maxwords:       "Tämän arvo voi olla korkeintaan %s sana(a)."
      , rangewords:     "Tämän arvo pitäisi olla %s-%s sana(a)."
      , greaterthan:    "Tämän arvo pitäisi olla suurempi kuin %s."
      , lessthan:       "Tämän arvo pitäisi olla pienempi kuin %s."
    }
  });
}(window.jQuery || window.Zepto));
