// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};

// Define then the messages
window.ParsleyConfig.i18n.zh_tw = $.extend(window.ParsleyConfig.i18n.zh_tw || {}, {
  defaultMessage: "這個值似乎是無效的。",
  type: {
    email:        "請輸入一個有效的email。",
    url:          "請輸入一個有效的網址。",
    number:       "這個值應該是一個數字。",
    integer:      "這個值應該是一個整數數字。",
    digits:       "這個值應該是一個號碼。",
    alphanum:     "這個值應該是字母或數字。"
  },
  notblank:       "這個值不應該為空值。",
  required:       "這個空格必須填寫。",
  pattern:        "這個值似乎是無效的。",
  min:            "輸入的值應該大於或等於 %s",
  max:            "輸入的值應該小於或等於 %s",
  range:          "這個值應該在 %s 和 %s 之間。",
  minlength:      "這個值至少要 %s 字元。",
  maxlength:      "這個值最多要 %s 字元。",
  length:         "字元長度應該在 %s 和 %s",
  mincheck:       "你至少要選擇 %s 個項目。",
  maxcheck:       "你最多可選擇 %s 個項目。",
  check:          "你必須選擇 %s 到 %s 個項目。",
  equalto:        "輸入值不同"
});

// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('zh_tw', window.ParsleyConfig.i18n.zh_tw, true);
