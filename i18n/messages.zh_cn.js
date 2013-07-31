/**
* /!\ This file is just an example template to create/update your own language file /!\
*/

window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "不正确的值"
        , type: {
            email:      "字段值应该是一个正确的电子邮件地址"
          , url:        "字段值应该是一个正确的URL地址"
          , urlstrict:  "字段值应该是一个正确的URL地址"
          , number:     "字段值应该是一个合法的数字"
          , digits:     "字段值应该是一个单独的数字"
          , dateIso:    "字段值应该是一个正确的日期描述(YYYY-MM-DD)."
          , alphanum:   "字段值应该是只包含字母和数字"
        }
      , notnull:        "字段值不可为null"
      , notblank:       "字段值不可为空"
      , required:       "字段值是必填的"
      , regexp:         "字段值不合法"
      , min:            "字段值应该大于 %s"
      , max:            "字段值应该小于 %s."
      , range:          "字段值应该大于 %s 并小于 %s."
      , minlength:      "字段值太短了，长度应该大于等于 %s 个字符"
      , maxlength:      "字段值太长了，长度应该小于等于 %s 个字符"
      , rangelength:    "字段值长度错了，长度应该在 %s 和 %s 个字符之间"
      , mincheck:       "你至少要选择 %s 个选项"
      , maxcheck:       "你最多只能选择 %s 个选项"
      , rangecheck:     "你只能选择 %s 到 %s 个选项"
      , equalto:        "字段值应该和给定的值一样"

      // parsley.extend ///////////////////////////////
      , minwords:       "字段值应该至少有 %s 个词"
      , maxwords:       "字段值最多只能有 %s 个词"
      , rangewords:     "字段值应该有 %s 到 %s 个词"
      , greaterthan:    "字段值应该大于 %s"
      , lessthan:       "字段值应该小于 %s"
      , beforedate:     "字段值所表示的日期应该早于 %s."
      , afterdate:      "字段值所表示的日期应该晚于 %s."
    }
  });
}(window.jQuery || window.Zepto));
