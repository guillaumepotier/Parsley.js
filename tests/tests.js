'use strict';

window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    // deactivate errors animation, causing travis test suite failing
    animate: false
  , messages: {
    type: {
      urlstrict: "urlstrict global override."
    }
  }
} );

var triggerSubmitValidation = function ( idOrClass, value ) {
  $( idOrClass ).val( value );
  $( idOrClass ).parsley( 'validate' );
}

var triggerEventChangeValidation = function ( idOrClass, value ) {
  $( idOrClass ).val( value );
  triggerEventValidation( idOrClass );
}

var triggerEventValidation = function ( idOrClass ) {
  // eventValidation expects a jQuery Event object, with type like 'keyup', 'change'. Emulate a neutral one
  $( idOrClass ).parsley( 'eventValidation', { type: null } );
}

var getErrorMessage = function ( idOrClass, constraintName ) {
  return $( '#' + $( idOrClass ).parsley( 'getHash' ) + ' li.' + constraintName ).text();
}

$( '#validate-form' ).parsley( { listeners: {
  onFormSubmit: function ( isFormValid, event ) {
    $( '#validate-form' ).addClass( isFormValid ? 'form-valid' : 'form-invalid' );
    event.preventDefault();
  }
} } );

$( '#focus-form' ).parsley( { listeners: {
  onFormSubmit: function ( isFormValid, event, ParsleyForm ) {
    $( ParsleyForm.focusedField ).addClass( 'on-focus' );
  }
} } );

$( '#focus-form2' ).parsley( { listeners: {
  onFormSubmit: function ( isFormValid, event, ParsleyForm ) {
    if ( ParsleyForm.focusedField ) {
      $( ParsleyForm.$element ).addClass( 'focus-on' );
    } else {
      $( ParsleyForm.$element ).addClass( 'focus-off' );
    }
  }
} } );

$( '#validator-tests' ).parsley( {
  validators: {
    multiple: function ( val, multiple ) {
      return val % multiple === 0;
    }
  }
  , messages: {
      multiple: 'This field should be a multiple of %s'
  }
} );

$( '#onFieldValidate-form' ).parsley( { listeners: {
  onFieldValidate: function ( elem ) {
    if ( $( elem ).val() === "foo" || $( elem ).val() === "bar" ) {
      return true;
    }

    return false;
  },
  onFieldError: function ( field, constraints ) {
    for ( var i in constraints ) {
      $( field ).addClass( 'error-' + constraints[ i ].name + '_' + constraints[ i ].requirements );
    }
  },
  onFieldSuccess: function ( field ) {
    if ('foo@foo.foo' === field.val()) {
      return false;
    }

    $( field ).addClass( 'success-foo-bar' );
  },
  onFormSubmit: function ( isFormValid, event, focusField ) {
    $( '#onFieldValidate-form' ).addClass( 'this-form-is-invalid' );
  }
} } );

$( '#change-show-errors' ).parsley( {
  listeners: {
    onFieldValidate: function ( elem ) {
      $( elem ).addClass( 'onFieldValidate' );
    },
    onFieldError: function ( elem, constraints ) {
      $( elem ).addClass( 'onFieldError' );
    },
    onFieldSuccess: function ( elem ) {
      $( elem ).addClass( 'onFieldSuccess' );
    }
  }
} );

$( '#listeners-form' ).parsley( 'addListener', {
  onFormSubmit: function ( isFormValid, event, focusField ) {
    $( '#listeners-form' ).addClass( 'onFormSubmit-ok' );
  }
} );

$( '#scenario-validation-after-field-reset' ).data( 'callCount', 0 );
$( '#scenario-validation-after-field-reset' ).parsley( 'addListener', {
  onFieldError: function ( field ) {
    var callCount = $( '#scenario-validation-after-field-reset' ).data( 'callCount' );
    $( '#scenario-validation-after-field-reset' ).data( 'callCount', callCount + 1 );
  }
} );

var suiteVersion = $( '#info' ).text();

