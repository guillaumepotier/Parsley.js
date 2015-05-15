// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.no = jQuery.extend(window.ParsleyConfig.i18n.no || {}, {
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

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('no', window.ParsleyConfig.i18n.no, true);
