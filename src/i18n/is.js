// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('is', {
  defaultMessage: "Þessi reitur virðist vera ógildur.",
  type: {
    email:        "Þessi reitur ætti að vera gilt netfang.",
    url:          "Þessi reitur ætti að vera gild vefslóð.",
    number:       "Þessi reitur ætti að vera gild tala.",
    integer:      "Þessi reitur ætti að vera gild heiltala.",
    digits:       "Þessi reitur má aðeins innihalda tölur.",
    alphanum:     "Þessi reitur má aðeins innihalda tölur og bókstafi"
  },
  notblank:       "Þessi reitur ætti ekki að vera tómur.",
  required:       "Þennan reit þarf að fylla út.",
  pattern:        "Þessi reitur virðist vera ógildur.",
  min:            "Þessi reitur ætti að vera minnst %s stafir.",
  max:            "Þessi reitur ætti að vera mest %s stafir.",
  range:          "Þessi reitur ætti að vera á milli %s og %s stafir.",
  minlength:      "Þessi reitur ætti að vera %s stafir eða meira.",
  maxlength:      "Þessi reitur ætti að vera %s stafir eða færri.",
  length:         "Þessi reitur ætti að vera á milli %s og %s stafa langur.",
  mincheck:       "Þú þarft að velja að minnsta kosti %s valkosti.",
  maxcheck:       "Þú þarft að velja %s valkosti eða færri.",
  check:          "Þú þarft að velja á milli %s og %s valkosti.",
  equalto:        "Þessir reitir ættu að vera eins."
});

Parsley.setLocale('is');
