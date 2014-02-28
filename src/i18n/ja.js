// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.ja = $.extend(window.ParsleyConfig.i18n.ja || {}, {
  defaultMessage: "無効な値です。",
  type: {
    email:        "正しいメールアドレスを入力してください。",
    url:          "正しいURLを入力してください。",
    number:       "正しい数字を入力してください。",
    integer:      "正しい数値を入力してください。",
    digits:       "正しい桁数で入力してください。",
    alphanum:     "正しい英数字を入力してください。"
  },
  notblank:       "この値を入力してください",
  required:       "この値は必須です。",
  pattern:        "この値は無効です。",
  min:            "%s 以上の値にしてください。",
  max:            "%s 以下の値にしてください。",
  range:          "%s から %s の値にしてください。",
  minlength:      "%s 文字以上で入力してください。",
  maxlength:      "%s 文字以下で入力してください。",
  length:         "%s から %s 文字の間で入力してください。",
  mincheck:       "%s 個以上選択してください。",
  maxcheck:       "%s 個以下選択してください。",
  check:          "%s から %s 個選択してください。",
  equalto:        "値が違います。"
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('ja', window.ParsleyConfig.i18n.ja, true);
