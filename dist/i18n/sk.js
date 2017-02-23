// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('sk', {
  defaultMessage: "Prosím zadajte správnu hodnotu.",
  type: {
    email:        "Prosím zadajte správnu emailovú adresu.",
    url:          "Prosím zadajte platnú URL adresu.",
    number:       "Toto pole môže obsahovať len čísla",
    integer:      "Toto pole môže obsahovať len celé čísla",
    digits:       "Toto pole môže obsahovať len kladné celé čísla.",
    alphanum:     "Toto pole môže obsahovať len alfanumerické znaky."
  },
  notblank:       "Toto pole nesmie byť prázdne.",
  required:       "Toto pole je povinné.",
  pattern:        "Toto pole je je neplatné.",
  min:            "Prosím zadajte hodnotu väčšiu alebo rovnú %s.",
  max:            "Prosím zadajte hodnotu menšiu alebo rovnú %s.",
  range:          "Prosím zadajte hodnotu v rozmedzí %s a %s",
  minlength:      "Prosím zadajte hodnotu dlhú %s znakov a viacej.",
  maxlength:      "Prosím zadajte hodnotu kratšiu ako %s znakov.",
  length:         "Prosím zadajte hodnotu medzi %s a %s znakov.",
  mincheck:       "Je nutné vybrať minimálne %s z možností.",
  maxcheck:       "Je nutné vybrať maximálne %s z možností.",
  check:          "Je nutné vybrať od %s do %s z možností.",
  equalto:        "Prosím zadajte rovnakú hodnotu."
});

Parsley.setLocale('sk');
