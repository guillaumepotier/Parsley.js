window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
	window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
		messages: {
			// parsley //////////////////////////////////////
			defaultMessage: "Tato položka je neplatná."
			, type: {
				email:      "Tato položka musí být e-mailová adresa."
				, url:        "Tato položka musí být url adresa."
				, urlstrict:  "Tato položka musí být url adresa."
				, number:     "Tato položka musí být platné číslo."
				, digits:     "Tato položka musí být číslice."
				, dateIso:    "Tato položka musí být datum ve formátu YYYY-MM-DD."
				, alphanum:   "Tato položka musí být alfanumerická."
			}
			, notnull:        "Tato položka nesmí být null."
			, notblank:       "Tato položka nesmí být prázdná."
			, required:       "Tato položka je povinná."
			, regexp:         "Tato položka je neplatná."
			, min:            "Tato položka musí být větší než %s."
			, max:            "Tato položka musí byt menší než %s."
			, range:          "Tato položka musí být v rozmezí %s a %s."
			, minlength:      "Tato položka je příliš krátká. Musí mít %s nebo více znaků."
			, maxlength:      "Tato položka je příliš dlouhá. Musí mít %s nebo méně znaků."
			, rangelength:    "Tato položka je mimo rozsah. Musí být rozmezí %s a %s znaků."
			, equalto:        "Tato položka by měla být stejná."

			// parsley.extend ///////////////////////////////
			, minwords:       "Tato položka musí obsahovat alespoň %s slov."
			, maxwords:       "Tato položka nesmí přesánout %s slov."
			, rangewords:     "Tato položka musí obsahovat %s až %s slov."
			, greaterthan:    "Tato položka musí být větší než %s."
			, lessthan:       "Tato položka musí být menší než %s."
		}
	});
}(window.jQuery || window.Zepto));
