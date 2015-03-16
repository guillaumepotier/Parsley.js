// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.tr = jQuery.extend(window.ParsleyConfig.i18n.tr || {}, {
  defaultMessage: "Bu değer geçerli değil.",
  type: {
    email:        "Geçerli bir e-posta adresi yazınız.",
    url:          "Geçerli bir bağlantı adresi yazınız.",
    number:       "Geçerli bir sayı yazınız.",
    integer:      "Geçerli bir tamsayı yazınız.",
    digits:       "Geçerli bir rakam yazınız.",
    alphanum:     "Geçerli bir alfanümerik değer yazınız."
  },
  notblank:       "Bu alan boş bırakılmamalıdır.",
  required:       "Bu alan gereklidir.",
  pattern:        "Girdiğiniz değer geçerli değil.",
  min:            "Bu alan %s değerinden büyük ya da eşit olmalıdır.",
  max:            "Bu alan %s değerinden küçük ya da eşit olmalıdır.",
  range:          "Bu alan %s ve %s değerleri arasında olmalıdır.",
  minlength:      "Girdiğiniz değer çok kısa. Bu alan %s değerine eşit ya da fazla olmalıdır.",
  maxlength:      "Girdiğiniz değer çok uzun. Bu alan %s değerine eşit ya da az olmalıdır.",
  length:         "Girdiğiniz değerin uzunluğu geçersiz. Bu alanın uzunluğu %s ve %s arasında olmalıdır.",
  mincheck:       "En az %s adet seçim yapmalısınız.",
  maxcheck:       "En fazla %s ya da daha az seçim yapmalısınız.",
  check:          "Bu alan için en az %s en fazla %s seçim yapmalısınız.",
  equalto:        "Bu alanın değeri aynı olmalıdır."
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('tr', window.ParsleyConfig.i18n.tr, true);
