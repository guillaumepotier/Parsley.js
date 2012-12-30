'use strict';

var triggerSubmitValidation = function ( idOrClass, value ) {
  $( idOrClass ).val( value );
  $( idOrClass ).parsley( 'validate' );
}

var triggerEventChangeValidation = function ( idOrClass, value ) {
  $( idOrClass ).val( value );
  $( idOrClass ).parsley( 'triggerValidation' );
}

var getErrorMessage = function ( idOrClass, method ) {
  return $( 'ul#' + $( idOrClass ).parsley( 'getHash' ) + ' li.' + method ).text();
}

var testSuite = function () {
  describe ( 'Parsley.js test suite', function () {
    $( '#validate-form' ).parsley( {
      onSubmit: function ( isFormValid, event ) {
        $( '#validate-form' ).addClass( isFormValid ? 'form-valid' : 'form-invalid' );
        event.preventDefault();
      }
    } );

    $( '#validator-tests' ).parsley( {
      customValidators: {
        multiple: function ( val, multiple ) {
          return val % multiple === 0;
        }
      }
      , messages: {
        multiple: 'This field should be a multiple of %s'
      }
    } );

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
      var fieldHash = $( '#errormanagement' ).parsley( 'getHash' );

      it ( 'Test two errors on the same field', function () {
        triggerSubmitValidation( '#errormanagement', 'foo@' );
        expect( $( 'ul#' + fieldHash + ' li' ).length ).to.be( 2 );
        expect( $( '#errormanagement' ).hasClass( 'parsley-error' ) ).to.be( true );
      } )
      it ( 'If one error is fixed, show the remaining one', function () {
        triggerSubmitValidation( '#errormanagement', 'foo' );
        expect( $( 'ul#' + fieldHash + ' li' ).length ).to.be( 1 );
        expect( $( '#errormanagement' ).hasClass( 'parsley-error' ) ).to.be( true );
      } )
      it ( 'If there are no more errors, full validation ok', function () {
        triggerSubmitValidation( '#errormanagement', 'foobar' );
        expect( $( 'ul#' + fieldHash ).length ).to.be( 0 );
        expect( $( '#errormanagement' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
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
        expect( getErrorMessage( '#min', 'min') ).to.be( 'This value should be greater than 10.' );
        triggerSubmitValidation( '#min', '12' );
        expect( $( '#min' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'max', function () {
        triggerSubmitValidation( '#max', '12' );
        expect( $( '#max' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#max', 'max') ).to.be( 'This value should be lower than 10.' );
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
      it ( 'url', function () {
        triggerSubmitValidation( '#typeurl', 'foo' );
        expect( $( '#typeurl' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#typeurl', 'type') ).to.be( 'This value should be a valid url.' );
        triggerSubmitValidation( '#typeurl', 'http://google.com' );
        expect( $( '#typeurl' ).hasClass( 'parsley-success' ) ).to.be( true );
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
        triggerSubmitValidation( '#typeemail', 'foo.bar@bar.com.ext' );
        expect( $( '#typeemail' ).hasClass( 'parsley-success' ) ).to.be( true );
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
      it ( 'customvalidator', function () {
        triggerSubmitValidation( '#customvalidator', 'foo' );
        expect( $( '#customvalidator' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( getErrorMessage( '#customvalidator', 'multiple') ).to.be( 'This field should be a multiple of 9' );
        triggerSubmitValidation( '#customvalidator', '10' );
        expect( $( '#customvalidator' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerSubmitValidation( '#customvalidator', '18' );
        expect( $( '#customvalidator' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
    } )

    /***************************************
    test in field options validation changes
    ***************************************/
    describe ( 'Test in field options validation changes', function () {
      it ( 'Change min char validation tresshold', function () {
        // default min char validation is set to 4. here we expect an email value
        // it should normally throw an error, but not here, since custom tresshlod is set to 7
        triggerEventChangeValidation( '#minchar-change', 'foobar' );
        expect( $( '#minchar-change' ).hasClass( 'parsley-success' ) ).to.be( false );
        expect( $( '#minchar-change' ).hasClass( 'parsley-error' ) ).to.be( false );

        // here we passed the 7 char length, throw error
        triggerEventChangeValidation( '#minchar-change', 'foobarbaz' );
        expect( $( '#minchar-change' ).hasClass( 'parsley-error' ) ).to.be( true );
      } )
    } )

    /***************************************
         test field validation scenarios
    ***************************************/
    describe ( 'Test field validation scenarios', function () {
      it ( 'Test scenario for non-required field', function () {
        // do not pass the 3 chars min trigger
        $( '#scenario-not-required' ).val( 'fo' );
        $( '#scenario-not-required' ).parsley( 'triggerValidation' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-success' ) ).to.be( false );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-error' ) ).to.be( false );

        // val.length >= 4, validation is done
        $( '#scenario-not-required' ).val( 'foob' );
        $( '#scenario-not-required' ).parsley( 'triggerValidation' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-error' ) ).to.be( true );

        // pass validation
        $( '#scenario-not-required' ).val( 'foobar' );
        $( '#scenario-not-required' ).parsley( 'triggerValidation' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-success' ) ).to.be( true );

        // re-fail validation
        $( '#scenario-not-required' ).val( 'fooba' );
        $( '#scenario-not-required' ).parsley( 'triggerValidation' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-error' ) ).to.be( true );

        // then, delete field value. Field is not required. Remove errors, remove parsley classes
        $( '#scenario-not-required' ).val( '' );
        $( '#scenario-not-required' ).parsley( 'triggerValidation' );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-errors' ) ).to.be( false );
        expect( $( '#scenario-not-required' ).hasClass( 'parsley-success' ) ).to.be( false );
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
    } )
  } )
}
