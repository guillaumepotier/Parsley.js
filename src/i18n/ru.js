//Parsley localization for Russian language
//Evgeni Makarov
//github.com/emakarov


// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.ru = $.extend(window.ParsleyConfig.i18n.ru || {}, {
  defaultMessage: "Некорректное значение.",
  type: {
    email:        "Введите адрес электронной почты.",
    url:          "Введите URL адрес.",
    number:       "Введите число.",
    integer:      "Введите целое число.",
    digits:       "Введите только цифры.",
    alphanum:     "Введите буквенно-цифровое значение."
  },
  notblank:       "Это поле должно быть заполнено.",
  required:       "Обязательное поле.",
  pattern:        "Это значение некорректно.",
  min:            "Это значение должно быть не менее чем %s.",
  max:            "Это значение должно быть не более чем %s.",
  range:          "Это значение должно быть в интервале от %s до %s.",
  minlength:      "Введите не менее %s символов.",
  maxlength:      "Введите не более %s символов.",
  length:         "Длина строки должна быть от %s до %s символов.",
  mincheck:       "Выберите не менее %s значений.",
  maxcheck:       "Выберите не более %s значений.",
  check:          "Выберите от %s до %s значений.",
  equalto:        "Это значение должно совпадать."
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('ru', window.ParsleyConfig.i18n.ru, true);
