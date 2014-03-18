// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.da = $.extend(window.ParsleyConfig.i18n.da || {}, {
  defaultMessage: "Indtast venligst en korrekt værdi.",
  type: {
    email:        "Indtast venligst en korrekt email.",
    url:          "Indtast venligst en korrekt internetadresse.",
    number:       "Indtast venligst et korrekt nummer.",
    integer:      "Indtast venligst et korrekt tal.",
    digits:       "Dette felt må kun bestå af tal.",
    alphanum:     "Dette felt skal indeholde både tal og bogstaver."
  },
  notblank:       "Dette felt må ikke være tomt.",
  required:       "Dette felt er påkrævet.",
  pattern:        "Ugyldig indtastning.",
  min:            "Dette felt skal indeholde mindst %s tegn.",
  max:            "Dette felt kan højest indeholde %s tegn.",
  range:          "Dette felt skal være mellem %s og %s tegn.",
  minlength:      "Indtast venligst mindst %s tegn.",
  maxlength:      "Dette felt kan kun indeholde %s tegn.",
  length:         "This value length is invalid. It should be between %s and %s characters long.",
  mincheck:       "Vælg mindst %s muligheder.",
  maxcheck:       "Vælg op til %s muligheder.",
  check:          "Vælg mellem %s og %s muligheder.",
  equalto:        "De to felter er ikke ens."
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('da', window.ParsleyConfig.i18n.da, true);
