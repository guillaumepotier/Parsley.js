"use strict";

var testSuite = function () {
  describe ( 'Parsley.js test suite', function () {
    describe ( 'Test Parsley auto binding', function () {
      it ( 'Items inside a form validated by Parsley are binded', function () {
        expect( $( '#input1' ).hasClass( 'parsley-validated' ) ).to.be( true );
        expect( $( '#textarea1' ).hasClass( 'parsley-validated' ) ).to.be( true );
      } )
      it ( 'Items can be validated as stand-alone too', function () {
        expect( $( '#input2' ).hasClass( 'parsley-validated' ) ).to.be( true );
        expect( $( '#textarea2' ).hasClass( 'parsley-validated' ) ).to.be( false );
      } )
    } )
  } )
}
