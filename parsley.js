/*
 * Parsley.js allows you to verify your form inputs frontend side, without writing a line of javascript. Or so..
 *
 * Author: Guillaume Potier - @guillaumepotier
*/

!function ($) {

  "use strict";

  /**
  * Validator class stores all constraints functions and associated messages.
  * Provides public interface to add, remove or modify them
  *
  * @class Validator
  * @constructor
  */
  var Validator = function ( options ) {
    this.init( options );
  }

  Validator.prototype = {

    constructor: Validator

    /**
    * Error messages
    * 
    * @property messages
    * @type {Object}
    */
    , messages: {
        defaultMessage: "This value seems to be invalid."
      , type: {
            email:      "This value should be a valid email."
          , url:        "This value should be a valid url."
          , number:     "This value should be a valid number."
          , digits:     "This value should be digits."
          , dateIso:    "This value should be a valid date (YYYY-MM-DD)."
          , alphanum:   "This value should be alphanumeric."
        }
      , notnull:        "This value should not be null."
      , notblank:       "This value should not be blank."
      , required:       "This value is required."
      , regexp:         "This value seems to be invalid."
      , min:            "This value should be greater than %s."
      , max:            "This value should be lower than %s."
      , range:          "This value should be between %s and %s."
      , minlength:      "This value is too short. It should have %s characters or more."
      , maxlength:      "This value is too long. It should have %s characters or less."
      , rangelength:    "This value length is invalid. It should be between %s and %s characters long."
      , equalto:        "This value should be the same."
    }

    /**
    * Validator list. Built-in validators functions
    * 
    * @property validators
    * @type {Object}
    */
    , validators: {
        notnull: function ( val ) {
        return val.length > 0;
      }

      , notblank: function ( val ) {
        return '' !== val.replace( /^\s+/g, '' ).replace( /\s+$/g, '' );
      }

      , required: function ( val ) {
        return this.notnull( val ) && this.notblank( val );
      }

      , type: function ( val, type ) {
        var regExp;

        switch ( type ) {
          case "number":
            regExp = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
            break;
          case "digits":
            regExp = /^\d+$/;
            break;
          case "alphanum":
            regExp = /^\w+$/;
            break;
          case "email":
            regExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
            break;
          case "url":
            regExp = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
            break;
          case "dateIso":
            regExp = /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/;
            break;
          default:
            return false;
            break;
        }

        // test regExp if not null
        return '' !== val ? regExp.test( val ) : false;
      }

      , regexp: function ( val, regExp ) {
        return new RegExp( regExp, 'i' ).test( val );
      }

      , minlength: function ( val, min ) {
        return val.length >= min;
      }

      , maxlength: function ( val, max ) {
        return val.length <= max;
      }

      , rangelength: function ( val, arrayRange ) {
        return this.minlength( val, arrayRange[ 0 ] ) && this.maxlength( val, arrayRange[ 1 ] );
      }

      , min: function ( val, min ) {
        return val >= min;
      }

      , max: function ( val, max ) {
        return val <= max;
      }

      , range: function ( val, arrayRange ) {
        return val >= arrayRange[ 0 ] && val <= arrayRange[ 1 ];
      }

      , equalto: function ( val, elem ) {
        return val === $( elem ).val();
      }
    }

    /*
    * Register custom validators and messages
    */
    , init: function ( options ) {
      var customValidators = options.customValidators
        , customMessages = options.messages;

      for ( var i in customValidators ) {
        this.addValidator(i, customValidators[ i ]);
      }

      for ( var i in customMessages ) {
        this.addMessage(i, customMessages[ i ]);
      }
    }

    /**
    * Replace %s placeholders by values
    *
    * @method formatMesssage
    * @param {String} message Message key
    * @param {Mixed} args Args passed by validators functions. Could be string, number or object
    * @return {String} Formatted string
    */
    , formatMesssage: function ( message, args ) {

      if ( 'object' === typeof args ) {
        for ( var i in args ) {
          message = this.formatMesssage( message, args[ i ] );
        }

        return message;
      }

      return message.replace(new RegExp("%s", "i"), args);
    }

    /**
    * Add / override a validator in validators list
    *
    * @method addValidator
    * @param {String} name Validator name. Will automatically bindable through data-name=""
    * @param {Function} fn Validator function. Must return {Boolean}
    */
    , addValidator: function ( name, fn ) {
      this.validators[ name ] = fn;
    }

    /**
    * Add / override error message
    *
    * @method addMessage
    * @param {String} name Message name. Will automatically be binded to validator with same name
    * @param {String} message Message
    */
    , addMessage: function ( key, message ) {
      if ( 'type' === key ) {
        this.messages[ 'type' ][ key ] = message;
        return;
      }

      this.messages[ key ] = message;
    }
  }

  /**
  * ParsleyField class manage each form field inside a validated Parsley form.
  * Returns if field valid or not depending on its value and constraints
  * Manage field error display and behavior, event triggers and more
  *
  * @class ParsleyField
  * @constructor
  */
  var ParsleyField = function ( element, options ) {
    this.init( 'ParsleyField', element, new Validator( options ), options );
  }

  ParsleyField.prototype = {

    constructor: ParsleyField

    /*
    * init data, bind jQuery on() actions
    */
    , init: function ( type, element, Validator, options ) {
      this.type = type;
      this.hash = this.generateHash();
      this.$element = $( element );
      this.isRequired = false;
      this.Validator = Validator;
      this.registeredValidators = this.errors = new Array();
      this.options = $.extend(true, {}, $.fn[ 'parsley' ].defaults, options, this.$element.data() );

      // a field is required if data-required="true" or class="required"
      if ( 'undefined' !== typeof this.options[ 'required' ] || this.$element.hasClass( 'required' ) ) {
        this.isRequired = this.options[ 'required' ] = true;
      }

      // register validators
      this.registerValidators();

      // bind parsley events if validators have been registered
      if ( this.registeredValidators.length ) {
        this.bindValidationEvents();
      }
    }

    /**
    * Attach field validators functions passed through data-api
    *
    * @method registerValidators
    */
    , registerValidators: function () {
      for ( var method in this.options ) {
        if ( 'function' === typeof this.Validator.validators[  method.toLowerCase() ] ) {
          this.registeredValidators.push( {
              method: method
            , params: this.options[ method ]
          } );
        }
      }
    }

    /**
    * Bind validation events on a field
    *
    * @method bindValidationEvents
    */
    , bindValidationEvents: function () {
      this.$element.addClass( 'parsley-validated' );

      // if a validation trigger is defined
      if ( this.options.trigger ) {
        this.$element.on( this.options.trigger.split( ' ' ).join( '.' + this.type + ' '), false, $.proxy( this.triggerValidation, this ) );
      }
    }

    /**
    * Hash management. Used for ul error
    *
    * @method generateHash
    * @returns {String} 5 letters hash
    */
    , generateHash: function () {
        var text = ''
          , possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for ( var i = 0; i < 5; i++ ) {
          text += possible.charAt( Math.floor( Math.random() * possible.length ) );
        }

        return text;
    }

    /**
    * Public getHash accessor
    *
    * @method generateHash
    * @returns {String} hash
    */
    , getHash: function() {
      return this.hash;
    }

    /**
    * Called when validation is triggered by an event
    * Do nothing if val.length < this.options.validationMinlength
    *
    * @method triggerValidation
    */
    , triggerValidation: function() {
      // if some binded events are redundant (keyup & keypress for example) and except for onSubmit, validate only once by field value change
      var val = this.$element.val();

      if ( this.val === val) {
        return this.isValid;
      }

      this.val = val;

      // do validation process if field has enough chars and was not previously validated
      if ( val.length < this.options.validationMinlength && !this.$element.hasClass( 'parsley-error' ) ) {
          return true;
      }

      this.validate();
    }

    /**
    * Called by ParsleyForm for fields batch validation
    *
    * @method submitValidation
    * @return {Mixed} {Boolean} if field is validated, {null} if empty non required field
    */
    , submitValidation: function() {
      if ( this.isRequired || '' !== this.$element.val() ) {
        return this.validate();
      }

      return null;
    }

    /**
    * Validate a field & display errors
    *
    * @method validate
    * @return {Boolean} Is field valid or not
    */
    , validate: function () {
      this.isValid = this.processFieldValidators( this.$element.val() );
      return this.manageValidationResult();
    }

    /**
    * Loop through every fields validators
    * Adds errors after unvalid fields
    *
    * @method processFieldValidators
    * @param {String} val Field value
    * @return {Boolean} Is field valid or not
    */
    , processFieldValidators: function ( val ) {
      var isValid = true;

      for ( var i in this.registeredValidators ) {
        var method = this.registeredValidators[ i ].method
          , requirements = this.registeredValidators[ i ].params;

        if ( !this.Validator.validators[ method ]( val, requirements ) ) {
          isValid = this.manageError( 'add', method, requirements );
        } else {
          this.manageError( 'remove', method );
        }
      }

      return isValid;
    }

    /**
    * Fired when all validators have be executed
    * Returns true or false if field is valid or not
    * Adds parsley-success or parsley-error class on field
    *
    * @method manageValidationResult
    * @return {Boolean} Is field valid or not
    */
    , manageValidationResult: function () {
      if ( true === this.isValid ) {
        this.removeErrors();
        this.$element.removeClass( 'parsley-error' ).addClass( 'parsley-success' );
      } else if ( false === this.isValid ) {
        this.$element.removeClass( 'parsley-success' ).addClass( 'parsley-error' );
      } else {
        this.removeErrors();
        this.$element.removeClass( 'parsley-success' ).removeClass( 'parsley-error' );
      }

      return this.isValid;
    }

    /**
    * Called when field fails or pass a validator constraint
    * type: add|remove
    * returns boolean if constraint fails or pass
    *
    * @method manageError
    * @param {String} type 'add' or 'remove' error
    * @param {String} methodName Method name
    * @param {Mixed} requirements Method requirements if adding an error
    * @return {Boolean} Is field valid or not
    */
    , manageError: function ( type, methodName, requirements ) {
      switch ( type ) {
        case 'add' :
          if ( false === this.options.addError( this.$element, methodName, requirements ) ) {
             return false;
           }

          this.addError( methodName, requirements );

          return false;
        case 'remove':
          this.removeError( methodName );

          return true;
        default:
          return false;
      }
    }

    /**
    * Remove li / ul error
    *
    * @method removeError
    * @param {String} methodName Method Name
    */
    , removeError: function ( methodName ) {
      var ulError = 'ul#' + this.hash
        , liError = ulError + ' li.' + methodName;

      // remove li error, and ul error if no more li inside
      if ( $( liError ).remove() && $( ulError + ' li' ).length === 0 ) {
        $( ulError ).remove();
      }
    }

    /**
    * Remove ul error
    *
    * @method removeErrors
    */
    , removeErrors: function () {
      $( 'ul#' + this.hash ).remove();
    }

    /**
    * Add li / ul error
    *
    * @method addError
    * @param {String} methodName Method name
    * @param {Mixed} requirements Method requirements if adding an error
    */
    , addError: function ( methodName, requirements ) {
      var ulError = 'ul#' + this.hash
        , liError = ulError + ' li.' + methodName
        , message = methodName === 'type' ?
            this.Validator.messages[ methodName ][ requirements ] : ( 'undefined' === typeof this.Validator.messages[ methodName ] ?
              this.Validator.messages.defaultMessage : this.Validator.formatMesssage( this.Validator.messages[ methodName ], requirements ) );

      if ( $( ulError ).length === 0 ) {
        this.$element.after( '<ul class="parsley-error-list" id="' + this.hash + '"></ul>' );
      }

      if ( $( liError ).length === 0 ) {
        $( ulError ).append( '<li class="parsley-error ' + methodName + '">' + message + '</li>');
      }
    }
  }

  /**
  * ParsleyForm class manage Parsley validated form.
  * Manage its fields and global validation
  *
  * @class ParsleyForm
  * @constructor
  */
  var ParsleyForm = function ( element, options ) {
    this.init( 'parsleyForm', element, options );
  }

  ParsleyForm.prototype = {

    constructor: ParsleyForm

    /* init data, bind jQuery on() actions */
    , init: function ( type, element, options ) {
      this.type = type;
      this.items = new Array();
      this.$element = $( element );
      this.options = options;
      var self = this;

      this.$element.find( options.inputs ).each( function () {
        $( this ).parsley( options );
        self.items.push( $( this) );
      });

      this.$element.on( 'submit' , false, $.proxy( this.validate, this ) );
    }

    /**
    * Process each form field validation
    * Display errors, call custom onSubmit() function
    *
    * @method validate
    * @param {Object} event jQuery Event
    * @return {Boolean} Is form valid or not
    */
    , validate: function ( event ) {
      var isValid = true;

      for ( var item in this.items ) {
        if ( false === this.items[ item ].parsley( 'submitValidation' ) ) {
          isValid = false;
        }
      }

      this.options.onSubmit( isValid, event );

      return isValid;
    }
  }

  /**
  * Parsley plugin definition
  * Provides an interface to access public Validator, ParsleyForm and ParsleyItem functions
  *
  * @class Parsley
  * @constructor
  * @param {Mixed} Options. {Object} to configure Parsley or {String} method name to call a public class method
  * @param {Function} Callback function
  * @return {Mixed} public class method return
  */
  $.fn.parsley = function ( option, fn ) {
    var options = $.extend(true, {}, $.fn.parsley.defaults, option, this.data() )
      , returnValue = false;

    function bind ( self, type ) {
      var data = $( self ).data( type );

      // if data never binded, bind it right now!
      if ( !data ) {
        switch ( type ) {
          case 'parsleyForm':
            data = new ParsleyForm( self, options );
            break;
          case 'parsleyField':
            data = new ParsleyField( self, options );
            break;
          default:
            return;
        }

        $( self ).data( type, data );
      }

      // here is our parsley public function accessor, currently does not support args
      if ( 'string' === typeof option && 'function' === typeof data[ option ] ) {
        return data[ option ]( fn );
      }
    }

    // loop through every elemt we want to parsley
    this.each( function () {
      // if a form elem is given, bind all its input children
      if ( $( this ).is( 'form' ) ) {
        returnValue = bind ( $( this ), 'parsleyForm' );

      // if it is a Parsley supported single element, bind it too
      // add here a return instance, cuz' we could call public methods on single elems with data[ option ]() above
      } else if ( $( this ).is( options.inputs ) ) {
        returnValue = bind( $( this ), 'parsleyField' );
      }
    } );

    return 'function' === typeof fn ? fn() : returnValue;
  }

  $.fn.parsley.Constructor = ParsleyForm;

  /**
  * Parsley plugin configuration
  * 
  * @property $.fn.parsley.defaults
  * @type {Object}
  */
  $.fn.parsley.defaults = {
    inputs: 'input, textarea, select'                               // Default supported inputs.
    , trigger: false                                                // $.Event() that will trigger validation. eg: keyup, change..
    , validationMinlength: 3                                        // If trigger validation specified, only if value.length > validationMinlength
    , onSubmit: function ( isFormValid, event ) {}                  // Executed once on form validation
    , addError: function ( elem, validator, requirements ) {         // Override custom error function by returning false
      return true;
    }
    , customValidators: {}                                          // Add your custom validators functions
    , messages: {}                                                  // Add your own error messages here
  }

  /* PARSLEY auto-bind DATA-API
  * ======================== */
  $( window ).on( 'load', function () {
    $( '[data-validate="parsley"]' ).each( function () {
      $( this ).parsley();
    })
  });

// This plugin works with jQuery or Zepto (with data extension builded for Zepto.)
}(window.jQuery || window.Zepto);
