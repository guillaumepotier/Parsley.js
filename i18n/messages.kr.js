/**
* /!\ This file is just an example template to create/update your own language file /!\
*/

window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "입력하신 값이 올바르지 않습니다."
        , type: {
            email:      "입력하신 이메일이 형식에 맞지 않습니다."
          , url:        "정확한 URL을 입력해주시기 바랍니다."
          , urlstrict:  "정확한 URL을 입력해주시기 바랍니다."
          , number:     "숫자만 입력하시기 바랍니다."
          , digits:     "숫자만 입력하시기 바랍니다."
          , dateIso:    "정확한 날짜를 입력하시기 바랍니다.(YYYY-MM-DD)"
          , alphanum:   "영문자만 입력하시기 바랍니다."
          , phone:      "정확한 핸드폰 번호를 입력하시기 바랍니다."
        }
      , notnull:        "Null값은 입력하실 수 없습니다."
      , notblank:       "값이 비어있을 수는 없습니다."
      , required:       "필수로 입력해야 합니다."
      , regexp:         "입력하신 값이 올바르지 않은 것 같습니다."
      , min:            "입력하신 숫자는 %s보다 많아야합니다."
      , max:            "입력하신 숫자는 %s보다 적어야 합니다."
      , range:          "입력하신 숫자는 %s-%s 사이여야 합니다."
      , minlength:      "입력하신 값이 너무 짧습니다. %s자 이상 입력하시기 바랍니다."
      , maxlength:      "입력하신 값이 너무 깁니다. %s자 이하로 입력하시기 바랍니다."
      , rangelength:    "입력하신 값은 %s-%s자 사이여야 합니다."
      , mincheck:       "적어도 %s개를 선택하셔야 합니다."
      , maxcheck:       "%s보다 적게 선택하셔야 합니다."
      , rangecheck:     "%s-%s사이로 선택하셔야합니다."
      , equalto:        "입력하신 값이 동일하지 않습니다."

      // parsley.extend ///////////////////////////////
      , minwords:       "적어도 %s개의 단어를 입력하셔야 합니다."
      , maxwords:       "최대 %s개의 단어를 입력하실 수 있습니다."
      , rangewords:     "%s-%s개의 단어를 입력하실 수 있습니다."
      , greaterthan:    "입력하신 숫자는 %s보다 커야 합니다."
      , lessthan:       "입력하신 숫자는 %s보다 작아야 합니다."
      , beforedate:     "입력하신 날짜가 %s보다 이전 날짜여야 합니다."
      , afterdate:      "입력하신 날짜가 %s보다 이후 날짜여야 합니다."
      , americandate:	"정확한 날짜를 입력하시기 바랍니다. (MM/DD/YYYY)."
    }
  });
}(window.jQuery || window.Zepto));