window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Este valor parece estar inválido."
      , type: {
          email:      "Este valor deve ser um e-mail válido."
        , url:        "Este valor deve ser uma URL válida."
        , urlstrict:  "Este valor deve ser uma URL válida."
        , number:     "Este valor deve ser um número válido."
        , digits:     "Este valor deve ser um dígito válido."
        , dateIso:    "Este valor deve ser uma data válida (YYYY-MM-DD)."
        , alphanum:   "Este valor deve ser alfanumérico."
        , phone:      "Este valor deve ser um número telefone válido."
      }
      , notnull:        "Este valor não deve ser nulo."
      , notblank:       "Este valor não deve ser branco."
      , required:       "Este valor é obrigatório."
      , regexp:         "Este valor parece estar inválido."
      , min:            "Este valor deve ser maior ou igual a %s."
      , max:            "Este valor deve ser menor ou igual a %s."
      , range:          "Este valor deve estar entre %s e %s."
      , minlength:      "Este valor é muito pequeno. Ele deve ter %s caracteres ou mais."
      , maxlength:      "Este valor é muito grande. Ele deve ter %s caracteres ou menos."
      , rangelength:    "O tamanho deste valor é inválido. Ele deve possuir entre %s e %s caracteres."
      , mincheck:       "Você deve selecionar pelo menos %s opções."
      , maxcheck:       "Você deve selecionar %s opções ou menos."
      , rangecheck:     "Você deve selecionar entre %s e %s opções."
      , equalto:        "Este valor deve ser o mesmo."
      // parsley.extend ///////////////////////////////
      , minwords:       "Este valor deve possuir no mínimo %s palavras."
      , maxwords:       "Este valor deve possuir no máximo %s palavras."
      , rangewords:     "Este valor deve possuir entre %s e %s palavras."
      , greaterthan:    "Este valor deve ser maior que %s."
      , lessthan:       "Este valor deve ser menor que %s."
      , beforedate:     "Esta data deve ser anterior a %s."
      , afterdate:      "Esta data deve ser posterior a %s."
    }
  });
}(window.jQuery || window.Zepto));
