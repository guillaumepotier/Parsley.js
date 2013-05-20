/**
* /!\ This file is in Croatian /!\
*/

window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Pogrešan unos"
        , type: {
            email:      "Potrebno je unijeti ispravnu e-mail adresu"
          , url:        "Potrebno je unijeti ispravan link"
          , urlstrict:  "Potrebno je unijeti ispravan link."
          , number:     "Potrebno je unijeti ispravan broj"
          , digits:     "U ovom polju je isključivo dopušteno unošenje brojeva."
          , dateIso:    "Potrebno je unijeti ispravan datum (GGGG-MM-DD)."
          , alphanum:   "U ovom polju je isključivo dopušteno unošenje brojeva i slova."
          , phone:      "Unesite ispravan broj telefona"
        }
      , notnull:        "Potrebno je unijeti ispravan podatak."
      , notblank:       "Potrebno je unijeti ispravan podatak."
      , required:       "Ovo je obavezno polje."
      , regexp:         "Čini se da ste unijeli krivi izraz"
      , min:            "Ova vrijednost mora biti veća ili jednaka %s."
      , max:            "Ova vrijednost mora biti manja ili jednaka %s."
      , range:          "Ova vrijednost mora biti između %s i %s."
      , minlength:      "Uneseni podatak je prekratak. Potrebno je %s ili više znakova."
      , maxlength:      "Uneseni podatak je predug. Potrebno je %s ili manje znakova."
      , rangelength:    "Raspon nije u dopuštenim granicama. Potrebno je da bude između %s i %s znakova."
      , mincheck:       "Potrebno je odabrati %s opcije."
      , maxcheck:       "Potrebno je odabrati %s ili manje opcija."
      , rangecheck:     "Potrebno je odabrati između %s i %s opcija."
      , equalto:        "Unesena vrijednost mora odgovarati prethodnoj."

      // parsley.extend ///////////////////////////////
      , minwords:       "Unos mora sadržavati minimalno %s riječi."
      , maxwords:       "Unos mora sadržavati maksimalno %s riječi."
      , rangewords:     "Unos mora sadržavati %s do %s riječi."
      , greaterthan:    "Unos mora biti veći od %s."
      , lessthan:       "Unos mora biti manji od %s."
      , beforedate:     "Odabrani datum bi trebao biti prije %s."
      , afterdate:      "Odabrani datum bi trebao biti poslije %s."
      , americandate:  "Uneseni datum mora biti u zadanom obliku (MM/DD/GGGG)."
    }
  });
}(window.jQuery || window.Zepto));
