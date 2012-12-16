/*
  Parsley.js allows you to verify your form inputs frontend side, without writing a line of javascript. Or so..

  author: Guillaume Potier - @guillaumepotier
*/

!function ($) {

  "use strict";

 /* PARSLEY PUBLIC CLASS DEFINITION
  * =============================== */
  var Parsley = function ( element, options ) {
    this.init( 'parsley', element, options );
  }

  Parsley.prototype = {

    constructor: Parsley

    /* init data, bind jQuery on() actions */
    , init: function ( type, element, options ) {
      this.type = type;
      this.$element = $( element );
      this.options = this.getOptions( options );
      this.parentForm = this.$element.closest( 'form' );
      this.$element.addClass( 'parsley-validated' );

      // bind parsley verification events
      // this.$element.on( this.options.events.join( '.' + this.type + ' ') , false, $.proxy( this.persist, this ) );
    }

    , getOptions: function ( options ) {
      options = $.extend( {}, $.fn[this.type].defaults, options, this.$element.data() );

      return options;
    }
  }

  /* PARSLEY PLUGIN DEFINITION
  * ========================= */

  $.fn.parsley = function ( option, fn ) {
    var options = $.extend(true, {}, $.fn.parsley.defaults, option, this.data() )
      , returnValue = false;

    function bind ( self ) {
      var $this = $( self )
        , data = $this.data( 'parsley' )
        , fieldOptions = $.extend( {}, options, $this.data() );

      // if data never binded, bind it right now!
      if ( !data ) {
        $this.data( 'parsley', ( data = new Parsley( self, fieldOptions ) ) );
      }

      // here is our parsley public function accessor, currently does not support args
      if ( 'string' === typeof option && 'function' === typeof data[option] ) {
        return data[option]();
      }
    }

    // loop through every elemt we want to parsley
    this.each(function () {
      // if a form elem is given, bind all its input children
      if ( $( this ).is( 'form' ) ) {
        $( this ).find( options.inputs ).each( function () {
          returnValue = bind( $( this ) );
        });

      // if it is a Parsley supported single element, bind it too
      // add here a return instance, cuz' we could call public methods on single elems with data[option]() above
      } else if ( $( this ).is( options.inputs ) ) {
        returnValue = bind( $( this ) );
      }
    });

    return 'function' === typeof fn ? fn() : returnValue;
  }

  /* PARSLEY CONFIGS & OPTIONS
  * ========================= */
  $.fn.parsley.Constructor = Parsley;

  $.fn.parsley.defaults = {
    inputs: 'input, textarea, select'                                                           // Default supported inputs.
  }

  /* PARSLEY DATA-API
  * =============== */
  $( window ).on( 'load', function () {
    $( '[data-validate="parsley"]' ).each( function () {
      $(this).parsley();
    })
  });

// This plugin works with jQuery or Zepto (with data extension builded for Zepto.)
}(window.jQuery || window.Zepto);
