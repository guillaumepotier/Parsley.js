// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n['pt-pt'] = jQuery.extend(window.ParsleyConfig.i18n['pt-pt'] || {}, {
  defaultMessage: "Este valor parece ser inválido.",
  type: {
    email:        "Este campo deve ser um email válido.",
    url:          "Este campo deve ser um URL válido.",
    number:       "Este campo deve ser um número válido.",
    integer:      "Este campo deve ser um número inteiro válido.",
    digits:       "Este campo deve conter apenas dígitos.",
    alphanum:     "Este campo deve ser alfanumérico."
  },
  notblank:       "Este campo não pode ficar vazio.",
  required:       "Este campo é obrigatório.",
  pattern:        "Este campo parece estar inválido.",
  min:            "Este valor deve ser maior ou igual a %s.",
  max:            "Este valor deve ser menor ou igual a %s.",
  range:          "Este valor deve estar entre %s e %s.",
  minlength:      "Este campo é pequeno demais. Deve ter %s caracteres ou mais.",
  maxlength:      "Este campo é grande demais. Deve ter %s caracteres ou menos.",
  length:         "O tamanho deste campo é inválido. Ele deveria ter entre %s e %s caracteres.",
  mincheck:       "Escolha pelo menos %s opções.",
  maxcheck:       "Escolha %s opções ou mais",
  check:          "Escolha entre %s e %s opções.",
  equalto:        "Este valor deveria ser igual."
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('pt-pt', window.ParsleyConfig.i18n['pt-pt'], true);
