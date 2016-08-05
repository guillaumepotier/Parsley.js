// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('eu', {
  defaultMessage: "Balio hau baliogabekoa dirudi.",
  type: {
    email:        "Balio honek posta balioduna izan behar da.",
    url:          "Balio honek URL balioduna izan behar da.",
    number:       "Balio honek zenbaki balioduna izan behar da.",
    integer:      "Balio honek zenbaki balioduna izan behar da.",
    digits:       "Balio honek digitu balioduna izan behar da.",
    alphanum:     "Balio honek alfanumerikoa izan behar da."
  },
  notblank:       "Balio honek ezin da hutsik egon.",
  required:       "Balio hau nahitaezkoa da.",
  pattern:        "Balio hau ez da zuzena.",
  min:            "Balio honek %s baino baxuagoa ezin da izan.",
  max:            "Balio honek %s baino altuagoa ezin da izan.",
  range:          "Balio honek %s eta %s artean egon behar da.",
  minlength:      "Balio hau oso motza da. Gutxienezko luzera %s karakteretakoa da.",
  maxlength:      "Balio hau oso luzea da. Gehienezko luzera %s karakteretakoa da.",
  length:         "Balio honen luzera %s eta %s karaketere artean egon behar da.",
  mincheck:       "%s aukera hautatu behar dituzu gutxienez.",
  maxcheck:       "%s aukera edo gutxiago hautatu behar dituzu.",
  check:          "%s eta %s aukeren artean hautatu behar duzu.",
  equalto:        "Balio honek berbera izan behar da."
});

Parsley.setLocale('eu');
