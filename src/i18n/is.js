// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('is', {
  defaultMessage: "Gildið virðist vera ógilt.",
  type: {
    email:        "Þetta gildi ætti að vera gilt netfang.",
    url:          "Þetta gildi ætti að vera gild vefslóð.",
    number:       "Þetta gildi ætti að vera gild tala.",
    integer:      "Þetta gildi ætti að vera gild heiltala.",
    digits:       "Þetta gildi ætti að vera tölur.",
    alphanum:     "Þetta gildi ætti að vera ritstafrænt"
  },
  notblank:       "Þetta gildi ætti ekki að vera tómt.",
  required:       "Þessa gildis er krafist.",
  pattern:        "Gildið virðist vera ógilt.",
  min:            "Þetta gildi ætti að vera stærra en eða jafnt og %s.",
  max:            "Þetta gildi ætti að vera minna en eða jafnt og %s.",
  range:          "Þetta gildi ætti að vera á milli %s og %s.",
  minlength:      "Þetta gildi er of stutt. Það ætti að vera %s stafir eða meira.",
  maxlength:      "Þetta gildi er of langt. Það ætti að vera %s stafir eða færri.",
  length:         "Lengd þessa gildis er ógild. Hún ætti að vera á milli %s og %s stafa löng.",
  mincheck:       "Þú þarft að velja að minnsta kosti %s valkosti.",
  maxcheck:       "Þú þarft að velja %s valkosti eða færri.",
  check:          "Þú þarft að velja á milli %s og %s valkosti.",
  equalto:        "Þetta gildi ætti að vera eins."
});

Parsley.setLocale('is');
