window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Nilai ini tidak valid."
      , type: {
            email:      "Nilai ini harus berupa email yang valid."
          , url:        "Nilai ini harus berupa url yang valid."
          , urlstrict:  "Nilai ini harus berupa url yang valid."
          , number:     "Nilai ini harus berupa angka yang valid."
          , digits:     "Nilai ini harus berupa digit."
          , dateIso:    "Nilai ini harus berupa tanggal yang valid (YYYY-MM-DD)."
          , alphanum:   "Nilai ini harus berupa alfanumerik."
        }
      , notnull:        "Nilai ini tidak boleh null."
      , notblank:       "Nilai ini tidak boleh kosong."
      , required:       "Nilai ini wajib diisi."
      , regexp:         "Nilai ini tidak valid."
      , min:            "Nilai ini harus lebih besar daripada %s."
      , max:            "Nilai ini harus lebih kecil daripada %s."
      , range:          "Nilai ini harus diantara %s sampai dengan %s."
      , minlength:      "Nilai ini terlalu pendek. Harus memiliki %s karakter atau lebih."
      , maxlength:      "Nilai ini terlalu panjang. Harus memiliki %s karakter atau kurang."
      , rangelength:    "Panjang nilai ini tidak valid. Harus memiliki panjang di antara %s sampai dengan %s karakter."
      , equalto:        "Nilai ini harus sama."
      , mincheck:       "Anda harus memilih minimal %s pilihan."
      , maxcheck:       "Anda harus memilih %s pilihan atau kurang."
      , rangecheck:     "Anda harus memilih diantara %s sampai %s pilihan."

      // parsley.extend ///////////////////////////////
      , minwords:       "Nilai ini harus memiliki minimum %s kata."
      , maxwords:       "Nilai ini harus memiliki maksimum %s kata."
      , rangewords:     "Nilai ini harus diantara %s sampai %s kata."
      , greaterthan:    "Nilai ini harus lebih besar daripada %s."
      , lessthan:       "Nilai ini harus lebih kecil daripada %s."
    }
  });
}(window.jQuery || window.Zepto));
