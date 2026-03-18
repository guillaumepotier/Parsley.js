// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('ro', {
  defaultMessage: "Acest câmp nu este completat corect.",
  type: {
    email:        "Trebuie să scrii un email valid.",
    url:          "Trebuie să scrii un URL valid.",
    number:       "Trebuie să scrii un număr valid.",
    integer:      "Trebuie să scrii un număr întreg valid.",
    digits:       "Trebuie să conțină doar cifre.",
    alphanum:     "Trebuie să conțină doar cifre sau litere."
  },
  notblank:       "Acest câmp nu poate fi lăsat gol.",
  required:       "Acest câmp trebuie să fie completat.",
  pattern:        "Acest câmp nu este completat corect.",
  min:            "Trebuie să fie mai mare sau egal cu %s.",
  max:            "Trebuie să fie mai mic sau egal cu %s.",
  range:          "Valoarea trebuie să fie între %s și %s.",
  minlength:      "Trebuie să scrii cel puțin %s caractere.",
  maxlength:      "Trebuie să scrii cel mult %s caractere.",
  length:         "Trebuie să scrii între %s și %s caractere.",
  mincheck:       "Trebuie să alegi cel puțin %s opțiuni.",
  maxcheck:       "Poți alege maxim %s opțiuni.",
  check:          "Trebuie să alegi între %s sau %s.",
  equalto:        "Trebuie să fie la fel."
});

Parsley.setLocale('ro');
