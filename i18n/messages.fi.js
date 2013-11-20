window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Tämä arvo on virheellinen."
      , type: {
            email:      "Tämän arvon pitäisi olla sähköpostiosoite."
          , url:        "Tämän arvon pitäisi olla URL-osoite."
          , urlstrict:  "Tämän arvon pitäisi olla URL-osoite."
          , number:     "Tämän arvon pitäisi olla numero."
          , digits:     "Tämän arvon pitäisi olla numeroita."
          , dateIso:    "Tämän arvon pitäisi olla päivämäärä (VVVV-KK-PP)."
          , alphanum:   "Tämän arvon pitäisi olla alfanumeerinen."
        }
      , notnull:        "Tämän arvon ei pitäisi olla nolla."
      , notblank:       "Tämän arvon ei pitäisi olla tyhjä."
      , required:       "Tämä arvo on pakollinen."
      , regexp:         "Tämä arvo vaikuttaa virheelliseltä."
      , min:            "Tämän arvon pitäisi olla suurempi kuin %s."
      , max:            "Tämän arvon pitäisi olla pienempi kuin %s."
      , range:          "Tämän arvon pitäisi olla lukujen %s ja %s välillä."
      , minlength:      "Tämä arvo on liian lyhyt. Tässä pitäisi olla %s merkkiä tai enemmän."
      , maxlength:      "Tämä arvo on liian pitkä. Tässä pitäisi olla %s merkkiä tai vähemmän."
      , rangelength:    "Tämän arvon pituus on virheellinen. Tämän pitäisi olla %s-%s merkkiä pitkä."
      , equalto:        "Tämän arvon pitäisi vastata toista arvoa."
      , mincheck:       "Sinun pitää valita vähintään %s."
      , maxcheck:       "Sinun pitää valita %s tai vähemmän."
      , rangecheck:     "Sinun pitää valita %s-%s."

      // parsley.extend ///////////////////////////////
      , minwords:       "Tämän arvon pitäisi sisältää vähintään %s sana(a)."
      , maxwords:       "Tämä arvo voi olla korkeintaan %s sana(a)."
      , rangewords:     "Tämän arvo pitäisi olla %s-%s sana(a)."
      , greaterthan:    "Tämän arvo pitäisi olla suurempi kuin %s."
      , lessthan:       "Tämän arvo pitäisi olla pienempi kuin %s."
    }
  });
}(window.jQuery || window.Zepto));
