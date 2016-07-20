// This is included with the Parsley library itself,
// thus there is no use in adding it to your project.
import Parsley from '../parsley/main';

Parsley.addMessages('hu', {
  defaultMessage: "Érvénytelen mező.",
  type: {
    email:        "Érvénytelen email cím.",
    url:          "Érvénytelen URL cím.",
    number:       "Érvénytelen szám.",
    integer:      "Érvénytelen egész szám.",
    digits:       "Érvénytelen szám.",
    alphanum:     "Érvénytelen alfanumerikus érték."
  },
  notblank:       "Ez a mező nem maradhat üresen.",
  required:       "A mező kitöltése kötelező.",
  pattern:        "Érvénytelen érték.",
  min:            "A mező értéke nagyobb vagy egyenlő kell legyen mint %s.",
  max:            "A mező értéke kisebb vagy egyenlő kell legyen mint %s.",
  range:          "A mező értéke %s és %s közé kell essen.",
  minlength:      "Legalább %s karakter megadása szükséges.",
  maxlength:      "Legfeljebb %s karakter megadása engedélyezett.",
  length:         "Nem megfelelő karakterszám. Minimum %s, maximum %s karakter adható meg.",
  mincheck:       "Legalább %s értéket kell kiválasztani.",
  maxcheck:       "Maximum %s értéket lehet kiválasztani.",
  check:          "Legalább %s, legfeljebb %s értéket kell kiválasztani.",
  equalto:        "A mező értéke nem egyező."
});

Parsley.setLocale('hu');
