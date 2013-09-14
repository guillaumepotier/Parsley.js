window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Thông tin này không hợp lệ."
      , type: {
            email:      "Email không hợp lệ."
          , url:        "Url không hợp lệ."
          , urlstrict:  "Yêu cầu nhập địa chỉ url."
          , number:     "Yêu cầu nhập giá trị kiểu số."
          , digits:     "Yêu cầu nhập vào các chữ số."
          , dateIso:    "Yêu cầu nhập ngày tháng theo chuẩn sau (YYYY-MM-DD)."
          , alphanum:   "Yêu cầu nhập chữ cái hoặc chữ số."
        }
      , notnull:        "Thông tin này chưa nhập."
      , notblank:       "Thông tin này không được để trống."
      , required:       "Thông tin này là bắt buộc."
      , regexp:         "Thông tin này không hợp lệ."
      , min:            "Giá trị này phải lớn hơn %s."
      , max:            "Giá trị này phải nhỏ hơn %s."
      , range:          "Giá trị này phải nằm trong khoảng từ %s đến %s."
      , minlength:      "Chuỗi nhập vào quá ngắn. Yêu cầu tối thiểu %s ký tự."
      , maxlength:      "Chuỗi nhập vào quá dài. Yêu cầu tối đa %s ký tự."
      , rangelength:    "Chuỗi nhập vào không hợp lệ. Yêu cầu độ dài trong khoảng từ %s đến %s ký tự."
      , mincheck:       "Không được chọn ít hơn %s lựa chọn."
      , maxcheck:       "Không được chọn nhiều hơn %s lựa chọn."
      , rangecheck:     "Phải chọn trong khoảng từ %s đến %s lựa chọn."
      , equalto:        "Giá trị phải trùng khớp."

      // parsley.extend ///////////////////////////////
    }
  });
}(window.jQuery || window.Zepto));
