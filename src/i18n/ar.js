// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.ar = $.extend(window.ParsleyConfig.i18n.ar || {}, {
  defaultMessage: "تأكد من صحة القيمة المدخل",
  type: {
    email:        "تأكد من إدخال بريد الكتروني صحيح",
    url:          "تأكد من إدخال رابط صحيح",
    number:       "تأكد من إدخال رقم",
    integer:      "تأكد من إدخال عدد صحيح بدون كسور",
    digits:       "تأكد من إدخال رقم",
    alphanum:     "تأكد من إدخال حروف وأرقام فقط"
  },
  notblank:       "تأكد من تعبئة الحقل",
  required:       "هذا الحقل مطلوب",
  pattern:        "القيمة المدخلة غير صحيحة",
  min:            "القيمة المدخلة يجب أن تكون أكبر من %s.",
  max:            "القيمة المدخلة يجب أن تكون أصغر من %s.",
  range:          "القيمة المدخلة يجب أن تكون بين %s و %s.",
  minlength:      "القيمة المدخلة قصيرة جداً . تأكد من إدخال %s حرف أو أكثر",
  maxlength:      "القيمة المدخلة طويلة . تأكد من إدخال %s حرف أو أقل",
  length:         "القيمة المدخلة غير صحيحة. تأكد من إدخال بين  %s و %s خانة",
  mincheck:       "يجب اختيار %s خيار على الأقل.",
  maxcheck:       "يجب اختيار%s خيار أو أقل",
  check:          "يجب اختيار بين %s و %s خيار.",
  equalto:        "تأكد من تطابق القيمتين المدخلة."
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('ar', window.ParsleyConfig.i18n.ar, true);
