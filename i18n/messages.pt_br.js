window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
        defaultMessage: "Este valor parece estar inválido."
      , type: {
            email:      "Este valor deve ser um e-mail válido."
          , url:        "Este valor deve ser uma URL válida."
          , urlstrict:  "Este valor deve ser uma URL válida."
          , number:     "Este valor deve ser um número válido."
          , digits:     "Este valor deve ser um dígito válido."
          , dateIso:    "Este valor deve ser uma data válida (YYYY-MM-DD)."
          , alphanum:   "Este valor deve ser alfanumérico."
        }
      , notnull:        "Este valor não deve ser nulo."
      , notblank:       "Este valor não deve ser branco."
      , required:       "Este valor é obrigatório."
      , regexp:         "Este valor parece estar inválido."
      , min:            "Este valor deve ser maior que %s."
      , max:            "Este valor deve ser menor que %s."
      , range:          "Este valor deve estar entre %s e %s."
      , minlength:      "Este valor é muito pequeno. Ele deve ter %s caracteres ou mais."
      , maxlength:      "Este valor é muito grande. Ele deve ter %s caracteres ou menos."
      , rangelength:    "O tamanho deste valor é inválido. Ele deve possuir entre %s e %s caracteres."
      , equalto:        "Este valor deve ser o mesmo."
      , minwords:       "Este valor deve possuir no mínimo %s palavras."
      , maxwords:       "Este valor deve possuir no máximo %s palavras."
      , rangewords:     "Este valor deve possuir entre %s e %s palavras."
    }
  });
}(window.jQuery || window.Zepto));