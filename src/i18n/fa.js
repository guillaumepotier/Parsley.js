// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.fa = $.extend(window.ParsleyConfig.i18n.fa || {}, {
  defaultMessage: "این مقدار صحیح نمی باشد",
  type: {
    email:        "این مقدار باید یک ایمیل معتبر باشد",
    url:          "این مقدار باید یک آدرس معتبر باشد",
    number:       "این مقدار باید یک عدد معتبر باشد",
    integer:      "این مقدار باید یک عدد صحیح معتبر باشد",
    digits:       "این مقدار باید یک عدد باشد",
    alphanum:     "این مقدار باید حروف الفبا باشد"
  },
  notblank:       "این مقدار نباید خالی باشد",
  required:       "این مقدار باید وارد شود",
  pattern:        "این مقدار به نظر می رسد نامعتبر است",
  min:            "این مقدیر باید بزرگتر با مساوی %s باشد",
  max:            "این مقدار باید کمتر و یا مساوی %s باشد",
  range:          "این مقدار باید بین %s و %s باشد",
  minlength:      "این مقدار بیش از حد کوتاه است. باید %s کاراکتر یا بیشتر باشد.",
  maxlength:      "این مقدار بیش از حد طولانی است. باید %s کاراکتر یا کمتر باشد.",
  length:         "این مقدار نامعتبر است و باید بین %s و %s باشد",
  mincheck:       "شما حداقل باید %s گزینه را انتخاب کنید.",
  maxcheck:       "شما حداکثر می‌توانید %s انتخاب داشته باشید.",
  check:          "باید بین %s و %s مورد انتخاب کنید",
  equalto:        "این مقدار باید یکسان باشد"
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('fa', window.ParsleyConfig.i18n.fa, true);
