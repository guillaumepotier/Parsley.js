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

      /**
      * Works on all inputs. val is object for checkboxes
      */
      , required: function ( val ) {

        // check here that at least a checkbox is checked here
        if ( 'object' === typeof val ) {
          return val.length > 0;
        }

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

      /**
      * Aliases for checkboxes constraints
      */
      , mincheck: function ( obj, val ) {
        return this.minlength( obj, val );
      }

      , maxcheck: function ( obj, val ) {
        return this.maxlength( obj, val);
      }

      , rangecheck: function ( obj, arrayRange ) {
        return this.rangelength( obj, arrayRange );
      }
    }

    /*
    * Register custom validators and messages
    */
    , init: function ( options ) {
      var customValidators = options.validators
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
  var ParsleyField = function ( element, options, type ) {
    this.options = options;
    this.Validator = new Validator( options );

    this.init( element, type || 'ParsleyField' );

    return this;
  }

  ParsleyField.prototype = {

    constructor: ParsleyField

    /**
    * Set some properties, bind constraint validators and validation events
    *
    * @method init
    * @param {Object} element
    * @param {Object} options
    */
    , init: function ( element, type ) {
      this.type = type;
      this.isValid = true;
      this.element = element;
      this.$element = $( element );
      this.val = this.$element.val();
      this.isRequired = false;
      this.constraints = [];
      this.isRadioOrCheckbox = false;

      // overrided by ParsleyItemMultiple if radio or checkbox input
      this.hash = this.generateHash();
      this.errorClassHandler = this.options.error.classHandler( element ) || this.$element;

      // a field is required if data-required="true" or class="required" or required="required"
      if ( 'undefined' !== typeof this.options[ 'required' ] || this.$element.hasClass( 'required' ) || this.$element.attr( 'required' ) === 'required' ) {
        this.isRequired = this.options[ 'required' ] = true;
      }

      // bind validators to field
      this.addConstraints();

      // bind parsley events if validators have been registered
      if ( this.constraints.length ) {
        this.bindValidationEvents();
      }
    }

    /**
    * Attach field validators functions passed through data-api
    *
    * @method addConstraints
    */
    , addConstraints: function () {
      for ( var method in this.options ) {
        if ( 'function' === typeof this.Validator.validators[  method.toLowerCase() ] ) {
          this.constraints.push( {
              method: method
            , requirements: this.options[ method ]
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

      // alaways bind keyup event, for better UX when a field is invalid
      var triggers = this.options.trigger + ' keyup';

      // if a validation trigger is defined
      if ( triggers ) {
        this.$element.on( triggers.split( ' ' ).join( '.' + this.type + ' ' ), false, $.proxy( this.eventValidation, this ) );
      }
    }

    /**
    * Hash management. Used for ul error
    *
    * @method generateHash
    * @returns {String} 5 letters unique hash
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
    , getHash: function () {
      return this.hash;
    }

    /**
    * Returns field val needed for validation
    * Special treatment for radio & checkboxes
    *
    * @method getVal
    * @returns {String} val
    */
    , getVal: function () {
      return this.$element.val();
    }

    /**
    * Called when validation is triggered by an event
    * Do nothing if val.length < this.options.validationMinlength
    *
    * @method eventValidation
    * @param {Object} event jQuery event
    */
    , eventValidation: function ( event ) {
      var val = this.getVal();

      // do nothing on keypress event if not explicitely passed as data-trigger and if field has no errors
      if ( event.type === 'keyup' && !/keyup/i.test( this.options.trigger ) && this.isValid ) {
        return true;
      }

      // do validation process if field has enough chars and was not previously validated
      if ( val.length < this.options.validationMinlength && this.isValid ) {
        return true;
      }

      // if some binded events are redundant (keyup & paste for example), validate only once by field value change
      if ( this.val === val) {
        return this.isValid;
      }

      this.validate();
    }

    /**
    * Validate a field & display errors
    *
    * @method validate
    * @param {Boolean} doNotShowErrors set to true if you just want isValid boolean without error bubbling next to fields
    * @return {Boolean} Is field valid or not
    */
    , validate: function ( doNotShowErrors ) {
      this.val = this.getVal();

      if ( this.options.listeners.onFieldValidate( this.$element ) || '' === this.val && !this.isRequired ) {
        this.reset();
        return true;
      }

      this.isValid = this.applyValidators();

      if ( !doNotShowErrors ) {
        this.manageValidationResult();
      }

      return this.isValid;
    }

    /**
    * Loop through every fields validators
    * Adds errors after unvalid fields
    *
    * @method applyValidators
    * @return {Boolean} Is field valid or not
    */
    , applyValidators: function () {
      var isValid = true;

      for ( var i in this.constraints ) {
        var method = this.constraints[ i ].method
          , requirements = this.constraints[ i ].requirements;

        if ( !this.Validator.validators[ method ]( this.val, requirements ) ) {
          isValid = false;
          this.constraints[ i ].isValid = false;
        } else {
          this.constraints[ i ].isValid = true;
        }
      }

      return isValid;
    }

    /**
    * Fired when all validators have be executed
    * Returns true or false if field is valid or not
    * Display errors messages below faild fields
    * Adds parsley-success or parsley-error class on fields
    *
    * @method manageValidationResult
    * @return {Boolean} Is field valid or not
    */
    , manageValidationResult: function () {
      if ( this.isValid ) {
        this.removeErrors();
        this.errorClassHandler.removeClass( this.options.errorClass ).addClass( this.options.successClass );
        return true;
      }

      for ( var i in this.constraints ) {
        if ( !this.constraints[ i ].isValid ) {
          this.addError( this.constraints[ i ].method,  this.constraints[ i ].requirements );
          this.options.listeners.onFieldError( this.$element, this.constraints[ i ] );
        } else {
          this.removeError( this.constraints[ i ].method );
        }
      }

      this.errorClassHandler.removeClass( this.options.successClass ).addClass( this.options.errorClass );
      return false;
    }

    /**
    * Remove li / ul error
    *
    * @method removeError
    * @param {String} methodName Method Name
    */
    , removeError: function ( methodName ) {
      var liError = this.ulError + ' .' + methodName;

      // remove li error, and ul error if no more li inside
      if ( this.ulError && $( liError ).remove() && $( this.ulError ).children().length === 0 ) {
        $( this.ulError ).remove();
      }
    }

    /**
    * Remove all ul / li errors
    *
    * @method removeErrors
    */
    , removeErrors: function () {
      !this.ulError || $( this.ulError ).remove();
    }

    /**
    * Remove ul errors and parsley error or success classes
    *
    * @method reset
    */
    , reset: function () {
      this.isValid = true;
      this.removeErrors();
      this.errorClassHandler.removeClass( this.options.successClass ).removeClass( this.options.errorClass );
    }

    /**
    * Add li / ul errors messages
    *
    * @method addError
    * @param {String} methodName Method name
    * @param {Mixed} requirements Method requirements if adding an error
    */
    , addError: function ( methodName, requirements ) {
      // error dom management done only once
      if ( !this.ulError ) {
          this.ulError = '#' + this.hash
        , this.ulTemplate = $( this.options.error.errorsWrapper ).attr( 'id', this.hash ).addClass( 'parsley-error-list' );
      }

      var liError = this.ulError + ' .' + methodName
        , liTemplate = $( this.options.error.errorElem ).addClass( methodName )
        , message = methodName === 'type' ?
            this.Validator.messages[ methodName ][ requirements ] : ( 'undefined' === typeof this.Validator.messages[ methodName ] ?
              this.Validator.messages.defaultMessage : this.Validator.formatMesssage( this.Validator.messages[ methodName ], requirements ) );

      if ( !$( this.ulError ).length ) {
        this.options.error.container( this.element, this.ulTemplate, this.isRadioOrCheckbox )
          || !this.isRadioOrCheckbox ? this.$element.after( this.ulTemplate ) : this.$element.parent().after( this.ulTemplate );
      }

      if ( !$( liError ).length ) {
        $( this.ulError ).append( $( liTemplate ).text( message ) );
      }
    }

    /**
    * Add custom listeners
    *
    * @param {Object} { listener: function () {} }, eg { onFormSubmit: function ( isValid, event, focus ) { ... } }
    */
    , addListener: function ( object ) {
      for ( var listener in object ) {
        this.options.listeners[ listener ] = object[ listener ];
      }
    }
  }

  /**
  * ParsleyFieldMultiple override ParsleyField for checkbox and radio inputs
  * Pseudo-heritance to manage divergent behavior from ParsleyItem in dedicated methods
  *
  * @class ParsleyFieldMultiple
  * @constructor
  */
  var ParsleyFieldMultiple = function ( element, options ) {
    this.initMultiple( element, options );
    this.inherit( element, options );
  }

  ParsleyFieldMultiple.prototype = {

    constructor: ParsleyFieldMultiple

    /**
    * Set some specific properties, call some extra methods to manage radio / checkbox
    *
    * @method init
    * @param {Object} element
    * @param {Object} options
    */
    , initMultiple: function ( element, options ) {
      this.element = element;
      this.$element = $( element );
      this.hash = this.getName();
      this.isRadioOrCheckbox = true;
      this.isRadio = this.$element.is( 'input[type=radio]' );
      this.isCheckbox = this.$element.is( 'input[type=checkbox]' );
      this.siblings = 'input[name="' + this.$element.attr( 'name' ) + '"]';
      this.$siblings = $( this.siblings );
      this.errorClassHandler = options.error.classHandler( element ) || this.$element.parent();
    }

    /**
    * Set specific constraints messages, do pseudo-heritance
    *
    * @method inherit
    * @param {Object} element
    * @param {Object} options
    */
    , inherit: function ( element, options ) {
      var messages = {
          mincheck:     "You must select at least %s choices."
        , maxcheck:     "You must select %s choices or less."
        , rangecheck:   "You must select between %s and %s choices."
      }
      , options = $.extend(true, {}, { messages: messages }, options )
      , clone = new ParsleyField( element, options );

      for ( var property in clone ) {
        if ( 'undefined' === typeof this[ property ] ) {
          this[ property ] = clone [ property ];
        }
      }
    }

    /**
    * Set specific constraints messages, do pseudo-heritance
    *
    * @method getName
    * @returns {String} radio / checkbox hash is cleaned "name" property
    */
   , getName: function () {
     return this.$element.attr( 'name' ).replace( /(:|\.|\[|\])/g, '' );
   }

   /**
   * Special treatment for radio & checkboxes
   * Returns checked radio or checkboxes values
   *
   * @method getVal
   * @returns {String} val
   */
   , getVal: function () {
      if ( this.isRadio ) {
        return $( this.siblings + ':checked' ).val() || '';
      }

      if ( this.isCheckbox ) {
        var values = [];
        $( this.siblings + ':checked' ).each( function () {
          values.push( $( this ).val() );
        } )

        return values;
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
      this.items = [];
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
    * Add custom listeners
    *
    * @param {Object} { listener: function () {} }, eg { onFormSubmit: function ( isValid, event, focus ) { ... } }
    */
    , addListener: function ( object ) {
      for ( var listener in object ) {
        if ( new RegExp( 'Field' ).test( listener ) ) {
          for ( var item in this.items ) {
            this.items[ item ].parsley( 'addListener', object );
          }
        } else {
          this.options[ listener ] = object[ listener ];
        }
      }
    }

    /**
    * Process each form field validation
    * Display errors, call custom onFormSubmit() function
    *
    * @method validate
    * @param {Object} event jQuery Event
    * @return {Boolean} Is form valid or not
    */
    , validate: function ( event ) {
      var isValid = true
        , focusedField = false;

      for ( var item in this.items ) {
        if ( false === this.items[ item ].parsley( 'validate' ) ) {
          isValid = false;

          if ( !focusedField && 'first' === this.options.focus || 'last' === this.options.focus ) {
            focusedField = this.items[ item ];
          }
        }
      }

      // form is invalid, focus an error field depending on focus policy
      if ( !isValid ) {
        focusedField.focus();
      }

      this.options.listeners.onFormSubmit( isValid, event, focusedField );

      return isValid;
    }

    /**
    * Remove all errors ul under invalid fields
    *
    * @method removeErrors
    */
    , removeErrors: function () {
      for ( var item in this.items ) {
        this.items[ item ].parsley( 'reset' );
      }
    }
  }

  /**
  * Parsley plugin definition
  * Provides an interface to access public Validator, ParsleyForm and ParsleyField functions
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

      // if data never binded or we want to clone a build (for radio & checkboxes), bind it right now!
      if ( !data ) {
        switch ( type ) {
          case 'parsleyForm':
            data = new ParsleyForm( self, options );
            break;
          case 'parsleyField':
            data = new ParsleyField( self, options );
            break;
          case 'parsleyFieldMultiple':
            data = new ParsleyFieldMultiple( self, options );
            break;
          default:
            return;
        }

        $( self ).data( type, data );
      }

      // here is our parsley public function accessor
      if ( 'string' === typeof option && 'function' === typeof data[ option ] ) {
        return data[ option ]( fn );
      }
    }

    // if a form elem is given, bind all its input children
    if ( $( this ).is( 'form' ) ) {
      returnValue = bind ( $( this ), 'parsleyForm' );

    // if it is a Parsley supported single element, bind it too, except inputs type hidden
    // add here a return instance, cuz' we could call public methods on single elems with data[ option ]() above
    } else if ( $( this ).is( options.inputs ) && !$( this ).is( options.excluded ) ) {
      returnValue = bind( $( this ), !$( this ).is( 'input[type=radio], input[type=checkbox]' ) ? 'parsleyField' : 'parsleyFieldMultiple' );
    }

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
    // basic data-api overridable properties here..
    inputs: 'input, textarea, select'   // Default supported inputs.
    , excluded: 'input[type=hidden]'    // Do not validate input[type=hidded].
    , trigger: false                    // $.Event() that will trigger validation. eg: keyup, change..
    , focus: 'first'                    // 'fist'|'last'|'none' which error field would have focus first on form validation
    , validationMinlength: 3            // If trigger validation specified, only if value.length > validationMinlength
    , successClass: 'parsley-success'   // Class name on each valid input
    , errorClass: 'parsley-error'       // Class name on each invalid input
    , validators: {}                    // Add your custom validators functions
    , messages: {}                      // Add your own error messages here

    //some quite advanced configuration here..
    , error: {
        classHandler: function ( elem ) {}                                // class is directly set on elem, parent for radio/checkboxes
      , container: function ( elem, template, isRadioOrCheckbox ) {}      // error ul is inserted after elem, parent for radio/checkboxes
      , errorsWrapper: '<ul></ul>'                                        // do not set an id for this elem
      , errorElem: '<li></li>'
      }
    , listeners: {
        onFieldValidate: function ( elem ) { return false; }              // Return true to force field to be valid, false otherwise
      , onFormSubmit: function ( isFormValid, event, focusedField ) {}    // Executed once on form validation
      , onFieldError: function ( field, constraint ) {}                   // Executed when a field is detected as invalid
    }
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