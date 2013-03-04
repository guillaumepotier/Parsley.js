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
        //var listItems = (list + "").split('\s*' + delimiter + '\s*');
        var listItems = (list + "").split(new RegExp("\\s*\\" + delimiter + "\\s*"));

        return (listItems.indexOf(val.trim()) !== -1);
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
    }
  });
}(window.jQuery || window.Zepto));
