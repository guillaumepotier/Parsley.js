window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    messages: {
      // parsley //////////////////////////////////////
	      defaultMessage: "Mae'r gwerth hwn yn ymddangos i fod yn annilys."
	    , type: {
	          email:      "Dylai'r gwerth hwn fod yn e-bost dilys."
	        , url:        "Dylai'r gwerth hwn fod yn url dilys."
	        , urlstrict:  "Dylai'r gwerth hwn fod yn url dilys."
	        , number:     "Dylai'r gwerth hwn fod yn rhif dilys."
	        , digits:     "Dylai'r gwerth hwn fod yn werth digidau."
	        , dateIso:    "Dylai'r gwerth hwn fod yn ddyddiad dilys (YYYY-MM-DD)."
	        , alphanum:   "Dylai hyn fod yn werth alffaniwmerig."
	      }
	    , notnull:        "Ni ddylai hyn fod yn werth null."
	    , notblank:       "Ni ddylai hyn fod yn werth gwag."
	    , required:       "Mae'r gwerth hwn yn ofynnol."
	    , regexp:         "Mae'r gwerth hwn yn ymddangos i fod yn annilys."
	    , min:            "Dylai'r gwerth hwn fod yn fwy na %s."
	    , max:            "Dylai'r gwerth hwn fod yn is na %s."
	    , range:          "Dylai'r gwerth hwn fod rhwng s% a %s."
	    , minlength:      "Mae'r gwerth hwn yn rhy fyr. Dylai fod yna %s neu fwy o lythrennau."
	    , maxlength:      "Mae'r gwerth hwn yn rhy hir. Dylai fod yna %s neu llai o lythrennau"
	    , rangelength:    "Mae'r gwerth hyd yn annilys. Dylai fod yna rhwng %s a %s o lythrennau"
	    , equalto:        "Dylai'r gwerth hwn fod yr un fath."
      

      // parsley.extend ///////////////////////////////
	    , minwords:       "Dylai'r gwerth hwn cynnwys o leiaf %s gair."
	    , maxwords:       "Dylai'r gwerth hwn cynnwys %s gair ar yr mwyaf."
	    , rangewords:     "Dylai'r gwerth hwn cynnwys rhwng %s a %s o eiriau."
	    , greaterthan:    "Dylai'r gwerth hwn fod yn fwy na %s."
	    , lessthan:       "Dylai hyn gwerth yn llai na %s."
     
    }
  });
}(window.jQuery || window.Zepto));