/**
* /!\ Created by Murat Akdeniz: www.webfikirleri.com /!\
*/

window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Bu değer geçersiz görünüyor."
        , type: {
            email:      "Geçerli bir e-posta adresi girmelisiniz."
          , url:        "Geçerli bir URL girmelisiniz."
          , urlstrict:  "Geçerli bir URL girmelisiniz."
          , number:     "Bu bölüme geçerli bir numara girmelisiniz."
          , digits:     "Bu bölüm basamaklardan oluşmalıdır."
          , dateIso:    "Bu alan geçerli bir tarih olmalıdır (YYYY-MM-DD)."
          , alphanum:   "Bu alan alfa sayısal karakterlerden oluşmalıdır."
          , phone:      "Bu alan geçerli bir telefon numarası olmalıdır."
        }
      , notnull:        "Bu alan boş olmamalıdır."
      , notblank:       "Bu alanı boş bırakamazsınız."
      , required:       "Bu alan gereklidir."
      , regexp:         "Değer geçersiz görünüyor  ."
      , min:            "Bu alan %s değerine eşit ya da küçük olmalıdır."
      , max:            "Bu alan %s değerine eşit ya da büyük olmalıdır."
      , range:          "Bu alanın değeri %s ile %s arasında olmalıdır."
      , minlength:      "Bu alan çok kısa. %s karaktere eşit ya da fazla olmalıdır."
      , maxlength:      "Bu alan çok uzun. %s karaktere eşit ya da küçük olmalıdır."
      , rangelength:    "Bu alanın uzunluğu %s ile %s arasında olmalıdır."
      , mincheck:       "En az %s seçenek seçmelisiniz."
      , maxcheck:       "En fazla %s seçenek seçebilirsiniz."
      , rangecheck:     "En az %s en fazla %s seçenek seçebilirsiniz."
      , equalto:        "Bu değer eşit olmalıdır."

      // parsley.extend ///////////////////////////////
      , minwords:       "Bu alan en az %s kelime içermelidir."
      , maxwords:       "Bu alan en fazla %s kelime içermelidir."
      , rangewords:     "Bu alan %s ile %s kelime arasında olmalıdır."
      , greaterthan:    "Bu bölüm %s karakterden büyük olmalıdır."
      , lessthan:       "Bu alan %s değerinden küçük olmalıdır."
      , beforedate:     "Bu alan %s tarihinden önce olmalıdır."
      , afterdate:      "Bu alan %s tarihinden sonra olmalıdır."
      , americandate:  "Bu alan geçerli bir tarih olmalıdır (MM/DD/YYYY)."
    }
  });
}(window.jQuery || window.Zepto));
