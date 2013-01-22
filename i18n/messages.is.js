window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
        defaultMessage: "Þetta gildi virðist vera ógilt."
      , type: {
            email:      "Þetta ætti að vera gilt netfang."
          , url:        "Þetta ætti að vera gild vefslóð."
          , urlstrict:  "Þetta ætti að vera gild vefslóð."
          , number:     "Þetta ætti að vera gild tala."
          , digits:     "Þetta ætti að innihalda tölur."
          , dateIso:    "Þetta ætti að vera gild dagsetning (ÁÁÁÁ-MM-DD)."
          , alphanum:   "Þetta ætti að vera innihalda tölur og bókstafi."
        }
      , notnull:        "Þetta gildi ætti ekki að vera autt."
      , notblank:       "Þetta gildi ætti ekki að vera tómt."
      , required:       "Þetta gildi er nauðsynlegt að fylla út."
      , regexp:         "Þetta gildi virðist vera ógilt."
      , min:            "Þetta gildi ætti að vera stærra en %s."
      , max:            "Þetta gildi ætti að vera minna en %s."
      , range:          "Þetta gildi ætti að vera milli %s og %s."
      , minlength:      "Þetta gildi er of stutt. Það ætti að innihalda %s stafi eða fleiri."
      , maxlength:      "Þetta gildi er of langt. Það ætti að innihalda %s stafi eða færri."
      , rangelength:    "Þetta gildi er ógilt. Það ætti að vera %s-%s stafir að lengd."
      , equalto:        "Þetta gildi ætti að vera eins."

      // parsley.extend ///////////////////////////////
    }
  });
}(window.jQuery || window.Zepto));
