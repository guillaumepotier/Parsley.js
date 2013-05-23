window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Această valoare nu pare validă."
        , type: {
            email:      "Această valoare ar trebui să fie un email valid."
          , url:        "Această valoare ar trebui să fie un url valid."
          , urlstrict:  "Această valoare ar trebui să fie un url valid."
          , number:     "Această valoare ar trebui să fie un număr valid."
          , digits:     "Această valoare ar trebui să fie compusă doar din cifre."
          , dateIso:    "Această valoare ar trebui să fie o dată validă (YYYY-MM-DD)."
          , alphanum:   "Această valoare ar trebui să fie alfanumerică."
          , phone:      "Această valoare ar trebui să fie un număr de telefon valid."
        }
      , notnull:        "Această valoare nu ar trebui să fie null."
      , notblank:       "Această valoare nu ar trebui să fie necompletată."
      , required:       "Această valoare este obligatorie."
      , regexp:         "Această valoare nu pare validă."
      , min:            "Această valoare ar trebui să fie mai mare sau egală cu %s."
      , max:            "Această valoare ar trebui să fie mai mică sau egală cu %s."
      , range:          "Această valoare trebuie să fie între %s şi %s."
      , minlength:      "Această valoare este prea scurtă. Ar trebui să aibă %s caractere sau mai mult."
      , maxlength:      "Această valoare este prea lungă. Ar trebui să aibă %s caractere sau mai puţin."
      , rangelength:    "Lungimea acestei valori nu este validă. Ar trebui să aibă între %s şi %s caractere."
      , mincheck:       "Trebuie să selectaţi cel puţin %s opţiuni."
      , maxcheck:       "Trebuie să selectaţi %s opţiuni sau mai puţin."
      , rangecheck:     "Trebuie să selectaţi între %s şi %s opţiuni."
      , equalto:        "Aceste valori ar trebui să fie identice."

      // parsley.extend ///////////////////////////////
      , minwords:       "Această valoare ar trebui să aibă cel puţin %s cuvinte."
      , maxwords:       "Această valoare ar trebui să aibă cel mult %s cuvinte."
      , rangewords:     "Această valoare ar trebui să aibă între %s şi %s cuvinte."
      , greaterthan:    "Această valoare ar trebui să fie mai mare decât %s."
      , lessthan:       "Această valoare ar trebui să fie mai mică decât %s."
      , beforedate:     "Această valoare ar trebui să fie înainte de %s."
      , afterdate:      "Această valoare ar trebui să fie după %s."
      , americandate:	"Această valoare ar trebui să fie o dată validă (MM/DD/YYYY)."
    }
  });
}(window.jQuery || window.Zepto));