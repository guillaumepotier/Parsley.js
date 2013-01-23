'use strict';

var xhr, requests;

window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
  messages: {
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
  return $( '#parsley-' + $( idOrClass ).parsley( 'getHash' ) + ' li.' + constraintName ).text();
}

$( '#validate-form' ).parsley( { listeners: {
  onFormSubmit: function ( isFormValid, event ) {
    $( '#validate-form' ).addClass( isFormValid ? 'form-valid' : 'form-invalid' );
    event.preventDefault();
  }
} } );

$( '#focus-form' ).parsley( { listeners: {
  onFormSubmit: function ( isFormValid, event, focusField ) {
    $( focusField ).addClass( 'on-focus' );
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
    $( field ).addClass( 'error-' + constraints[ 0 ].name + '_' + constraints[ 0 ].requirements );
  },
  onFieldSuccess: function ( field ) {
    $( field ).addClass( 'success-foo-bar' );
  },
  onFormSubmit: function ( isFormValid, event, focusField ) {
    $( '#onFieldValidate-form' ).addClass( 'this-form-is-invalid' );
  }
} } );

$( '#listeners-form' ).parsley( 'addListener', { listeners: {
  onFormSubmit: function ( isFormValid, event, focusField ) {
    $( '#listeners-form' ).addClass( 'onFormSubmit-ok' );
  }
} } );

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
      it ( 'Do not bind an input that type is hidden', function () {
        expect( $( '#hidden' ).hasClass( 'parsley-validated' ) ).to.be( false );
        expect( $( '#hidden' ).parsley( 'validate' ) ).to.be( null );
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
      var fieldHash = 'parsley-' + $( '#errormanagement' ).parsley( 'getHash' );

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
            expect( $.ajax.calledWithMatch( { method: "GET" } ) ).to.be( true );
            expect( $.ajax.calledWithMatch( { url: "http://foo.bar" } ) ).to.be( true );
            expect( $.ajax.calledWithMatch( { data: { remote1: "foobar" } } ) ).to.be( true );
            expect( $.ajax.calledWithMatch( { dataType: "jsonp" } ) ).to.be( true );
          } )
          it ( 'Test ajax call parameters overriding', function () {
            $( '#remote2' ).val( 'foo' );
            $( '#remote2' ).parsley( 'validate' );
            expect( $.ajax.calledWithMatch( { method: "POST" } ) ).to.be( true );
          } )

          after( function () {
            $.ajax.restore();
          });
        } )

        // not passing on phantomJS yet..
        if ( !window.mochaPhantomJS ) {
          describe ( 'Test ASYNC ajax calls results', function () {
            var calls = [
                { statusCode: 200, content: "true", expect: true }
              , { statusCode: 404, content: "", expect: false }
              , { statusCode: 200, content: "false", expect: false }
              , { statusCode: 200, content: "1", expect: true }
              , { statusCode: 200, content: "0", expect: false }
              , { statusCode: 200, content: "{success: \"foobar\"}", expect: true }
              ];

            before( function () {
              xhr = sinon.useFakeXMLHttpRequest();
              requests = [];

              xhr.onCreate = function ( xhr ) {
                requests.push( xhr );
              };
            } )

            it ( 'Test async ajax calls returns', function ( done ) {
              $( '#remote2' ).val( 'foobarbaz' );

              for ( var i = 0; i < calls.length; i++ ) {
                $( '#remote2' ).parsley( 'validate' );
                requests[ 0 ].respond([ calls[ i ].statusCode , {}, calls[ i ].content ]);
                expect( requests.length ).to.be( 1 );
                done();

                expect( $( '#remote2' ).parsley( 'isFieldValid' ) ).to.be( calls[ i ].expect)
                expect( $( '#remote2' ).hasClass( 'parsley-error' ) ).to.be( !calls[ i ].expect );
                expect( $( '#remote2' ).hasClass( 'parsley-success' ) ).to.be( calls[ i ].expect );
              }
            } )

            after( function () {
              xhr.restore();
            } );
          } )
        }

      } )
    } )

    /***************************************
    test in field options validation changes
    ***************************************/
    describe ( 'Test in field options validation changes', function () {
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
    } )

    /***************************************
         test field validation scenarios
    ***************************************/
    describe ( 'Test field validation scenarios', function () {
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
      it ( 'test that hidden excluded inputs does not affect form validation', function () {
        expect( $( '#hidden-input-form' ).parsley( 'validate' ) ).to.be( false );
        $( '#hidden-input1' ).val( 'foo@bar.baz' );
        expect( $( '#hidden-input-form' ).parsley( 'validate' ) ).to.be( true );
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
               console.log( $( elem ).attr( 'id' ) )
               if ( $( elem ).attr( 'id' ) === "onFieldValidatefalse" ) {
                 return true;
               }

               return false;
             }
           } )

           // even with #onFieldValidatefalse invalid, validation is ok
           expect( $( '#onFieldValidatetrue-form' ).parsley( 'validate' ) ).to.be( true );
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
        expect( $( '#check2' ).parent().next( 'ul' ).attr( 'id' ) ).to.be( 'parsley-' + $( '#check1' ).parsley( 'getHash' ) );
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
       it ( 'greaterThan', function () {
         triggerSubmitValidation( '#greaterThan', '1' );
         expect( $( '#greaterThan' ).hasClass( 'parsley-error' ) ).to.be( true );
         expect( getErrorMessage( '#greaterThan', 'greaterThan') ).to.be( 'This value should be greater than #greaterThan-model.' );
         triggerSubmitValidation( '#greaterThan', '2' );
         expect( $( '#greaterThan' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
       it ( 'lessThan', function () {
         triggerSubmitValidation( '#lessThan', '5' );
         expect( $( '#lessThan' ).hasClass( 'parsley-error' ) ).to.be( true );
         expect( getErrorMessage( '#lessThan', 'lessThan') ).to.be( 'This value should be less than #lessThan-model.' );
         triggerSubmitValidation( '#lessThan', '1' );
         expect( $( '#lessThan' ).hasClass( 'parsley-success' ) ).to.be( true );
       } )
     } )

  } )
}

