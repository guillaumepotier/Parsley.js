// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n['pt-br'] = $.extend(window.ParsleyConfig.i18n['pt-br'] || {}, {
  defaultMessage: "This value seems to be invalid.",
  type: {
    email:        "Esse campo deve ser um email válido.",
    url:          "Esse campo deve ser uma url válida.",
    number:       "Esse campo deve ser um número válido.",
    integer:      "Esse campo deve ser um inteiro válido.",
    digits:       "Esse campo deve conter apenas dígitos.",
    alphanum:     "Esse campo deve ser alfa numérico."
  },
  notblank:       "Esse campo não pode ficar vazio.",
  required:       "Esse campo é obrigatório.",
  pattern:        "Esse campo parece estar inválido.",
  min:            "Esse campo deve ser maior ou igual a %s.",
  max:            "Esse campo deve ser menor ou igual a %s.",
  range:          "Esse campo deve estar entre %s e %s.",
  minlength:      "Esse campo é pequeno demais. Ele deveria ter %s characteres ou mais.",
  maxlength:      "Esse campo grande demais. Ele deveri ter %s characteres ou menos.",
  length:         "O tamanho desse campo é inválido. Ele deveria ter entre %s e %s characteres.",
  mincheck:       "Você deve escolher pelo menos %s opções.",
  maxcheck:       "Você deve escolher %s opções ou mais",
  check:          "Você deve escolher entre %s e %s opções.",
  equalto:        "Este valor deveria ser igual."
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('pt-br', window.ParsleyConfig.i18n['pt-br'], true);
