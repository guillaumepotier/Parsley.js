// This is included with the Parsley library itself,
// thus there is no use in adding it to your project.


Parsley.addMessages('sl', {
  defaultMessage: "Podatek ne ustreza vpisnim kriterijem.",
  type: {
    email:        "Vpišite pravilen email.",
    url:          "Vpišite pravilen url naslov.",
    number:       "Vpišite številko.",
    integer:      "Vpišite celo število brez decimalnih mest.",
    digits:       "Vpišite samo cifre.",
    alphanum:     "Vpišite samo alfanumerične znake (cifre in črke)."
  },
  notblank:       "To polje ne sme biti prazno.",
  required:       "To polje je obvezno.",
  pattern:        "Podatek ne ustreza vpisnim kriterijem.",
  min:            "Vrednost mora biti višja ali enaka kot %s.",
  max:            "Vrednost mora biti nižja ali enaka kot  %s.",
  range:          "Vrednost mora biti med %s in %s.",
  minlength:      "Vpis je prekratek. Mora imeti najmanj %s znakov.",
  maxlength:      "Vpis je predolg. Lahko ima največ %s znakov.",
  length:         "Število vpisanih znakov je napačno. Število znakov je lahko samo med %s in %s.",
  mincheck:       "Izbrati morate vsaj %s možnosti.",
  maxcheck:       "Izberete lahko največ %s možnosti.",
  check:          "Število izbranih možnosti je lahko samo med %s in %s.",
  equalto:        "Vnos mora biti enak."
});

Parsley.setLocale('sl');
