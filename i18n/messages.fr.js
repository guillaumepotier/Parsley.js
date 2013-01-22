window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
        defaultMessage: "Cette valeur semble non valide."
      , type: {
            email:      "Cette valeur n'est pas une adresse email valide."
          , url:        "Cette valeur n'est pas une URL valide."
          , urlstrict:  "Cette valeur n'est pas une URL valide."
          , number:     "Cette valeur doit être un nombre."
          , digits:     "Cette valeur doit être numérique."
          , dateIso:    "Cette valeur n'est pas une date valide (YYYY-MM-DD)."
          , alphanum:   "Cette valeur doit être alphanumérique."
        }
      , notnull:        "Cette valeur ne peux pas être nulle."
      , notblank:       "Cette valeur ne peux pas être vide."
      , required:       "Ce champ est requis."
      , regexp:         "Cette valeur semble non valide."
      , min:            "Cette valeur ne doit pas être inféreure à %s."
      , max:            "Cette valeur ne doit pas excéder %s."
      , range:          "Cette valeur doit être comprise entre %s et %s."
      , minlength:      "Cette chaîne est trop courte. Elle doit avoir au minimum %s caractères."
      , maxlength:      "Cette chaîne est trop longue. Elle doit avoir au maximum %s caractères."
      , rangelength:    "Cette valeur doit contenir entre %s et %s caractères."
      , equalto:        "Cette valeur devrait être identique."
    }
  });
}(window.jQuery || window.Zepto));
