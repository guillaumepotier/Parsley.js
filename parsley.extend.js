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
    }
  });
}(window.jQuery || window.Zepto));
