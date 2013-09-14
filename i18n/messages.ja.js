window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "正しい値を入力してください。"
        , type: {
            email:      "正しいメールアドレスを入力してください。"
          , url:        "正しい URL を入力してください。"
          , urlstrict:  "完全な URL を入力してください。"
          , number:     "正しい数値を入力してください。"
          , digits:     "整数を入力してください。"
          , dateIso:    "正しい形式 (YYYY-MM-DD) の日付を入力してください。"
          , alphanum:   "半角英数字で入力してください。"
          , phone:      "正しい電話番号を入力してください。"
        }
      , notnull:        "値を入力してください。"
      , notblank:       "空白以外の値を入力してください。"
      , required:       "このフィールドを入力してください。"
      , regexp:         "正しい値を入力してください。"
      , min:            "%s 以上の数値を入力してください。"
      , max:            "%s 以下の数値を入力してください。"
      , range:          "%s 以上 %s 以下の数値を入力してください。"
      , minlength:      "値が短すぎます。%s 文字以上で入力してください。"
      , maxlength:      "値が長すぎます。%s 文字以下で入力してください。"
      , rangelength:    "値の長さが正しくありません。%s 文字以上 %s 文字以下で入力してください。"
      , mincheck:       "%s 個以上を選択してください。"
      , maxcheck:       "%s 個以下を選択してください。"
      , rangecheck:     "%s 個以上 %s 個以下を選択してください。"
      , equalto:        "同じ値を入力してください。"

      // parsley.extend ///////////////////////////////
      , minwords:       "%s 語以上で入力してください。"
      , maxwords:       "%s 語以下で入力してください。"
      , rangewords:     "%s 語以上 %s 語以下で入力してください。"
      , greaterthan:    "%s より大きい数値を入力してください。"
      , lessthan:       "%s より小さい数値を入力してください。"
      , beforedate:     "%s より前の日付を入力してください。"
      , afterdate:      "%s より後の日付を入力してください。"
    }
  });
}(window.jQuery || window.Zepto));
