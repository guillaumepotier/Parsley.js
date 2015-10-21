// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('no', {
  defaultMessage: "Verdien er ugyldig.",
  type: {
    email:        "Verdien må være en gyldig e-post.",
    url:          "Verdien må være en gyldig url.",
    number:       "Verdien må være et gyldig tall.",
    integer:      "Verdien må være et gyldig heltall.",
    digits:       "Verdien må være et siffer",
    alphanum:     "Verdien må være alfanumerisk"
  },
  notblank:       "Verdien må ikke være blank.",
  required:       "Verdien er obligatorisk.",
  pattern:        "Verdien er ugyldig.",
  min:            "Verdien må være større eller lik %s.",
  max:            "Verdien må være mindre eller lik %s.",
  range:          "Verdien må være mellom %s and %s.",
  minlength:      "Verdien er for kort. Den burde bestå av minst %s tegn.",
  maxlength:      "Verdien er for lang. Den kan bestå av maksimalt %s tegn.",
  length:         "Verdilengden er ugyldig. Den må være mellom %s og %s tegn lang.",
  mincheck:       "Du må huke av minst %s valg.",
  maxcheck:       "Du må huke av %s valg eller mindre.",
  check:          "Du må huke av mellom %s og %s valg.",
  equalto:        "Verdien må være lik."
});

Parsley.setLocale('no');
