window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Laukas užpildytas neteisingai"
      , type: {
            email:      "Neteisingas elektroninio pašto adresas"
          , url:        "Neteisingas URL adresas"
          , urlstrict:  "Neteisingas URL adresas"
          , number:     "Šiame lauke turi būti įrašytas skaičius"
          , digits:     "Šiame lauke galima įrašyti tik skaičius"
          , dateIso:    "Datos formatas turi būti (YYYY-MM-DD)"
          , alphanum:   "Šiame lauke galima įrašyti tik skaičius ir raides"
        }
      , notnull:        "Reikšmė negali būti nulis"
      , notblank:       "Reikšmė negali būti tuščia"
      , required:       "Laukas privalomas"
      , regexp:         "Laukas užpildytas neteisingai"
      , min:            "Reikšmė negali būti mažesnė už %s"
      , max:            "Reikšmė negali būti didesnė už %s"
      , range:          "Reikšmė turi būti tarp %s ir %s"
      , minlength:      "Rėikšmė pertrumpa, jos ilgis turi būti bent %s"
      , maxlength:      "Rėikšmė perilga, jos ilgis turi būti mažiau nei %s"
      , rangelength:    "Rėikšmės ilgis turi būti tarp %s ir %s simbolių"
      , equalto:        "Reikšmės nesutampa"
      , mincheck:       "Būtina pažymėti bent %s"
      , maxcheck:       "Būtina pažymėti mažiau nei %s"
      , rangecheck:     "Galima pažymėti nuo %s iki %s langelių"

      // parsley.extend ///////////////////////////////
      , minwords:       "Žodžių turi būti bent %s"
      , maxwords:       "Žodžių turi būti mažiau nei %s"
      , rangewords:     "Žodžių kiekis turi būti tarp %s ir %s"
      , greaterthan:    "Reikšmė permaža, ji turi būti didesnė nei %s"
      , lessthan:       "Reikšmė perdidelė, ji turi būti mažesnė nei %s"
    }
  });
}(window.jQuery || window.Zepto));
