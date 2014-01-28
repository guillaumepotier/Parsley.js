window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    validators: {
      minwords: function () {
        return {
          validate: function ( val, nbWords ) {
            val = val.replace( /(^\s*)|(\s*$)/gi, "" );
            val = val.replace( /[ ]{2,}/gi, " " );
            val = val.replace( /\n /, "\n" );
            val = val.split(' ').length;

            return val >= nbWords;
          }
          , priority: 32
        }
      }
      , maxwords : function () {
        return {
          validate: function ( val, nbWords ) {
            val = val.replace( /(^\s*)|(\s*$)/gi, "" );
            val = val.replace( /[ ]{2,}/gi, " " );
            val = val.replace( /\n /, "\n" );
            val = val.split(' ').length;

            return val <= nbWords;
          }
          , priority: 32
        }
      }
      , rangewords: function () {
        var that = this;
        return {
          validate: function ( val, arrayRange) {
            return that.minwords().validate( val, arrayRange[0] ) && that.maxwords().validate( val, arrayRange[1] );
          }
          , priority: 32
        }
      }
      , greaterthan: function () {
        return {
          validate: function ( val, elem, self ) {
            self.options.validateIfUnchanged = true;

            return new Number(val) > new Number($( elem ).val());
          }
          , priority: 32
        }
      }
      , lessthan: function () {
        return {
          validate: function ( val, elem, self ) {
            self.options.validateIfUnchanged = true;

            return new Number(val) < new Number($( elem ).val());
          }
          , priority: 32
        }
      }
      , beforedate: function () {
        return {
          validate: function ( val, elem, self) {
            return Date.parse(val) < Date.parse($(elem).val());
          }
          , priority: 32
        }
      }
      , onorbeforedate: function() {
        return {
          validate: function ( val, elem) {
            return Date.parse(val) <= Date.parse($(elem).val());
          }
          , priority: 32
        }
      }
      , afterdate: function () {
        return {
          validate: function ( val, elem) {
            return Date.parse($(elem).val()) < Date.parse(val);
          }
          , priority: 32
        }
      }
      , onorafterdate: function() {
        return {
          validate: function ( val, elem) {
            return Date.parse($(elem).val()) <= Date.parse(val);
          }
          , priority: 32
        }
      }
      , inlist: function () {
        return {
          validate: function ( val, list, self ) {
            var delimiter = self.options.inlistDelimiter || ',';
            var listItems = (list + "").split(new RegExp("\\s*\\" + delimiter + "\\s*"));

            return ($.inArray($.trim(val), listItems) !== -1);
          }
          , priority: 32
        }
      }
      , luhn: function () {
        return {
          validate: function ( val, elem, self) {
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
          , priority: 32
        }
      }
      , americandate: function () {
        return {
          validate: function ( val, elem, self) {
            if ( !/^([01]?[0-9])[\.\/-]([0-3]?[0-9])[\.\/-]([0-9]{4}|[0-9]{2})$/.test( val ) ) {
              return false;
            }
            var parts = val.split(/[.\/-]+/);
            var day = parseInt(parts[1], 10);
            var month = parseInt(parts[0], 10);
            var year = parseInt(parts[2], 10);
            if ( year == 0 || month == 0 || month > 12 ) {
              return false;
            }
            var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
            if ( year % 400 == 0 || ( year % 100 != 0 && year % 4 == 0 ) ) {
              monthLength[1] = 29;
            }
            return day > 0 && day <= monthLength[month - 1];
          }
          , priority: 32
        }
      }
    }
    , messages: {
        minwords:       "This value should have %s words at least."
      , maxwords:       "This value should have %s words maximum."
      , rangewords:     "This value should have between %s and %s words."
      , greaterthan:    "This value should be greater than %s."
      , lessthan:       "This value should be less than %s."
      , beforedate:     "This date should be before %s."
      , onorbeforedate: "This date should be on or before %s."
      , afterdate:      "This date should be after %s."
      , onorafterdate:  "This date should be on or after %s."
      , luhn:           "This value should pass the luhn test."
      , americandate:	"This value should be a valid date (MM/DD/YYYY)."
    }
  });
}(window.jQuery || window.Zepto));
