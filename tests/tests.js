"use strict";

var triggerValidation = function ( idOrClass, value ) {
  $( idOrClass ).val( value );
  $( idOrClass ).parsley( 'onSubmitValidate' );
}

var testSuite = function () {
  describe ( 'Parsley.js test suite', function () {
    $( "#validate-form" ).parsley( {
      onSubmit: function ( isFormValid, event ) {
        $( "#validate-form" ).addClass( isFormValid ? 'form-valid' : 'form-invalid' );
        event.preventDefault();
      }
    } );

    $( "#validator-tests" ).parsley( {
      customValidators: {
        multiple: function ( val, multiple ) {
          return val % multiple === 0;
        }
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
        triggerValidation( '#input2', 'foo@bar' );
        expect( $( '#input2' ).hasClass( 'parsley-error' ) ).to.be( true );
        expect( $( '#input2' ).hasClass( 'parsley-success' ) ).to.be( false );
      } )
      it ( 'If field verify all validation tests, add success class', function () {
        triggerValidation( '#input2', 'foo@bar.baz' );
        expect( $( '#input2' ).hasClass( 'parsley-error' ) ).to.be( false );
        expect( $( '#input2' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
    } )

    /***************************************
                trigger events
    ***************************************/
    describe ( 'Test inputs events', function () {
      var events = [ 'change', 'keyup', 'paste' ];
        it ( 'Validators are triggered on these events: ' + events.join( ', ' ) , function () {
          for ( var event in events ) {
            var value = ( ( event + 1 ) % 2 ) * 1000;
            $( '#input1' ).val( value );
            $( '#input1' ).trigger( $.Event( events[event] ) );  
            expect( $( '#input1' ).hasClass( 'parsley-error' ) ).to.be( value === 0 );
          }
        } )
    } )

    /***************************************
                test validators
    ***************************************/
    describe ( 'Test validators', function () {
      it ( 'notnull', function () {
        triggerValidation( '#notnull', '' );
        expect( $( '#notnull' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#notnull', 'foo' );
        expect( $( '#notnull' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'notblank', function () {
        triggerValidation( '#notblank', '   ' );
        expect( $( '#notblank' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#notnull', 'foo' );
        expect( $( '#notnull' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'required', function () {
        triggerValidation( '#required', '' );
        expect( $( '#required' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#required', '  ' );
        expect( $( '#required' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#required', '  foo' );
        expect( $( '#required' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'minlength', function () {
        triggerValidation( '#minlength', '12345' );
        expect( $( '#minlength' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#minlength', '123456' );
        expect( $( '#minlength' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'maxlength', function () {
        triggerValidation( '#maxlength', '12345678' );
        expect( $( '#maxlength' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#maxlength', '12345' );
        expect( $( '#maxlength' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'rangelength', function () {
        triggerValidation( '#rangelength', '12345678910' );
        expect( $( '#rangelength' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#rangelength', '1234567' );
        expect( $( '#rangelength' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'min', function () {
        triggerValidation( '#min', '8' );
        expect( $( '#min' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#min', '12' );
        expect( $( '#min' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'max', function () {
        triggerValidation( '#max', '12' );
        expect( $( '#max' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#max', '10' );
        expect( $( '#max' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'range', function () {
        triggerValidation( '#range', '12' );
        expect( $( '#range' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#range', '2' );
        expect( $( '#range' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#range', '8' );
        expect( $( '#range' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'regexp', function () {
        triggerValidation( '#regexp', 'foo' );
        expect( $( '#regexp' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#regexp', '42' );
        expect( $( '#regexp' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'url', function () {
        triggerValidation( '#typeurl', 'foo' );
        expect( $( '#typeurl' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#typeurl', 'http://google.com' );
        expect( $( '#typeurl' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'email', function () {
        triggerValidation( '#typeemail', 'foo' );
        expect( $( '#typeemail' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#typeemail', 'foo@bar' );
        expect( $( '#typeemail' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#typeemail', 'foo@bar.com' );
        expect( $( '#typeemail' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerValidation( '#typeemail', 'foo+baz@bar.com' );
        expect( $( '#typeemail' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerValidation( '#typeemail', 'foo.bar@bar.com.ext' );
        expect( $( '#typeemail' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'digits', function () {
        triggerValidation( '#typedigits', 'foo' );
        expect( $( '#typedigits' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#typedigits', '42.2' );
        expect( $( '#typedigits' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#typedigits', '42' );
        expect( $( '#typedigits' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'dateIso', function () {
        triggerValidation( '#typedateIso', 'foo' );
        expect( $( '#typedateIso' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#typedateIso', '2012-12-12' );
        expect( $( '#typedateIso' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'number', function () {
        triggerValidation( '#typenumber', 'foo' );
        expect( $( '#typenumber' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#typenumber', '007' );
        expect( $( '#typenumber' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerValidation( '#typenumber', '42.5' );
        expect( $( '#typenumber' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'aphanum', function () {
        triggerValidation( '#typealphanum', '@&' );
        expect( $( '#typealphanum' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#typealphanum', 'parsley.js' );
        expect( $( '#typealphanum' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#typealphanum', 'parsley12' );
        expect( $( '#typealphanum' ).hasClass( 'parsley-success' ) ).to.be( true );
        triggerValidation( '#typealphanum', 'foo' );
        expect( $( '#typealphanum' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
      it ( 'customvalidator', function () {
        triggerValidation( '#customvalidator', 'foo' );
        expect( $( '#customvalidator' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#customvalidator', '10' );
        expect( $( '#customvalidator' ).hasClass( 'parsley-error' ) ).to.be( true );
        triggerValidation( '#customvalidator', '18' );
        expect( $( '#customvalidator' ).hasClass( 'parsley-success' ) ).to.be( true );
      } )
    } )

    /***************************************
              test form validation
    ***************************************/
    describe ( 'Test form validation', function () {
      it ( 'if a filed is not valid, form is not submitted', function () {
        $( "#validate2" ).val( "1234567" );
        $( "#validate-form-submit" ).click();
        expect( $( "#validate-form" ).hasClass( 'form-invalid' ) ).to.be( true );
      } )
      it ( 'if all fields are valid, form is submitted', function () {
        $( "#validate1" ).val( "foo" );
        $( "#validate-form-submit" ).click();
        expect( $( "#validate-form" ).hasClass( 'form-valid' ) ).to.be( true );
      } )
    } )
  } )
}
