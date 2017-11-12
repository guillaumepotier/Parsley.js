// Validation errors messages for Parsley
import Parsley from '../parsley';

Parsley.addMessages('tk', {
  defaultMessage: "Bu maglumat nädogry.",
  type: {
    email:        "Dogry e-poçta adresi ýazmaly.",
    url:          "Dogry web sahypa salgysy ýazmaly.",
    number:       "Dogry san ýazmaly.",
    integer:      "Dogry bitin san ýazmaly.",
    digits:       "San ýazmaly.",
    alphanum:     "San ýa-da harp ýazmaly."
  },
  notblank:       "Bu ýeri boş goýmaly däl.",
  required:       "Bu ýeri doldurmak hökmany.",
  pattern:        "Bu maglumat nädogry.",
  min:            "Iň azyndan %s ýa-da ondan uly bolmaly.",
  max:            "Iň köp %s ýa-da ondan kiçi bolmaly.",
  range:          "Bu ýer %s we %s aralygynda san bolmaly.",
  minlength:      "Bu ýeriň uzynlygy iň azyndan %s harp ýa-da ondan köp bolmaly.",
  maxlength:      "Bu ýeriň uzynlygy iň köp %s harp ýa-da ondan az bolmaly.",
  length:         "Bu ýeriň uzynlygy %s we %s harp aralygynda bolmaly.",
  mincheck:       "Iň azyndan %s sanysyny saýlamaly.",
  maxcheck:       "Iň köp %s sanysyny saýlamaly.",
  check:          "Iň az %s, iň köp %s sanysyny saýlamaly.",
  equalto:        "Bu maglumat deň bolmaly."
});

Parsley.setLocale('tk');
