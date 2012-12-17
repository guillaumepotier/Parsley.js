"use strict";

var triggerValidation = function ( idOrClass, value ) {
  $( idOrClass ).val( value );
  $( idOrClass ).parsley( 'onSubmitValidate' );
}

var testSuite = function () {
  describe ( 'Parsley.js test suite', function () {

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
        it ( 'min', function () {
          triggerValidation( '#min', '8' );
          expect( $( '#min' ).hasClass( 'parsley-error' ) ).to.be( true );
          triggerValidation( '#min', '12' );
          expect( $( '#min' ).hasClass( 'parsley-success' ) ).to.be( true );
        } )
      } )
      it ( 'max', function () {
        it ( 'max', function () {
          triggerValidation( '#max', '12' );
          expect( $( '#max' ).hasClass( 'parsley-error' ) ).to.be( true );
          triggerValidation( '#max', '10' );
          expect( $( '#max' ).hasClass( 'parsley-success' ) ).to.be( true );
        } )
      } )
      it ( 'range', function () {
        it ( 'range', function () {
          triggerValidation( '#range', '12' );
          expect( $( '#range' ).hasClass( 'parsley-error' ) ).to.be( true );
          triggerValidation( '#range', '2' );
          expect( $( '#range' ).hasClass( 'parsley-error' ) ).to.be( true );
          triggerValidation( '#range', '8' );
          expect( $( '#range' ).hasClass( 'parsley-success' ) ).to.be( true );
        } )
      } )
      it ( 'url' )
      it ( 'email' )
      it ( 'digits' )
      it ( 'dateIso' )
      it ( 'number' )
      it ( 'alphanum' )
    } )
  } )
}
