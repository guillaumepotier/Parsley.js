// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n['en'] = {
  messages: {
    // parsley //////////////////////////////////////
    defaultMessage: "This value seems to be invalid.",
      type: {
        email:      "This value should be a valid email.",
        url:        "This value should be a valid url.",
        urlstrict:  "This value should be a valid url.",
        number:     "This value should be a valid number.",
        digits:     "This value should be digits.",
        dateIso:    "This value should be a valid date (YYYY-MM-DD).",
        alphanum:   "This value should be alphanumeric.",
        tel:        "This value should be a valid phone number."
      },
    notnull:        "This value should not be null.",
    notblank:       "This value should not be blank.",
    required:       "This value is required.",
    pattern:        "This value seems to be invalid.",
    min:            "This value should be greater than or equal to %s.",
    max:            "This value should be lower than or equal to %s.",
    range:          "This value should be between %s and %s.",
    minlength:      "This value is too short. It should have %s characters or more.",
    maxlength:      "This value is too long. It should have %s characters or less.",
    length:         "This value length is invalid. It should be between %s and %s characters long.",
    mincheck:       "You must select at least %s choices.",
    maxcheck:       "You must select %s choices or less.",
    check:          "You must select between %s and %s choices.",
    equalto:        "This value should be the same."
  }
};
