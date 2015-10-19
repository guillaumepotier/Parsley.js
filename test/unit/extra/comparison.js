import $ from 'jquery';

import Parsley from '../../../src/parsley';

import comparison from '../../../src/extra/validator/comparison';

describe('extra/validator/comparison', () => {
  it('should have gt validator', () => {
    var number = 5;

    // Check with a selector
    $('body').append('<input type="text" id="element" data-parsley-gt="#gt" required /><input type="text" id="gt" value="' + number + '" />');
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number + 1);
    expect($('#element').psly().isValid()).to.be(true);
    $('#element').val(number);
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number - 1);
    expect($('#element').psly().isValid()).to.be(false);

    // Check with a (different) number
    number = 42;
    $('#element').attr('data-parsley-gt', number);
    $('#element').val(number + 1);
    expect($('#element').psly().isValid()).to.be(true);
    $('#element').val(number);
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number - 1);
    expect($('#element').psly().isValid()).to.be(false);

    $('#gt').remove();
  });
  it('should have gte validator', () => {
    var number = 5;

    // Check with a selector
    $('body').append('<input type="text" id="element" data-parsley-gte="#gte" required /><input type="text" id="gte" value="' + number + '" />');
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number + 1);
    expect($('#element').psly().isValid()).to.be(true);
    $('#element').val(number);
    expect($('#element').psly().isValid()).to.be(true);
    $('#element').val(number - 1);
    expect($('#element').psly().isValid()).to.be(false);

    // Check with a (different) number
    number = 42;
    $('#element').attr('data-parsley-gte', number);
    $('#element').val(number + 1);
    expect($('#element').psly().isValid()).to.be(true);
    $('#element').val(number);
    expect($('#element').psly().isValid()).to.be(true);
    $('#element').val(number - 1);
    expect($('#element').psly().isValid()).to.be(false);

    $('#gte').remove();
  });
  it('should have lt validator', () => {
    var number = 5;

    // Check with a selector
    $('body').append('<input type="text" id="element" data-parsley-lt="#lt" required /><input type="text" id="lt" value="' + number + '" />');
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number + 1);
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number);
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number - 1);
    expect($('#element').psly().isValid()).to.be(true);

    // Check with a (different) number
    number = 42;
    $('#element').attr('data-parsley-lt', number);
    $('#element').val(number + 1);
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number);
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number - 1);
    expect($('#element').psly().isValid()).to.be(true);

    $('#lt').remove();
  });
  it('should have lte validator', () => {
    var number = 5;

    // Check with a selector
    $('body').append('<input type="text" id="element" data-parsley-lte="#lte" required /><input type="text" id="lte" value="' + number + '" />');
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number + 1);
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number);
    expect($('#element').psly().isValid()).to.be(true);
    $('#element').val(number - 1);
    expect($('#element').psly().isValid()).to.be(true);

    // Check with a (different) number
    number = 42;
    $('#element').attr('data-parsley-lte', number);
    $('#element').val(number + 1);
    expect($('#element').psly().isValid()).to.be(false);
    $('#element').val(number);
    expect($('#element').psly().isValid()).to.be(true);
    $('#element').val(number - 1);
    expect($('#element').psly().isValid()).to.be(true);

    $('#lte').remove();
  });
  afterEach(() => {
    $('#element, .fixture, .parsley-errors-list').remove();
  });
});
