// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.he = jQuery.extend(window.ParsleyConfig.i18n.he || {}, {
  defaultMessage: "נראה כי ערך זה אינו תקף.",
  type: {
    email:        "ערך זה צריך להיות כתובת אימייל.",
    url:          "ערך זה צריך להיות URL תקף.",
    number:       "ערך זה צריך להיות מספר.",
    integer:      "ערך זה צריך להיות מספר שלם.",
    digits:       "ערך זה צריך להיות ספרתי.",
    alphanum:     "ערך זה צריך להיות אלפאנומרי."
  },
  notblank:       "ערך זה אינו יכול להשאר ריק.",
  required:       "ערך זה דרוש.",
  pattern:        "נראה כי ערך זה אינו תקף.",
  min:            "ערך זה צריך להיות לכל הפחות %s.",
  max:            "ערך זה צריך להיות לכל היותר %s.",
  range:          "ערך זה צריך להיות בין %s ל-%s.",
  minlength:      "ערך זה קצר מידי. הוא צריך להיות לכל הפחות %s תווים.",
  maxlength:      "ערך זה ארוך מידי. הוא צריך להיות לכל היותר %s תווים.",
  length:         "ערך זה אינו באורך תקף. האורך צריך להיות בין %s ל-%s תווים.",
  mincheck:       "אנא בחר לפחות %s אפשרויות.",
  maxcheck:       "אנא בחר לכל היותר %s אפשרויות.",
  check:          "אנא בחר בין %s ל-%s אפשרויות.",
  equalto:        "ערך זה צריך להיות זהה."
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('he', window.ParsleyConfig.i18n.he, true);