var testSuite = function () {
  describe ( suiteVersion, function () {

    /***************************************
            Fields validators binding
    ***************************************/
    describe ( 'Test Parsley auto binding', function () {
      it ( 'Items with validation methods inside a form validated by Parsley are binded', function () {
        expect( $( '#input1' ).hasClass( 'parsley-validated' ) ).to.be( true );
        expect( $( '#textarea1' ).hasClass( 'parsley-validated' ) ).to.be( false );
      } )
      it ( 'Items with validation methods can be validated as stand-alone too', function () {
        expect( $( '#input2' ).hasClass( 'parsley-validated' ) ).to.be( true );
        expect( $( '#textarea2' ).hasClass( 'parsley-validated' ) ).to.be( false );
      } )
      it ( 'Do not bind an input that type is hidden', function () {
        expect( $( '#hidden' ).hasClass( 'parsley-validated' ) ).to.be( false );
        expect( $( '#hidden' ).parsley( 'validate' ) ).to.be( null );
      } )
      it ( 'Should bind a DOM element with data-bind value set to true', function () {
        expect( $( '#bindNonFormInput' ).hasClass( 'parsley-validated' ) ).to.be( true );
      } )
    } )

    /***************************************
                trigger events
    ***************************************/
    describe ( 'Test inputs events', function () {
      var events = [ 'change', 'keyup' ];
        it ( 'Validators are triggered on jQuery events: ' + events.join( ', ' ) , function () {
          for ( var event in events ) {
            var value = ( ( parseInt( event ) + 1 ) % 2 ) * 100000 + 100;
            $( '#input1' ).val( value );
            $( '#input1' ).trigger( $.Event( events[event] ) );
            expect( $( '#input1' ).hasClass( 'parsley-error' ) ).to.be( value == 100 );
          }
        } )
    } )

    /***************************************
          Error & success detection
    ***************************************/
    describe ( 'Test Parsley error & success detection', function () {
      it ( 'If chars < minChars, on field change, do not trigger validation', function () {
        $( '#input2' ).val( 'foo' );
        $( '#input1' ).trigger( $.Event( 'change' ) );
        expect( $( '#input2' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#input2' ).hasClass( 'parsley-success' ) ).to.be( false );
      } )
      it ( 'If field fail one validation test, add error class', function () {
        triggerSubmitValidation( '#input2', 'foo@bar' );
        expect( $( '#input2' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( $( '#input2' ).hasClass( 'parsley-success' ) ).to.be( false );
      } )
      it ( 'If field verify all validation tests, add success class', function () {
        triggerSubmitValidation( '#input2', 'foo@bar.baz' );
        expect( $( '#input2' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#input2' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
    } )

    /***************************************
          Error messages management
    ***************************************/
    describe ( 'Test Parsley error messages management', function () {
      var fieldHash =  $( '#errormanagement' ).parsley( 'getHash' );

      it ( 'Test two errors on the same field', function () {
        triggerSubmitValidation( '#errormanagement', 'foo@' );
        expect( $( '#' + fieldHash + ' li' ).length ).to.be( 2 );
        expect( $( '#' + fieldHash + ' li.type' ).length ).to.be( 1 );
        expect( $( '#' + fieldHash + ' li.minlength' ).length ).to.be( 1 );
        expect( $( '#errormanagement' ).hasClass( 'parsley-error' ) ).to.be( true );
      } )
      it ( 'If one error is fixed, show the remaining one', function () {
        triggerSubmitValidation( '#errormanagement', 'foo' );
        expect( $( '#' + fieldHash + ' li' ).length ).to.be( 1 );
        expect( $( '#' + fieldHash + ' li.minlength' ).length ).to.be( 1 );
        expect( $( '#errormanagement' ).hasClass( 'parsley-error' ) ).to.be( true );
      } )
      it ( 'If there are no more errors, full validation ok', function () {
        triggerSubmitValidation( '#errormanagement', 'foobar' );
        expect( $( '#' + fieldHash ).length ).to.be( 0 );
        expect( $( '#errormanagement' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'If custom message is set, show only it and show it once', function () {
        triggerSubmitValidation( '#errorMessage', 'foobar' );
        expect( $( '#errorMessage' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( $( '#' + $( '#errorMessage' ).parsley( 'getHash' ) + ' li' ).length ).to.be( 1 );
      } )
      it ( 'Test that error messages could be html', function () {
        $( '#errorMessage' ).val( 'foobar' ).parsley( 'validate' );
        expect( $( '#' + $( '#errorMessage' ).parsley( 'getHash' ) + ' li' ).text() ).to.be( 'This is my custom message' );
      })
    } )

    /***************************************
                test validators
    ***************************************/
    describe ( 'Test validators', function () {
      it ( 'notblank', function () {
        triggerSubmitValidation( '#notblank', '   ' );
        expect( $( '#notblank' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#notblank', 'notblank') ).to.be( 'This value should not be blank.' );
        triggerSubmitValidation( '#notnull', 'foo' );
        expect( $( '#notnull' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'required - data-api', function () {
        triggerSubmitValidation( '#required', '' );
        expect( $( '#required' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#required', 'required') ).to.be( 'This value is required.' );
        triggerSubmitValidation( '#required', '  ' );
        expect( $( '#required' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#required', '  foo' );
        expect( $( '#required' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'required - class-api', function () {
        triggerSubmitValidation( '#required-class', '' );
        expect( $( '#required-class' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#required-class', 'required') ).to.be( 'This value is required.' );
        triggerSubmitValidation( '#required-class', '  ' );
        expect( $( '#required-class' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#required-class', '  foo' );
        expect( $( '#required-class' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'required - html5-api', function () {
        triggerSubmitValidation( '#required-html5', '' );
        expect( $( '#required-html5' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#required-html5', 'required') ).to.be( 'This value is required.' );
        triggerSubmitValidation( '#required-html5', '  ' );
        expect( $( '#required-html5' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#required-html5', '  foo' );
        expect( $( '#required-html5' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'required - html5-api bis', function () {
        triggerSubmitValidation( '#required-html5-bis', '' );
        expect( $( '#required-html5-bis' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#required-html5-bis', 'required') ).to.be( 'This value is required.' );
        triggerSubmitValidation( '#required-html5-bis', '  ' );
        expect( $( '#required-html5-bis' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#required-html5-bis', '  foo' );
        expect( $( '#required-html5-bis' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'required - select multiple', function () {
        expect( $( '#required-selectmultiple' ).parsley( 'validate' ) ).to.be( false );
      } )
      it ( 'minlength', function () {
        triggerSubmitValidation( '#minlength', '12345' );
        expect( $( '#minlength' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#minlength', 'minlength') ).to.be( 'This value is too short. It should have 6 characters or more.' );
        triggerSubmitValidation( '#minlength', '123456' );
        expect( $( '#minlength' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'maxlength', function () {
        triggerSubmitValidation( '#maxlength', '12345678' );
        expect( $( '#maxlength' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#maxlength', 'maxlength') ).to.be( 'This value is too long. It should have 6 characters or less.' );
        triggerSubmitValidation( '#maxlength', '12345' );
        expect( $( '#maxlength' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'rangelength', function () {
        triggerSubmitValidation( '#rangelength', '12345678910' );
        expect( $( '#rangelength' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#rangelength', 'rangelength') ).to.be( 'This value length is invalid. It should be between 6 and 10 characters long.' );
        triggerSubmitValidation( '#rangelength', '1234567' );
        expect( $( '#rangelength' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'min', function () {
        triggerSubmitValidation( '#min', '8' );
        expect( $( '#min' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#min', 'min') ).to.be( 'This value should be greater than or equal to 10.' );
        triggerSubmitValidation( '#min', '12' );
        expect( $( '#min' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'min html5', function () {
        triggerSubmitValidation( '#min-html5', 12 );
        expect( $( '#min-html5' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'max html5', function () {
        triggerSubmitValidation( '#max-html5', 8 );
        expect( $( '#max-html5' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'max', function () {
        triggerSubmitValidation( '#max', '12' );
        expect( $( '#max' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#max', 'max') ).to.be( 'This value should be lower than or equal to 10.' );
        triggerSubmitValidation( '#max', '10' );
        expect( $( '#max' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'range', function () {
        triggerSubmitValidation( '#range', '12' );
        expect( $( '#range' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#range', 'range') ).to.be( 'This value should be between 6 and 10.' );
        triggerSubmitValidation( '#range', '2' );
        expect( $( '#range' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#range', '8' );
        expect( $( '#range' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'regexp', function () {
        triggerSubmitValidation( '#regexp', 'foo' );
        expect( $( '#regexp' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#regexp', 'regexp') ).to.be( 'This value seems to be invalid.' );
        triggerSubmitValidation( '#regexp', '42' );
        expect( $( '#regexp' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'regexp with custom flag', function () {
        triggerSubmitValidation( '#regexp-flag1', 'foo' );
        expect( $( '#regexp-flag1' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#regexp-flag1', 'Foo' );
        expect( $( '#regexp-flag1' ).hasClass( 'parsley-success' ) ).to.be( true );

        // passing 'i' flag, case unsensitive make allways regexp pass
        triggerSubmitValidation( '#regexp-flag2', 'foo' );
        expect( $( '#regexp-flag2' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerSubmitValidation( '#regexp-flag2', 'Foo' );
        expect( $( '#regexp-flag2' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'pattern html5-regexp', function () {
        triggerSubmitValidation( '#regexp-html5', 'foo' );
        expect( $( '#regexp-html5' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#regexp-html5', 'regexp') ).to.be( 'This value seems to be invalid.' );
        triggerSubmitValidation( '#regexp-html5', '42');
        expect( $( '#regexp-html5' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )

      var urls = [
          { url: "http://foo.com/bar_(baz)#bam-1", expected: true, strict: true }
        , { url: "http://www.foobar.com/baz/?p=364", expected: true, strict: true }
        , { url: "mailto:name@example.com", expected: true, strict: false }
        , { url: "foo.bar", expected: true, strict: false }
        , { url: "www.foobar.baz", expected: true, strict: false }
        , { url: "https://foobar.baz", expected: true, strict: true }
        , { url: "git://foobar.baz", expected: true, strict: true }
        , { url: "foo", expected: false, strict: false }
        , { url: "foo:bar", expected: false, strict: false }
        , { url: "foo://bar", expected: false, strict: false }

        // absolutely finish by false to test error message
        , { url: "ého", expected: false, strict: false }
      ];

      it ( 'url', function () {
        for ( var i in urls ) {
          $( '#typeurl' ).val( urls[i].url );
          expect( $( '#typeurl' ).parsley( 'validate' ) ).to.be( urls[ i ].expected );
        }
        triggerSubmitValidation( '#typeurl', 'foo' );
        expect( getErrorMessage( '#typeurl', 'type') ).to.be( 'This value should be a valid url.' );
      } )
      it ( 'url html5', function () {
        $( '#typeurl-html5' ).val( "http://foo.bar" );
        expect( $( '#typeurl-html5' ).parsley( 'validate' ) ).to.be( true );
      } )
      it ( 'url strict + global config overriding type message', function () {
        for ( var i in urls ) {
          $( '#typeurlstrict' ).val( urls[i].url );
          expect( $( '#typeurlstrict' ).parsley( 'validate' ) ).to.be( urls[ i ].strict );
        }
        triggerSubmitValidation( '#typeurlstrict', 'foo' );
        expect( getErrorMessage( '#typeurlstrict', 'type') ).to.be( 'urlstrict global override.' );
      } )
      it ( 'email', function () {
        triggerSubmitValidation( '#typeemail', 'foo' );
        expect( $( '#typeemail' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#typeemail', 'type') ).to.be( 'This value should be a valid email.' );
        triggerSubmitValidation( '#typeemail', 'foo@bar' );
        expect( $( '#typeemail' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#typeemail', 'foo@bar.com' );
        expect( $( '#typeemail' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerSubmitValidation( '#typeemail', 'foo+baz@bar.com' );
        expect( $( '#typeemail' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerSubmitValidation( '#typeemail', 'foo.bar@gmail.com' );
        expect( $( '#typeemail' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerSubmitValidation( '#typeemail', 'foo.bar@bar.com.ext' );
        expect( $( '#typeemail' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'email html5', function () {
        triggerSubmitValidation( '#typeemail-html5', 'foo@bar.com' );
        expect( $( '#typeemail-html5' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'range html5', function () {
        triggerSubmitValidation( '#typerange-html5', 8 );
        expect( $( '#typerange-html5' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'digits', function () {
        triggerSubmitValidation( '#typedigits', 'foo' );
        expect( $( '#typedigits' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#typedigits', 'type') ).to.be( 'This value should be digits.' );
        triggerSubmitValidation( '#typedigits', '42.2' );
        expect( $( '#typedigits' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#typedigits', '42' );
        expect( $( '#typedigits' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'dateIso', function () {
        triggerSubmitValidation( '#typedateIso', 'foo' );
        expect( $( '#typedateIso' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#typedateIso', 'type') ).to.be( 'This value should be a valid date (YYYY-MM-DD).' );
        triggerSubmitValidation( '#typedateIso', '2012-12-12' );
        expect( $( '#typedateIso' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'phone', function () {
        triggerSubmitValidation( '#typephone', 'foo' );
        expect( $( '#typephone' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#typephone', 'type') ).to.be( 'This value should be a valid phone number.' );
        triggerSubmitValidation( '#typephone', '(917) 5878 5457' );
        expect( $( '#typephone' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'number', function () {
        triggerSubmitValidation( '#typenumber', 'foo' );
        expect( $( '#typenumber' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#typenumber', 'type') ).to.be( 'This value should be a valid number.' );
        triggerSubmitValidation( '#typenumber', '007' );
        expect( $( '#typenumber' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerSubmitValidation( '#typenumber', '42.5' );
        expect( $( '#typenumber' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'aphanum', function () {
        triggerSubmitValidation( '#typealphanum', '@&' );
        expect( $( '#typealphanum' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#typealphanum', 'type') ).to.be( 'This value should be alphanumeric.' );
        triggerSubmitValidation( '#typealphanum', 'parsley.js' );
        expect( $( '#typealphanum' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#typealphanum', 'parsley12' );
        expect( $( '#typealphanum' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerSubmitValidation( '#typealphanum', 'foo' );
        expect( $( '#typealphanum' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'equalTo', function () {
        triggerSubmitValidation( '#equalTo', 'foo' );
        expect( $( '#equalTo' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#equalTo', 'equalTo') ).to.be( 'This value should be the same.' );
        triggerSubmitValidation( '#equalTo', 'foobar' );
        expect( $( '#equalTo' ).hasClass( 'parsley-success' ) ).to.be( true );
        $( '#equalTo-model' ).val( 'baz' );
        $( '#equalTo' ).parsley( 'validate' );
        expect( $( '#equalTo' ).hasClass( 'parsley-error' ) ).to.be( true );
      } )
      it ( 'customvalidator', function () {
        triggerSubmitValidation( '#customvalidator', 'foo' );
        expect( $( '#customvalidator' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#customvalidator', 'multiple') ).to.be( 'This field should be a multiple of 9' );
        triggerSubmitValidation( '#customvalidator', '10' );
        expect( $( '#customvalidator' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#customvalidator', '18' );
        expect( $( '#customvalidator' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      describe ( 'Test radio / checkboxes specific validators', function () {
        it ( 'mincheck', function () {
          $( '#checkbox-mincheck1' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-mincheck1' ).parsley( 'validate' ) ).to.be( false );
          expect( getErrorMessage( '#checkbox-mincheck1', 'mincheck') ).to.be( 'You must select at least 2 choices.' );
          $( '#checkbox-mincheck2' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-mincheck1' ).parsley( 'validate' ) ).to.be( true );
        } )
        it ( 'mincheck data-group', function () {
          $( '#checkbox-mincheckgroup1' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-mincheckgroup1' ).parsley( 'validate' ) ).to.be( false );
          expect( getErrorMessage( '#checkbox-mincheckgroup1', 'mincheck') ).to.be( 'You must select at least 2 choices.' );
          $( '#checkbox-mincheckgroup2' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-mincheckgroup1' ).parsley( 'validate' ) ).to.be( true );
        } )
        it ( 'maxcheck', function () {
          $( '#checkbox-maxcheck1' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-maxcheck1' ).parsley( 'validate' ) ).to.be( true );
          $( '#checkbox-maxcheck2' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-maxcheck1' ).parsley( 'validate' ) ).to.be( true );
          $( '#checkbox-maxcheck3' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-maxcheck1' ).parsley( 'validate' ) ).to.be( false );
          expect( getErrorMessage( '#checkbox-maxcheck1', 'maxcheck') ).to.be( 'You must select 2 choices or less.' );
        } )
        it ( 'rangecheck', function () {
          $( '#checkbox-rangecheck1' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-rangecheck1' ).parsley( 'validate' ) ).to.be( false );
          $( '#checkbox-rangecheck2' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-rangecheck1' ).parsley( 'validate' ) ).to.be( true );
          $( '#checkbox-rangecheck3' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-rangecheck1' ).parsley( 'validate' ) ).to.be( true );
          $( '#checkbox-rangecheck4' ).attr( 'checked', 'checked' );
          expect( $( '#checkbox-rangecheck1' ).parsley( 'validate' ) ).to.be( false );
          expect( getErrorMessage( '#checkbox-rangecheck1', 'rangecheck') ).to.be( 'You must select between 2 and 3 choices.' );
        } )
      } )
      describe ( 'Test remote validator', function () {
        describe ( 'Test parameters and config', function () {
          before( function () {
            sinon.stub( $, "ajax" );
          } )

          it ( 'Make an ajax request when remote-validator is used to passed url', function () {
            $( '#remote1' ).val( 'foobar' );
            $( '#remote1' ).parsley( 'validate' );
            expect( $.ajax.calledWithMatch( { type: "GET" } ) ).to.be( true );
            expect( $.ajax.calledWithMatch( { url: "http://foo.bar" } ) ).to.be( true );
            expect( $.ajax.calledWithMatch( { data: { remote1: "foobar" } } ) ).to.be( true );
            expect( $.ajax.calledWithMatch( { dataType: "jsonp" } ) ).to.be( true );
          } )
          it ( 'Test ajax call parameters overriding', function () {
            $( '#remote2' ).val( 'foo' );
            $( '#remote2' ).parsley( 'validate' );
            expect( $.ajax.calledWithMatch( { type: "POST" } ) ).to.be( true );
          } )

          after( function () {
            $.ajax.restore();
          });
        } )

        // not passing on phantomJS yet..
        describe ( 'Test ASYNC ajax calls results', function () {
          it ( 'Test success true', function ( done ) {
            sinon.stub( $, "ajax" ).yieldsTo( 'success' , "true" );
            $( '#remote2' ).val( 'foo' ).trigger( $.Event( 'change' ) );
            expect( $( '#remote2' ).parsley( 'isValid' ) ).to.be( true )
            done();
          } )
          it ( 'Test error 404', function ( done ) {
            sinon.stub( $, "ajax" ).yieldsTo( 'error' , "" );
            $( '#remote2' ).val( 'bar' ).trigger( $.Event( 'change' ) );
            expect( $( '#remote2' ).parsley( 'isValid' ) ).to.be( false )
            done();
          } )
          it ( 'Test success false', function ( done ) {
            sinon.stub( $, "ajax" ).yieldsTo( 'success' , "false" );
            $( '#remote2' ).val( 'baz' ).trigger( $.Event( 'change' ) );
            expect( $( '#remote2' ).parsley( 'isValid' ) ).to.be( false )
            done();
          } )
          it ( 'Test success 1', function ( done ) {
            sinon.stub( $, "ajax" ).yieldsTo( 'success' , "1" );
            $( '#remote2' ).val( 'foo' ).trigger( $.Event( 'change' ) );
            expect( $( '#remote2' ).parsley( 'isValid' ) ).to.be( true )
            done();
          } )
          it ( 'Test success 0', function ( done ) {
            sinon.stub( $, "ajax" ).yieldsTo( 'success' , "0" );
            $( '#remote2' ).val( 'bar' ).trigger( $.Event( 'change' ) );
            expect( $( '#remote2' ).parsley( 'isValid' ) ).to.be( false )
            done();
          } )
          it ( 'Test success with { success: "message" }', function ( done ) {
            sinon.stub( $, "ajax" ).yieldsTo( 'success' , "{\"success\": \"foo\"}" );
            $( '#remote2' ).val( 'baz' ).trigger( $.Event( 'change' ) );
            expect( $( '#remote2' ).parsley( 'isValid' ) ).to.be( true )
            done();
          } )
          it ( 'Test success with { error: "message" } + display message ', function ( done ) {
            sinon.stub( $, "ajax" ).yieldsTo( 'success' , "{\"error\": \"foobar\"}" );
            $( '#remote2' ).val( 'foo' ).trigger( $.Event( 'change' ) );
            expect( $( '#remote2' ).parsley( 'isValid' ) ).to.be( false )
            expect( getErrorMessage( '#remote2', 'remote') ).to.be( 'foobar' );
            done();
          } )
          it ( 'Test error 500 + error', function ( done ) {
            sinon.stub( $, "ajax" ).yieldsTo( 'error' , "{\"error\": \"foobarbaz\"}" );
            $( '#remote2' ).val( 'bar' ).trigger( $.Event( 'change' ) );
            expect( $( '#remote2' ).parsley( 'isValid' ) ).to.be( false )
            expect( getErrorMessage( '#remote2', 'remote') ).to.be( 'foobarbaz' );
            done();
          } )
          it ( 'Test error 500 + message', function ( done ) {
            sinon.stub( $, "ajax" ).yieldsTo( 'error' , "{\"message\": \"foo\"}" );
            $( '#remote2' ).val( 'baz' ).trigger( $.Event( 'change' ) );
            expect( $( '#remote2' ).parsley( 'isValid' ) ).to.be( false )
            expect( getErrorMessage( '#remote2', 'remote') ).to.be( 'foo' );
            done();
          } )
          afterEach( function () {
            $.ajax.restore();
          } );
        } )

      } )
    } )

    /***************************************
         override value with data-value
    ***************************************/
    describe ( 'Override value with data-value' , function () {
      it ( 'required - data-value is empty, value is empty', function () {
        triggerSubmitValidation( '#datavalue1', '' );
        expect( $( '#datavalue1' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#datavalue1', 'required') ).to.be( 'This value is required.' );
      } )
      it ( 'required - data-value has value, value is empty', function () {
        triggerSubmitValidation( '#datavalue2', '' );
        expect( $( '#datavalue2' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
    } )

    /***************************************
          test options changes
    ***************************************/
    describe ( 'Test options changes', function () {
      it ( 'Change min char validation tresshold', function () {
        // default min char validation is set to 3. here we expect an email value
        // it should normally throw an error, but not here, since custom tresshlod is set to 7
        triggerEventChangeValidation( '#minchar-change', 'foobar' );
        expect( $( '#minchar-change' ).hasClass( 'parsley-success' ) ).to.be( false );
        expect( $( '#minchar-change' ).hasClass( 'parsley-error' ) ).to.be( false );

        // here we passed the 7 char length, throw error
        triggerEventChangeValidation( '#minchar-change', 'foobarbaz' );
        expect( $( '#minchar-change' ).hasClass( 'parsley-error' ) ).to.be( true );
      } )
      it ( 'Change showError option', function () {
        // first field is wrong, but no errors/messages shown in dom
        $( '#change-show-errors-field1' ).val( 'foo' );
        $( '#change-show-errors-field1' ).trigger( $.Event( 'keyup' ) );
        expect( $( '#change-show-errors-field1' ).hasClass( 'parsley-validated' ) ).to.be( true );
        expect( $( '#change-show-errors-field1' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#change-show-errors-field1' ).hasClass( 'parsley-success' ) ).to.be( false );
        expect( $( '#change-show-errors-field1').hasClass( 'onFieldValidate') ).to.be( true );
        expect( $( '#change-show-errors-field1').hasClass( 'onFieldError') ).to.be( true );
        expect( $( '#change-show-errors-field1').hasClass( 'onFieldSuccess') ).to.be( false );
        // isValid for this field returns false
        expect( $( '#change-show-errors-field1' ).parsley( 'isValid' ) ).to.be( false );
        // second field is false too and nothing is shown in dom too
        $( '#change-show-errors-field2' ).val( 'foo' );
        expect( $( '#change-show-errors-field2' ).parsley( 'validate' ) ).to.be( false );
        expect( $( '#change-show-errors-field2' ).hasClass( 'parsley-validated' ) ).to.be( true );
        expect( $( '#change-show-errors-field2' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#change-show-errors-field2' ).hasClass( 'parsley-success' ) ).to.be( false );
        // so form is false
        expect( $( '#change-show-errors' ).parsley( 'validate' ) ).to.be( false );
        // first field is valid now, but still nothing is shown
        $( '#change-show-errors-field1' ).val( 'foo@bar.baz' );
        expect( $( '#change-show-errors-field1' ).parsley( 'validate' ) ).to.be( true );
        expect( $( '#change-show-errors-field2' ).hasClass( 'parsley-validated' ) ).to.be( true );
        expect( $( '#change-show-errors-field2' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#change-show-errors-field2' ).hasClass( 'parsley-success' ) ).to.be( false );
        expect( $( '#change-show-errors-field1').hasClass( 'onFieldSuccess') ).to.be( true );
        // form is still not valid
        expect( $( '#change-show-errors' ).parsley( 'validate' ) ).to.be( false );
        // second field finaly is valid
        $( '#change-show-errors-field2' ).val( 'foo.bar' );
        expect( $( '#change-show-errors-field2' ).parsley( 'validate' ) ).to.be( true );
        expect( $( '#change-show-errors-field2' ).hasClass( 'parsley-validated' ) ).to.be( true );
        expect( $( '#change-show-errors-field2' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#change-show-errors-field2' ).hasClass( 'parsley-success' ) ).to.be( false );
        // and form is now valid
        expect( $( '#change-show-errors' ).parsley( 'validate' ) ).to.be( true );
      } )
      it ( 'Change differently errors messages for two same validators on different forms', function () {
        $( '#requiredchanged1-form' ).parsley( { messages: { required: "required 1" } } );
        $( '#requiredchanged2-form' ).parsley( { messages: { required: "required 2" } } );
        triggerSubmitValidation( '#requiredchanged1', '' );
        triggerSubmitValidation( '#requiredchanged2', '' );
        expect( getErrorMessage( '#requiredchanged1', 'required') ).to.be( 'required 1' );
        expect( getErrorMessage( '#requiredchanged2', 'required') ).to.be( 'required 2' );
      } )
      it ( 'Change error messages with data-api', function () {
        triggerSubmitValidation( '#requiredchanged3', '' );
        expect( getErrorMessage( '#requiredchanged3', 'required') ).to.be( 'custom required' );

        triggerSubmitValidation( '#requiredchanged3', 'foo' );
        expect( getErrorMessage( '#requiredchanged3', 'type') ).to.be( 'custom email' );
      } )
      it ( 'Change error handler', function () {
        $( '#errorsmanagement-form' ).parsley( {
            successClass: 'parsley-great'
          , errorClass: 'parsley-fail'
          , errors: {
            classHandler: function () {
              return $( '#errorsmanagement-labelinfo' );
            }
            , container: function () {
              return $( '#errorsmanagement-labelerror' );
            }
            , errorsWrapper: '<div></div>'
            , errorElem: '<span></span>'
          }
        } );
        $( '#errorsmanagement-email' ).val( 'foo' ).parsley( 'validate' );
        expect( $( '#errorsmanagement-labelinfo' ).hasClass( 'parsley-fail' ) ).to.be( true );
        expect( $( '#errorsmanagement-labelerror div.parsley-error-list span.type' ).length ).to.be( 1 );
        $( '#errorsmanagement-email' ).val( 'foo@bar.baz' ).parsley( 'validate' );
        expect( $( '#errorsmanagement-labelerror div' ).length ).to.be( 0 );
        expect( $( '#errorsmanagement-labelinfo' ).hasClass( 'parsley-great' ) ).to.be( true );
      } )
    } )

    /***************************************
         test field validation scenarios
    ***************************************/
    describe ( 'Test field validation scenarios', function () {
      it ( 'Test multiple constraints/errors required field scenario', function () {
        var fieldHash = $( '#scenario-multiple-errors-and-required' ).parsley( 'getHash' );
        expect( $( '#scenario-multiple-errors-and-required' ).parsley( 'validate' ) ).to.be( false );
        expect( $( 'ul#' + fieldHash + ' li' ).length ).to.be( 1 );
        expect( $( 'ul#' + fieldHash + ' li' ).eq( 0 ).hasClass( 'required' ) ).to.be( true );

        $( '#scenario-multiple-errors-and-required' ).val( 'foo@bar.com' );
        expect( $( '#scenario-multiple-errors-and-required' ).parsley( 'validate' ) ).to.be( false );
        expect( $( 'ul#' + fieldHash + ' li' ).length ).to.be( 1 );
        expect( $( 'ul#' + fieldHash + ' li' ).eq( 0 ).hasClass( 'rangelength' ) ).to.be( true );

        $( '#scenario-multiple-errors-and-required' ).val( 'foo' );
        expect( $( '#scenario-multiple-errors-and-required' ).parsley( 'validate' ) ).to.be( false );
        expect( $( 'ul#' + fieldHash + ' li' ).length ).to.be( 2 );
      } )
      it ( 'Test keyup scenario for non-required field', function () {
        // do not pass the 3 chars min trigger
        $( '#scenario-not-required' ).val( 'fo' );
        triggerEventValidation( '#scenario-not-required' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-success' ) ).to.be( false );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-error' ) ).to.be( false );

        // val.length >= 3, validation is done
        $( '#scenario-not-required' ).val( 'foob' );
        triggerEventValidation( '#scenario-not-required' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-error' ) ).to.be( true );

        // pass validation
        $( '#scenario-not-required' ).val( 'foobar' );
        triggerEventValidation( '#scenario-not-required' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-success' ) ).to.be( true );

        // re-fail validation
        $( '#scenario-not-required' ).val( 'fooba' );
        triggerEventValidation( '#scenario-not-required' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-error' ) ).to.be( true );

        // then, delete field value. Field is not required. Remove errors, remove parsley classes
        $( '#scenario-not-required' ).val( '' );
        triggerEventValidation( '#scenario-not-required' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-success' ) ).to.be( false );
      } )
      it ( 'Test auto-keyup binding when field has errors', function () {
        // keyup do not trigger validation since validation is explicitely triggered on change
        $( '#scenario-keyup-when-notvalid' ).val( 'foobar' );
        $( '#scenario-keyup-when-notvalid' ).trigger( $.Event( 'keyup' ) );
        expect( $( '#scenario-keyup-when-notvalid' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#scenario-keyup-when-notvalid' ).hasClass( 'parsley-success' ) ).to.be( false );

        // then, if we trigger change event, field is checked and considered invalid
        $( '#scenario-keyup-when-notvalid' ).trigger( $.Event( 'change' ) );
        expect( $( '#scenario-keyup-when-notvalid' ).hasClass( 'parsley-error' ) ).to.be( true );

        // then, for better UX, keypress is activated to remove asap this error status
        $( '#scenario-keyup-when-notvalid' ).val( 'foo@bar.baz' );
        $( '#scenario-keyup-when-notvalid' ).trigger( $.Event( 'keyup' ) );
        expect( $( '#scenario-keyup-when-notvalid' ).hasClass( 'parsley-success' ) ).to.be( true );

        // than keypress is alaways listened, to avoid false values with success classes, until real trigger event is fired..
        $( '#scenario-keyup-when-notvalid' ).val( 'foo@bar' );
        $( '#scenario-keyup-when-notvalid' ).trigger( $.Event( 'keyup' ) );
        expect( $( '#scenario-keyup-when-notvalid' ).hasClass( 'parsley-success' ) ).to.be( false );
      } )
      it ( 'Test auto-change binding when select has errors', function () {
        expect( $( '#scenario-validation-change-select' ).parsley( 'validate' ) ).to.be( false );
        expect( $( '#scenario-validation-change-select' ).hasClass( 'parsley-error' ) ).to.be( true );
        $( '#scenario-validation-change-select' ).val( 'foo' ).trigger( $.Event( 'change' ) );
        expect( $( '#scenario-validation-change-select' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'Test validation of unchanged fields after reset() has been called on them', function () {
        $( '#scenario-validation-after-field-reset' ).val( '' );

        // Validate Field, setting the call count to 1
        $( '#scenario-validation-after-field-reset' ).parsley( 'validate' );

        // Reset the field and trigger validation via keyup event
        $( '#scenario-validation-after-field-reset' ).parsley( 'reset' );
        $( '#scenario-validation-after-field-reset' ).trigger( $.Event( 'keyup' ) );

        expect( $( '#scenario-validation-after-field-reset' ).data( 'callCount' ) ).to.be( 1 );
      } )
      it ( 'Test always validate field', function () {
        $( '#alwaysValidate-form' ).parsley( { validateIfUnchanged: true, listeners: { onFieldError: function ( elem ) {
          if ( 'undefined' === typeof $( elem ).data( 'count' ) ) {
            $( elem ).data( 'count', 0 );
          }
          $( elem ).data( 'count', parseInt( $( elem ).data( 'count' ) ) + 1 );
        } } } );
        $( '#alwaysValidate' ).val( 'foo' ).parsley( 'validate' );
        expect( $( '#alwaysValidate' ).data( 'count' ) ).to.be( 1 );
        $( '#alwaysValidate' ).parsley( 'validate' );
        $( '#alwaysValidate' ).parsley( 'validate' );
        expect( $( '#alwaysValidate' ).data( 'count' ) ).to.be( 3 );
      } )
      it ( 'Test data-trigger="change" on multiple inputs', function () {
        $( '#checkbox-maxcheck1' ).parsley( 'reset' );
        $( '#checkbox-maxcheck1' ).attr( 'checked', 'checked' );
        $( '#checkbox-maxcheck2' ).attr( 'checked', 'checked' );
        $( '#checkbox-maxcheck3' ).attr( 'checked', 'checked' ).trigger( $.Event( 'change' ) );
        expect( $( 'ul#' + $( '#checkbox-maxcheck1' ).parsley( 'getHash' ) ).length ).to.be( 1 );
        expect( getErrorMessage( '#checkbox-maxcheck1', 'maxcheck') ).to.be( 'You must select 2 choices or less.' );
        $( '#checkbox-maxcheck3' ).attr( 'checked', null ).trigger( $.Event( 'change' ) );
        expect( $( 'ul#' + $( '#checkbox-maxcheck1' ).parsley( 'getHash' ) ).length ).to.be( 0 );
      } )
      it ( 'Test change validation for checkboxes', function () {
        // test on change auto triggered event to correct mistakes
        $( '#checkbox-maxcheckchange1' ).attr( 'checked', 'checked' );
        $( '#checkbox-maxcheckchange2' ).attr( 'checked', 'checked' );
        $( '#checkbox-maxcheckchange3' ).attr( 'checked', 'checked' ).trigger( $.Event( 'change' ) );
        expect( $( 'ul#' + $( '#checkbox-maxcheckchange1' ).parsley( 'getHash' ) ).length ).to.be( 0 );
        expect( $( '#checkbox-maxcheckchange1' ).parsley( 'validate' ) ).to.be( false );
        expect( $( 'ul#' + $( '#checkbox-maxcheckchange1' ).parsley( 'getHash' ) ).length ).to.be( 1 );
        $( '#checkbox-maxcheckchange2' ).attr( 'checked', null ).trigger( $.Event( 'change' ) );
        expect( $( 'ul#' + $( '#checkbox-maxcheckchange1' ).parsley( 'getHash' ) ).length ).to.be( 0 );

        // test explicitely change trigger
        $( '#checkbox-maxcheck3' ).parsley( 'destroy' );
        $( '#checkbox-maxcheck2' ).parsley( 'destroy' );
        $( '#checkbox-maxcheck1' ).parsley( 'destroy' ).parsley();
        $( '#checkbox-maxcheck1' ).attr( 'checked', 'checked' ).trigger( $.Event( 'change' ) );
        expect( $( 'ul#' + $( '#checkbox-maxcheck1' ).parsley( 'getHash' ) ).length ).to.be( 0 );
        $( '#checkbox-maxcheck2' ).attr( 'checked', 'checked' ).trigger( $.Event( 'change' ) );
        expect( $( 'ul#' + $( '#checkbox-maxcheck1' ).parsley( 'getHash' ) ).length ).to.be( 0 );
        $( '#checkbox-maxcheck3' ).attr( 'checked', 'checked' ).trigger( $.Event( 'change' ) );
        expect( $( 'ul#' + $( '#checkbox-maxcheck1' ).parsley( 'getHash' ) ).length ).to.be( 1 );
      } )
    } )

    /***************************************
              test form validation
    ***************************************/
    describe ( 'Test form validation', function () {
      it ( 'if a filed is not valid, form is not submitted', function () {
        $( '#validate2' ).val( '1234567' );
        $( '#validate-form-submit' ).click();
        expect( $( '#validate-form' ).hasClass( 'form-invalid' ) ).to.be( true );
      } )
      it ( 'if all fields are valid, form is submitted', function () {
        $( '#validate1' ).val( 'foo' );
        $( '#validate-form-submit' ).click();
        expect( $( '#validate-form' ).hasClass( 'form-valid' ) ).to.be( true );
      } )
      it ( 'test error focus', function () {
        $( '#focus-form' ).parsley( 'validate' );
        expect( $( '#focus1' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( $( '#focus2' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( $( '#focus2' ).hasClass( 'on-focus' ) ).to.be( true );
      } )
      it ( 'test error focus none', function () {
        $( '#focus-form2' ).parsley( 'validate' );
        expect( $( '#focus-form2' ).hasClass( 'focus-off' ) ).to.be( true );
      } )
      it ( 'test that hidden excluded inputs does not affect form validation', function () {
        expect( $( '#hidden-input-form' ).parsley( 'validate' ) ).to.be( false );
        $( '#hidden-input1' ).val( 'foo@bar.baz' );
        expect( $( '#hidden-input-form' ).parsley( 'validate' ) ).to.be( true );
      } )
      it ( 'test parsley(\'destroy\') on ParsleyField', function () {
        expect( $( '#destroy-email' ).hasClass( 'parsley-validated' ) ).to.be( true );
        expect( $( '#destroy-multiple' ).hasClass( 'parsley-validated' ) ).to.be( true );
        triggerSubmitValidation( '#destroy-email', 'foo@bar.baz' );
        triggerSubmitValidation( '#destroy-multiple', '' );
        expect( $( '#destroy-email' ).hasClass( 'parsley-success' ) ).to.be( true );
        expect( $( '#destroy-multiple' ).hasClass( 'parsley-error' ) ).to.be( true );
        $( '#destroy' ).parsley( 'destroy' );
        expect( $( '#destroy-email' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#destroy-email' ).hasClass( 'parsley-success' ) ).to.be( false );
        expect( $( '#destroy-email' ).hasClass( 'parsley-validated' ) ).to.be( false );
        expect( $( '#destroy-multiple' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#destroy-multiple' ).hasClass( 'parsley-validated' ) ).to.be( false );
        $( '#destroy-email' ).val( 'bar' );
        $( '#destroy-email' ).trigger( 'change' );
        $( '#destroy-multiple' ).trigger( 'change' );
        expect( $( '#destroy-email' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#destroy-multiple' ).hasClass( 'parsley-error' ) ).to.be( false );
      } )
      it ( 'test parsley(\'reset\')', function () {
          $('#reset').parsley('validate');
          expect( $('#reset-email').hasClass('parsley-error') ).to.be( true );
          expect( $('#reset-textarea').hasClass('parsley-error') ).to.be( true );
          $('#reset').parsley('reset');
          expect( $('#reset-email').hasClass('parsley-error')).to.be( false );
          expect( $('#reset-textarea').hasClass('parsley-error')).to.be( false );
      })
      it ( 'test parsley dynamic add item', function () {
        $( '#dynamic-form' ).append( '<input type="text" data-type="email" class="dynamic-email" data-trigger="change" value="foo" />' );
        var ParsleyForm = $( '#dynamic-form' ).parsley();
        expect( ParsleyForm.items.length ).to.be( 0 );
        expect( $( '#dynamic-form' ).parsley( 'validate' ) ).to.be( true );
        $( '#dynamic-form' ).parsley( 'addItem', '.dynamic-email' );
        expect( ParsleyForm.items.length ).to.be( 1 );
        expect( $( '#dynamic-form' ).parsley( 'validate' ) ).to.be( false );
        $( '.dynamic-email' ).val( 'foo@bar.baz' );
        expect( $( '#dynamic-form' ).parsley( 'validate' ) ).to.be( true );
        $( '.dynamic-email' ).val( 'foo' );
        $( '#dynamic-form' ).parsley( 'removeItem', '.dynamic-email' );
        expect( ParsleyForm.items.length ).to.be( 0 );
        expect( $( '.dynamic-email' ).hasClass( 'parsley-validated' ) ).to.be( false );
        expect( $( '#dynamic-form' ).parsley( 'validate' ) ).to.be( true );
      } )
      it ( 'test adding constraint on the fly', function () {
        $( '#onthefly' ).parsley( 'addConstraint', { type: "email" } ).val( 'foo' );
        expect( $( '#onthefly' ).hasClass( 'parsley-validated' ) ).to.be( true );
        $( '#onthefly-form' ).parsley( 'validate' );
        expect( $( '#onthefly' ).hasClass( 'parsley-error' ) ).to.be( true );
        $( '#onthefly' ).val( 'foo@bar.baz' );
        $( '#onthefly-form' ).parsley( 'validate' );
        expect( $( '#onthefly' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'test updating constraint on the fly', function () {
        $( '#onthefly' ).parsley( 'updateConstraint', { type: "url" } ).val( 'foo' );
        $( '#onthefly-form' ).parsley( 'validate' );
        expect( $( '#onthefly' ).hasClass( 'parsley-error' ) ).to.be( true );
        $( '#onthefly' ).val( 'http://foo.bar' ).parsley( 'validate' );
        expect( $( '#onthefly' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'test removing constraint on the fly', function () {
        $( '#onthefly' ).parsley( 'removeConstraint', 'type' ).val( 'foo' );
        $( '#onthefly-form' ).parsley( 'validate' );
        expect( $( '#onthefly' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#onthefly' ).hasClass( 'parsley-validated' ) ).to.be( false );
      } )
      it ( 'test setting custom error container within data-attributes', function () {
        expect( $( '#dataerrorcontainer-form' ).parsley( 'validate' ) ).to.be( false );
        expect( $( '#mycustomerrorcontainer ul.parsley-error-list' ).length ).to.be( 1 );
      } )
      it ( 'test isValid', function () {
        expect( $( '#isValid-form' ).parsley( 'isValid' ) ).to.be( false );
        expect( $( '#isValid-field' ).hasClass( 'parsley-success' ) ).to.be( false );
        expect( $( '#isValid-field' ).hasClass( 'parsley-error' ) ).to.be( false );
        $( '#isValid-field' ).val( 'foo' );
        expect( $( '#isValid-form' ).parsley( 'isValid' ) ).to.be( true );
        expect( $( '#isValid-field' ).hasClass( 'parsley-success' ) ).to.be( false );
        expect( $( '#isValid-field' ).hasClass( 'parsley-error' ) ).to.be( false );
        $( '#isValid-field' ).val( '' );
        expect( $( '#isValid-form' ).parsley( 'validate' ) ).to.be( false );
        expect( $( '#isValid-field' ).hasClass( 'parsley-error' ) ).to.be( true );
      } )
    } )

    /***************************************
              test custom functions
    ***************************************/
    describe ( 'Test custom listeners', function () {
      describe ( 'Test overriding listeners in config', function () {
        it ( 'test onFieldValidate()', function () {
          $( '#onFieldValidate1' ).val( 'baz' );
          $( '#onFieldValidate-form' ).parsley( 'validate' );
          expect( $( '#onFieldValidate1' ).hasClass( 'parsley-error' ) ).to.be( true );

          $( '#onFieldValidate1' ).val( 'foo' );
          $( '#onFieldValidate-form' ).parsley( 'validate' );
          expect( $( '#onFieldValidate1' ).hasClass( 'parsley-success' ) ).to.be( false );
          expect( $( '#onFieldValidate1' ).hasClass( 'parsley-error' ) ).to.be( false );
        } )
        it ( 'test onFormSubmit()' , function () {
          expect( $( '#onFieldValidate-form' ).hasClass( 'this-form-is-invalid' ) ).to.be( true );
        } )
        it ( 'test onFieldError()', function () {
          expect( $( '#onFieldValidate2' ).hasClass( 'error-type_email' ) ).to.be( true );
        } )
        it ( 'test onFieldSuccess()', function () {
          // if onFieldSuccess returns false, consider field as invalid
          $( '#onFieldValidate2' ).val( 'foo@foo.foo' );
          expect( $( '#onFieldValidate-form' ).parsley( 'validate' ) ).to.be( false );
          expect( $( '#onFieldValidate2' ).hasClass( 'success-foo-bar' ) ).to.be( false );

          $( '#onFieldValidate2' ).val( 'foo@baz.baz' );
          $( '#onFieldValidate-form' ).parsley( 'validate' );
          expect( $( '#onFieldValidate2' ).hasClass( 'success-foo-bar' ) ).to.be( true );
        } )
        it ( 'test addListener onFormSubmit', function () {
          $( '#listeners1' ).val( 'foo' );
          expect( $( '#listeners-form' ).hasClass( 'onFormSubmit-ok' ) ).to.be( false );
          $( '#listeners-form' ).parsley( 'validate' );
          expect( $( '#listeners-form' ).hasClass( 'onFormSubmit-ok' ) ).to.be( true );
        } )
      } )
      describe ( 'Test adding listeners with addListener interface', function () {
        it ( 'addListener', function () {
          $( '#addListenerFieldValidate' ).parsley( 'addListener', {
            onFieldValidate: function ( elem ) {
              $( elem ).addClass( 'listener-ok' );
              return false;
            }
          } );
          $( '#addListenerFieldValidate-field' ).val();
          $( '#addListenerFieldValidate' ).parsley( 'validate', function () {
            expect( $( '#addListenerFieldValidate-field' ).hasClass( 'listener-ok' ) ).to.be( true );
          } )
        } )
      } )
      describe ( 'Test some typical use cases with listeners', function () {
        it( 'Test onFieldValidate could reset Parsley validation with return true;', function () {
           $( '#onFieldValidatetrue' ).val( 'foo@bar.com' );
           expect( $( '#onFieldValidatetrue-form' ).parsley( 'validate' ) ).to.be( false );

           // do not validate #onFieldValidatefalse
           $( '#onFieldValidatetrue-form' ).parsley( 'addListener', {
             onFieldValidate: function ( elem ) {
               if ( $( elem ).attr( 'id' ) === "onFieldValidatefalse" ) {
                 return true;
               }

               return false;
             }
           } )

           // even with #onFieldValidatefalse invalid, validation is ok
           expect( $( '#onFieldValidatetrue-form' ).parsley( 'validate' ) ).to.be( true );
        } )
        it( 'Do not submit a form even if Parsley valid, with custom onFormValidate callback', function () {
          var global;

          $( '#onFormValidateCustom' ).parsley( {
            listeners: {
              onFormSubmit: function () {
                return global;
              }
            }
          } );

          $( '#onFormValidateCustom-field' ).val( 'correct@email.ext' );
          expect( $( '#onFormValidateCustom' ).parsley( 'validate' ) ).to.be( true );

          global = false;
          expect( $( '#onFormValidateCustom' ).parsley( 'validate' ) ).to.be( false );
        } )
      } )
    } )

   /***************************************
    test radio & checkboxes inputs behavior
    ***************************************/
    describe ( 'Test radio & checkboxes inputs', function () {
      it ( 'Test that radio or checkbox isRequired constraint apply once one radio / checkbox button or more is required', function () {
        expect( $( '#radiocheckboxes' ).parsley( 'validate' ) ).to.be( false );
      } )
      it ( 'Test that error message goes only once and after last radio / checkbox of the group', function () {
        expect( $( '#check2' ).parsley( 'getHash' ) ).to.be( $( '#check1' ).parsley( 'getHash' ) );
        expect( $( '#check2' ).parent().next( 'ul' ).attr( 'id' ) ).to.be( $( '#check1' ).parsley( 'getHash' ) );
      } )
      it ( 'Test that if a checkbox or radio is selected, isRequired validation pass', function () {
        $( '#radio1' ).attr( 'checked', 'checked' );
        $( '#check1' ).attr( 'checked', 'checked' );
        expect( $( '#radiocheckboxes' ).parsley( 'validate' ) ).to.be( true );
      } )
    } )

    /***************************************
            test parsley.extend.js
     ***************************************/
     describe ( 'Test Parsley extend', function () {
       it ( 'minwords validation', function () {
          triggerSubmitValidation( '#minwords', 'foo bar' );
          expect( $( '#minwords' ).hasClass( 'parsley-error' ) ).to.be( true );
          expect( getErrorMessage( '#minwords', 'minwords') ).to.be( 'This value should have 6 words at least.' );
          triggerSubmitValidation( '#minwords', 'foo bar baz foo bar baz' );
          expect( $( '#minwords' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
       it ( 'maxwords validation', function () {
          triggerSubmitValidation( '#maxwords', 'foo bar baz foo bar baz foo bar baz foo' );
          expect( $( '#maxwords' ).hasClass( 'parsley-error' ) ).to.be( true );
          expect( getErrorMessage( '#maxwords', 'maxwords') ).to.be( 'This value should have 6 words maximum.' );
          triggerSubmitValidation( '#maxwords', 'foo bar baz foo bar baz' );
          expect( $( '#maxwords' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
       it ( 'rangewords validation', function () {
          triggerSubmitValidation( '#rangewords', 'foo bar baz foo bar baz foo bar baz foo foo bar' );
          expect( $( '#rangewords' ).hasClass( 'parsley-error' ) ).to.be( true );
          expect( getErrorMessage( '#rangewords', 'rangewords') ).to.be( 'This value should have between 6 and 10 words.' );
          triggerSubmitValidation( '#rangewords', 'foo bar baz foo bar baz foo' );
          expect( $( '#rangewords' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
       it ( 'inlist validation', function () {
          triggerSubmitValidation( '#inList', 'invalid' );
          expect( $( '#inList' ).hasClass( 'parsley-error' ) ).to.be( true );
          triggerSubmitValidation( '#inList', 'false' );
          expect( $( '#inList' ).hasClass( 'parsley-error' ) ).to.be( true );
          triggerSubmitValidation( '#inList', 'true' );
          expect( $( '#inList' ).hasClass( 'parsley-success' ) ).to.be( true );
          triggerSubmitValidation( '#inList', 'one' );
          expect( $( '#inList' ).hasClass( 'parsley-success' ) ).to.be( true );
          triggerSubmitValidation( '#inList', 'value with spaces' );
          expect( $( '#inList' ).hasClass( 'parsley-success' ) ).to.be( true );

          triggerSubmitValidation( '#inListSingleValue', 'true' );
          expect( $( '#inListSingleValue' ).hasClass( 'parsley-success' ) ).to.be( true );

          triggerSubmitValidation( '#inListEmpty', 'foo' );
          expect( $( '#inListEmpty' ).hasClass( 'parsley-error' ) ).to.be( true );

          triggerSubmitValidation( '#inListSingleComma', 'value' );
          expect( $( '#inListSingleComma' ).hasClass( 'parsley-error' ) ).to.be( true );

          triggerSubmitValidation( '#inListCustomDelimiter', 'foo bar' );
          expect( $( '#inListCustomDelimiter' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
       it ( 'greaterThan', function () {
         triggerSubmitValidation( '#greaterThan', '1' );
         expect( $( '#greaterThan' ).hasClass( 'parsley-error' ) ).to.be( true );
         expect( getErrorMessage( '#greaterThan', 'greaterThan') ).to.be( 'This value should be greater than #greaterThan-model.' );
         triggerSubmitValidation( '#greaterThan', '2' );
         expect( $( '#greaterThan' ).hasClass( 'parsley-success' ) ).to.be( true );
         $( '#greaterThan-model' ).val( '5' );
         expect( $( '#greaterThan' ).parsley( 'validate' ) ).to.be( false );
       } )
       it ( 'lessThan', function () {
         triggerSubmitValidation( '#lessThan', '5' );
         expect( $( '#lessThan' ).hasClass( 'parsley-error' ) ).to.be( true );
         expect( getErrorMessage( '#lessThan', 'lessThan') ).to.be( 'This value should be less than #lessThan-model.' );
         triggerSubmitValidation( '#lessThan', '1' );
         expect( $( '#lessThan' ).hasClass( 'parsley-success' ) ).to.be( true );
         $( '#lessThan-model' ).val( '1' );
         expect( $( '#lessThan' ).parsley( 'validate' ) ).to.be( false );
       } )
       it ( 'beforeDate', function () {
         triggerSubmitValidation( '#beforeDate', '04/15/2015' );
         expect( $( '#beforeDate' ).hasClass( 'parsley-error' ) ).to.be( true );
         expect( getErrorMessage( '#beforeDate', 'beforeDate') ).to.be( 'This date should be before #beforeDate-model.' );
         triggerSubmitValidation( '#beforeDate', '4/15/1990' );
         expect( $( '#beforeDate' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
       it ( 'afterDate', function () {
         triggerSubmitValidation( '#afterDate', '4/15/1990' );
         expect( $( '#afterDate' ).hasClass( 'parsley-error' ) ).to.be( true );
         expect( getErrorMessage( '#afterDate', 'afterDate') ).to.be( 'This date should be after #afterDate-model.' );
         triggerSubmitValidation( '#afterDate', '04/15/2015' );
         expect( $( '#afterDate' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
       it ( 'luhn', function () {
         triggerSubmitValidation( '#luhn', '4000000000000000' );
         expect( $( '#luhn' ).hasClass( 'parsley-error' ) ).to.be( true );
         expect( getErrorMessage( '#luhn', 'luhn') ).to.be( 'This value should pass the luhn test.' );
         triggerSubmitValidation( '#luhn', '4000000000000002' );
         expect( $( '#luhn' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
       it ( 'americanDate', function () {
    	 triggerSubmitValidation( '#americanDate', '28/02/2012' );
    	 expect( $( '#americanDate' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#americanDate', 'americanDate') ).to.be( 'This value should be a valid date (MM/DD/YYYY).' );
    	 triggerSubmitValidation( '#americanDate', '02/08/2012' );
    	 expect( $( '#americanDate' ).hasClass( 'parsley-success' ) ).to.be( true );
    	 triggerSubmitValidation( '#americanDate', '10/08/2012' );
    	 expect( $( '#americanDate' ).hasClass( 'parsley-success' ) ).to.be( true );
    	 triggerSubmitValidation( '#americanDate', '2/8/12' );
    	 expect( $( '#americanDate' ).hasClass( 'parsley-success' ) ).to.be( true );
    	 triggerSubmitValidation( '#americanDate', '02-08-2012' );
    	 expect( $( '#americanDate' ).hasClass( 'parsley-success' ) ).to.be( true );
    	 triggerSubmitValidation( '#americanDate', '2-8-12' );
    	 expect( $( '#americanDate' ).hasClass( 'parsley-success' ) ).to.be( true );
    	 triggerSubmitValidation( '#americanDate', '02.08.2012' );
    	 expect( $( '#americanDate' ).hasClass( 'parsley-success' ) ).to.be( true );
    	 triggerSubmitValidation( '#americanDate', '2.8.12' );
    	 expect( $( '#americanDate' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
     } )
     describe ( 'Test Parsley l10n es', function () {
       it ( 'es_dni', function () {
    	 triggerSubmitValidation( '#es_dni', '12345678Z' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_dni', '00000000T' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_dni', '0T' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_dni', '00000000-T' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_dni', '12345678Z' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_dni', '87654321J' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_dni', 'es_dni') ).to.be( 'This value should be a valid DNI (Example: 00000000T).' );

    	 triggerSubmitValidation( '#es_dni', '123456781' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_dni', 'es_dni') ).to.be( 'This value should be a valid DNI (Example: 00000000T).' );

    	 triggerSubmitValidation( '#es_dni', 'X12345678' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_dni', 'es_dni') ).to.be( 'This value should be a valid DNI (Example: 00000000T).' );

    	 triggerSubmitValidation( '#es_dni', '123K' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_dni', 'es_dni') ).to.be( 'This value should be a valid DNI (Example: 00000000T).' );

    	 triggerSubmitValidation( '#es_dni', '43215678X' );
    	 expect( $( '#es_dni' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_dni', 'es_dni') ).to.be( 'This value should be a valid DNI (Example: 00000000T).' );
       } )
       it ( 'es_postalcode', function () {
    	 triggerSubmitValidation( '#es_postalcode', '28080' );
    	 expect( $( '#es_postalcode' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_postalcode', '35500' );
    	 expect( $( '#es_postalcode' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_postalcode', '12012' );
    	 expect( $( '#es_postalcode' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_postalcode', '25120' );
    	 expect( $( '#es_postalcode' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_postalcode', '59000' );
    	 expect( $( '#es_postalcode' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_postalcode', 'es_postalcode') ).to.be( 'This value should be a valid spanish postal code (Example: 28080).' );

    	 triggerSubmitValidation( '#es_postalcode', '10' );
    	 expect( $( '#es_postalcode' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_postalcode', 'es_postalcode') ).to.be( 'This value should be a valid spanish postal code (Example: 28080).' );

    	 triggerSubmitValidation( '#es_postalcode', 'X123' );
    	 expect( $( '#es_postalcode' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_postalcode', 'es_postalcode') ).to.be( 'This value should be a valid spanish postal code (Example: 28080).' );
       } )
       it ( 'es_ssn', function () {
    	 triggerSubmitValidation( '#es_ssn', '281234567840' );
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_ssn', '351234567825' );
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_ssn', '35/12345678/25' );
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_ssn', '720111361735');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '35X1234567825');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '031322136383');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '72011a361732');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '73011a361731');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '03092a136383');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '03132a136385');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '201113617312');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '301113617334');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '309221363823');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );

         triggerSubmitValidation( '#es_ssn', '313221363822');
    	 expect( $( '#es_ssn' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ssn', 'es_ssn') ).to.be( 'This value should be a valid spanish social security number.' );
       } )
       it ( 'es_ccc', function () {
    	 triggerSubmitValidation( '#es_ccc', '2077 0024 00 3102575766' );
    	 expect( $( '#es_ccc' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_ccc', '0000 0000 00 0000000000' );
    	 expect( $( '#es_ccc' ).hasClass( 'parsley-success' ) ).to.be( true );

    	 triggerSubmitValidation( '#es_ccc', '0001 0001 65 0000000001' );
    	 expect( $( '#es_ccc' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_ccc', '0');
    	 expect( $( '#es_ccc' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ccc', 'es_ccc') ).to.be( 'This value should be a valid spanish bank client account code.' );

         triggerSubmitValidation( '#es_ccc', '2034 4505 73 1000034682');
    	 expect( $( '#es_ccc' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ccc', 'es_ccc') ).to.be( 'This value should be a valid spanish bank client account code.' );

         triggerSubmitValidation( '#es_ccc', '1111 1111 11 1111111111');
    	 expect( $( '#es_ccc' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_ccc', 'es_ccc') ).to.be( 'This value should be a valid spanish bank client account code.' );
       } )
       it ( 'es_cif', function () {
         triggerSubmitValidation( '#es_cif', 'A58818501');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'B00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'C0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'D00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'E00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'F00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'G00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'H00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'J00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'K0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'L0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'M0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'N0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'P0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'Q0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'R0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'S0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'U00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'V00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'W0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'B-00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );

         triggerSubmitValidation( '#es_cif', 'K-0000000-J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-success' ) ).to.be( true );


         triggerSubmitValidation( '#es_cif', 'X00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'X0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'Y00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'Y0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'Z00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'Z0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'B0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'BC0000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', '123456678');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'I00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'I0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'O00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'O0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'T00000000');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );

         triggerSubmitValidation( '#es_cif', 'T0000000J');
    	 expect( $( '#es_cif' ).hasClass( 'parsley-error' ) ).to.be( true );
    	 expect( getErrorMessage( '#es_cif', 'es_cif') ).to.be( 'This value should be a valid CIF (Example: B00000000).' );
       } )
     } )

  } )
}

