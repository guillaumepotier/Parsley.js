window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Questo valore sembra essere non valido."
      , type: {
            email: "Questo valore deve essere un indirizzo email valido."
          , url: "Questo valore deve essere un URL valido."
          , urlstrict: "Questo valore deve essere un URL valido."
          , number: "Questo valore deve essere un numero valido."
          , digits: "Questo valore deve essere di tipo numerico."
          , dateIso: "Questo valore deve essere una data valida (YYYY-MM-DD)."
          , alphanum: "Questo valore deve essere di tipo alfanumerico."
        }
      , notnull: "Questo valore non deve essere nullo."
      , notblank: "Questo valore non deve essere vuoto."
      , required: "Questo valore è richiesto."
      , regexp: "Questo valore non è corretto."
      , min: "Questo valore deve essere maggiore di %s."
      , max: "Questo valore deve essere minore di %s."
      , range: "Questo valore deve essere compreso tra %s e %s."
      , minlength: "Questo valore è troppo corto. La lunghezza minima è di %s caratteri."
      , maxlength: "Questo valore è troppo lungo. La lunghezza massima è di %s caratteri."
      , rangelength: "La lunghezza di questo valore deve essere compresa fra %s e %s caratteri."
      , equalto: "Questo valore deve essere identico."

      // parsley.extend ///////////////////////////////
      , minwords: "Questo valore deve contenere almeno %s parole."
      , maxwords: "Questo valore non deve superare le %s parole."
      , rangewords: "Questo valore deve contenere tra %s e %s parole."
      , greaterthan: "Questo valore deve essere maggiore di %s."
      , lessthan: "Questo valore deve essere minore di %s."
    , beforedate: "Questa data deve essere anteriore al %s."
      , afterdate: "Questa data deve essere posteriore al %s."
      , luhn: "Questo valore deve superare il test di Luhn."
    }
  });
}(window.jQuery || window.Zepto));
