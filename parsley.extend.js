window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    validators: {
      minwords: function ( val, nbWords ) {
        val = val.replace( /(^\s*)|(\s*$)/gi, "" );
        val = val.replace( /[ ]{2,}/gi, " " );
        val = val.replace( /\n /, "\n" );
        val = val.split(' ').length;

        return val >= nbWords;
      }

      , maxwords : function ( val, nbWords ) {
        val = val.replace( /(^\s*)|(\s*$)/gi, "" );
        val = val.replace( /[ ]{2,}/gi, " " );
        val = val.replace( /\n /, "\n" );
        val = val.split(' ').length;

        return val <= nbWords;
      }

      , rangewords: function ( val, obj ) {
        val = val.replace( /(^\s*)|(\s*$)/gi, "" );
        val = val.replace( /[ ]{2,}/gi, " " );
        val = val.replace( /\n /, "\n" );
        val = val.split(' ').length;

        return val >= obj[0] && val <= obj[1];
      }

      , greaterthan: function ( val, elem, self ) {
        self.options.validateIfUnchanged = true;

        return new Number(val) > new Number($( elem ).val());
      }

      , lessthan: function ( val, elem, self ) {
        self.options.validateIfUnchanged = true;

        return new Number(val) < new Number($( elem ).val());
      }

      , beforedate: function ( val, elem, self) {
        return Date.parse(val) < Date.parse($(elem).val());
      }

      , afterdate: function ( val, elem, self) {
        return Date.parse($(elem).val()) < Date.parse(val);
      }

      , inlist: function ( val, list, self ) {
        var delimiter = self.options.inlistDelimiter || ',';
        var listItems = (list + "").split(new RegExp("\\s*\\" + delimiter + "\\s*"));

        return (listItems.indexOf(val.trim()) !== -1);
      }

      , luhn: function ( val, elem, self) {
        val = val.replace(/[ -]/g, '');
        var digit, n, sum, _j, _len1, _ref2;
        sum = 0;
        _ref2 = val.split('').reverse();
        for (n = _j = 0, _len1 = _ref2.length; _j < _len1; n = ++_j) {
          digit = _ref2[n];
          digit = +digit;
          if (n % 2) {
            digit *= 2;
            if (digit < 10) {
              sum += digit;
            } else {
              sum += digit - 9;
            }
          } else {
            sum += digit;
          }
        }
        return sum % 10 === 0;
      }

      , americandate: function ( val, elem, self) {
        if(!/^([01]?[1-9])[\.\/-]([0-3]?[0-9])[\.\/-]([0-9]{4}|[0-9]{2})$/.test(val)) {
        	return false;
        }
        var parts = val.split(/[.\/-]+/);
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);
        if(year == 0 || month == 0 || month > 12) {
          return false;
        }
        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
          monthLength[1] = 29;
        }
        return day > 0 && day <= monthLength[month - 1];
      }
    }
    , messages: {
        minwords:       "This value should have %s words at least."
      , maxwords:       "This value should have %s words maximum."
      , rangewords:     "This value should have between %s and %s words."
      , greaterthan:    "This value should be greater than %s."
      , lessthan:       "This value should be less than %s."
      , beforedate:     "This date should be before %s."
      , afterdate:      "This date should be after %s."
      , luhn:           "This value should pass the luhn test."
      , americandate:	"This value should be a valid date (MM/DD/YYYY)."
    }
  });
}(window.jQuery || window.Zepto));
