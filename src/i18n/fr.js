window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n['fr'] = {
  messages: {
    // parsley //////////////////////////////////////
    defaultMessage: "Cette valeur semble non valide.",
      type: {
        email:      "Cette valeur n'est pas une adresse email valide.",
        url:        "Cette valeur n'est pas une URL valide.",
        urlstrict:  "Cette valeur n'est pas une URL valide.",
        number:     "Cette valeur doit être un nombre.",
        digits:     "Cette valeur doit être numérique.",
        dateIso:    "Cette valeur n'est pas une date valide (YYYY-MM-DD).",
        alphanum:   "Cette valeur doit être alphanumérique.",
        tel:        "Cette valeur doit être un numéro de téléphone valide."
      },
      notnull:      "Cette valeur ne peut pas être nulle.",
      notblank:     "Cette valeur ne peut pas être vide.",
      required:     "Ce champ est requis.",
      pattern:      "Cette valeur semble non valide.",
      min:          "Cette valeur ne doit pas être inféreure à %s.",
      max:          "Cette valeur ne doit pas excéder %s.",
      range:        "Cette valeur doit être comprise entre %s et %s.",
      minlength:    "Cette chaîne est trop courte. Elle doit avoir au minimum %s caractères.",
      maxlength:    "Cette chaîne est trop longue. Elle doit avoir au maximum %s caractères.",
      length:       "Cette valeur doit contenir entre %s et %s caractères.",
      equalto:      "Cette valeur devrait être identique.",
      mincheck:     "Vous devez sélectionner au moins %s choix.",
      maxcheck:     "Vous devez sélectionner %s choix maximum.",
      rangecheck:   "Vous devez sélectionner entre %s et %s choix."
    }
};

