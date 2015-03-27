// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.ro = jQuery.extend(window.ParsleyConfig.i18n.ro || {}, {
  defaultMessage: "Acest câmp nu este completat corect.",
  type: {
    email:        "Trebuie să scrii un email valid.",
    url:          "Trebuie să scrii un link valid",
    number:       "Trebuie să scrii un număr valid",
    integer:      "Trebuie să scrii un număr întreg valid",
    digits:       "Trebuie să conțină doar cifre.",
    alphanum:     "Trebuie să conțină doar cifre sau litere."
  },
  notblank:       "Acest câmp nu poate fi lăsat gol.",
  required:       "Acest câmp trebuie să fie completat.",
  pattern:        "Acest câmp nu este completat corect.",
  min:            "Trebuie să fie ceva mai mare sau egal cu %s.",
  max:            "Trebuie să fie ceva mai mic sau egal cu %s.",
  range:          "Valoarea trebuie să fie între %s și %s.",
  minlength:      "Trebuie să scrii cel puțin %s caractere.",
  maxlength:      "Trebuie să scrii cel mult %s caractere.",
  length:         "Trebuie să scrii cel puțin %s și %s cel mult %s caractere.",
  mincheck:       "Trebuie să alegi cel puțin %s opțiuni.",
  maxcheck:       "Poți alege maxim %s opțiuni.",
  check:          "Trebuie să alegi între %s sau %s.",
  equalto:        "Trebuie să fie la fel."
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('ro', window.ParsleyConfig.i18n.ro, true);
