import $ from 'jquery';

import Parsley from '../../../src/parsley';

import words from '../../../src/extra/validator/words';

    describe('extra/validator/words', function () {
     it('should have a minwords validator', function () {
        $('body').append('<input type="text" id="element" data-parsley-minwords="2" required />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo bar');
        expect($('#element').psly().isValid()).to.be(true);
      });
      it('should have a maxwords validator', function () {
        $('body').append('<input type="text" id="element" data-parsley-maxwords="2" required />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo bar');
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val('foo bar baz');
        expect($('#element').psly().isValid()).to.be(false);
      });
      it('should have a words validator', function () {
        $('body').append('<input type="text" id="element" data-parsley-words="[2, 4]" required />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo bar baz');
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val('foo bar baz qux bux');
        expect($('#element').psly().isValid()).to.be(false);
      });
      afterEach(function () {
        $('#element, .fixture, .parsley-errors-list').remove();
      });
    });
