// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('vi', {
  defaultMessage: "Trường này có vẻ không đúng.",
  type: {
    email:        "Trường này không phải là email.",
    url:          "Trường này cần là một đường dẫn.",
    number:       "Trường này cần là một số.",
    integer:      "Trường này cần là số nguyên.",
    digits:       "Trường này cần là ký tự số.",
    alphanum:     "Trường này cần là chữ và số."
  },
  notblank:       "Trường này không được để trống.",
  required:       "Trường này là bắt buộc.",
  pattern:        "Giá trị này có vẻ không đúng.",
  min:            "Giá trị cần lớn hơn hoặc bằng %s.",
  max:            "Giá trị cần bé hơn hoặc bằng %s.",
  range:          "Giá trị cần nằm trong khoảng %s và %s.",
  minlength:      "Giá trị quá ngắn. Cần là %s ký tự hoặc nhiều hơn.",
  maxlength:      "Giá trị quá dài. Cần là %s ký tự hoặc ít hơn.",
  length:         "Độ dài không đúng. Cần có độ dài ở giữa %s và %s ký tự.",
  mincheck:       "Bạn cần chọn tối thiểu %s tùy chọn.",
  maxcheck:       "Bạn cần chọn %s tùy chọn hoặc ít hơn.",
  check:          "Bạn cần chọn giữa %s và %s tùy chọn.",
  equalto:        "Giá trị này cần bằng.",
  euvatin:        "Đây không phải là số VAT.",
});

Parsley.setLocale('vi');
