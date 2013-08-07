/**
* /!\ This file is just an example template to create/update your own language file /!\
*/

window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "欄位不正確"
        , type: {
            email:      "欄位不是正確的 Email "
          , url:        "欄位不是正確的 URL "
          , urlstrict:  "欄位不是正確的 URL "
          , number:     "欄位不是合法的數字"
          , digits:     "欄位不是單獨的数字"
          , dateIso:    "欄位不是正確的日期格式(YYYY-MM-DD)."
          , alphanum:   "欄位只能包含英文字母和數字"
        }
      , notnull:        "欄位不可為 null"
      , notblank:       "欄位不可留空"
      , required:       "此為必填欄位"
      , regexp:         "欄位不合法"
      , min:            "欄位應該大於 %s"
      , max:            "欄位應該小於 %s."
      , range:          "欄位應該大於 %s 並小於 %s."
      , minlength:      "欄位過短，長度應該大於等於 %s"
      , maxlength:      "欄位過長，長度應該小於等於 %s"
      , rangelength:    "欄位長度錯誤，應該在 %s 和 %s 之間"
      , mincheck:       "至少要選擇 %s 個選項"
      , maxcheck:       "最多只能選擇 %s 個選項"
      , rangecheck:     "你只能選擇 %s 到 %s 個選項"
      , equalto:        "欄位的值不一致"

      // parsley.extend ///////////////////////////////
    }
  });
}(window.jQuery || window.Zepto));
