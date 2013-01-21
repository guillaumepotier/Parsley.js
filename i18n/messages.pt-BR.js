window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
        defaultMessage: "Este valor parece ser inválido."
      , type: {
            email:      "Este valor deve ser um email válido."
          , url:        "Este valor deve ser uma URL válida."
          , urlstrict:  "Este valor deve ser uma URL válida."
          , number:     "Este valor deve ser um número válido."
          , digits:     "Este valor deve ser um dígito numérico."
          , dateIso:    "Este valor deve ser uma data válida (AAAA-MM-DD)."
          , alphanum:   "Este valor deve ser alfanumérico."
        }
      , notnull:        "Este valor não deve ser nulo."
      , notblank:       "Este valor não deve estar em branco."
      , required:       "Este valor é obrigatório."
      , regexp:         "Este valor parece ser inválido."
      , min:            "Este valor deve ser maior do que %s."
      , max:            "Este valor deve ser menor do que %s."
      , range:          "Este valor deve estar entre %s e %s."
      , minlength:      "Este valor é muito curto. Ele deve ter %s caracteres ou mais."
      , maxlength:      "Este valor é muito longo. Ele deve ter %s caracteres ou menos."
      , rangelength:    "O comprimento deste valor é inválido. Ele deve ter entre %s e %s caracteres."
      , equalto:        "Este valor deve ser o mesmo."
    }
  });
}(window.jQuery || window.Zepto));