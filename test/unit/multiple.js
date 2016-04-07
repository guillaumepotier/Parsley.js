import $ from 'jquery';
import Parsley from '../../src/parsley';

describe('ParsleyMultiple', () => {
  it('should not throw errors with multiple items with weird automated generated names', () => {
    $('body').append(
      '<form id="element">' +
        '<input type="checkbox" name="hello[]" id="check1" value="1" />'  +
        '<input type="checkbox" name="{{ hello }}" id="check2" value="2" />'  +
        '<input type="checkbox" name="$hello$" id="check3" value="3" />'  +
        '<input type="checkbox" name="hello world[ x ]" id="check4" value="4" />'  +
        '<input type="checkbox" value="foo" />' +
      '</form>');
    expectWarning(() => {
      $('#element').parsley();
    });
  });
  it('should return same ParsleyMultiple instance for each field in same multiple group, and it should count as one field in form', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="checkbox" name="check" id="check1" value="1" />'  +
        '<input type="checkbox" name="check" id="check2" value="2" />'  +
        '<input type="checkbox" name="check" id="check3" value="3" />'  +
      '</form>');
    var parsleyMultipleInstance = $('#check1').parsley();
    expect($('#check2').parsley().__id__).to.be(parsleyMultipleInstance.__id__);
    expect($('#check3').parsley().__id__).to.be(parsleyMultipleInstance.__id__);
    expect(parsleyMultipleInstance.$elements.length).to.be(3);
    expect($('#element').parsley().fields.length).to.be(1);
  });
  it('should auto add a data-parsley-multiple attribute to each correctly binded multiple input', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="checkbox" name="check" id="check1" value="1" />'  +
        '<input type="checkbox" name="check" id="check2" value="2" />'  +
        '<input type="checkbox" name="check" id="check3" value="3" />'  +
        '<input type="checkbox" value="foo" />' +
      '</form>');
    expectWarning(() => {
      $('#element').parsley();
    });
    expect($('#check1').attr('data-parsley-multiple')).to.be('check');
    expect($('#check2').attr('data-parsley-multiple')).to.be('check');
    expect($('#check3').attr('data-parsley-multiple')).to.be('check');
    expect($('#check4').eq(3).attr('data-parsley-multiple')).to.be(undefined);
  });
  it('should have a specific `getValue` method (checkbox)', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="checkbox" name="check[]" id="check1" value="1" />'  +
        '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
      '</form>');
    expect($('#check1').parsley().getValue()).to.be.eql([]);
    expect($('#check2').attr('checked', 'checked').parsley().getValue()).to.be.eql(['2']);
  });
  it('should have a specific `getValue` method (radio)', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="radio" name="radio" id="radio1" value="3" />'  +
        '<input type="radio" name="radio" id="radio2" value="4" />'  +
      '</form>');
    expect($('#radio1').parsley().getValue()).to.be.eql('');
    expect($('#radio2').attr('checked', 'checked').parsley().getValue()).to.be.eql('4');
  });
  it('should handle required constraint (checkbox)', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="checkbox" name="check[]" id="check1" value="1" />'  +
        '<input type="checkbox" name="check[]" id="check2" value="2" required />'  +
      '</form>');
    expect($('#element').parsley().isValid()).to.be(false);
    $('#check2').attr('checked', 'checked');
    expect($('#element').parsley().isValid()).to.be(true);
  });
  it('should handle required constraint (radio)', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="radio" name="radio" id="radio1" value="3" required />'  +
        '<input type="radio" name="radio" id="radio2" value="4" />'  +
      '</form>');
    expect($('#element').parsley().isValid()).to.be(false);
    $('#radio1').attr('checked', 'checked');
    expect($('#element').parsley().isValid()).to.be(true);
  });
  it('should handle check constraint', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="checkbox" name="check[]" id="check1" value="1" data-parsley-check="[1, 2]" />'  +
        '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
        '<input type="checkbox" name="check[]" id="check3" value="3" />'  +
        '<input type="checkbox" name="check[]" id="check4" value="4" />'  +
      '</form>');

    // if not required, field is optional and do not fail
    expect($('#check1').parsley().isValid()).to.be.eql(true);
    expect($('#element').parsley().isValid()).to.be(true);

    // once required, it fails if not rightly checked
    $('#check1').attr('required', 'true');
    expect($('#element').parsley().isValid()).to.be(false);
    $('#check2').attr('checked', 'checked');
    expect($('#element').parsley().isValid()).to.be(true);
    $('#check1').attr('checked', 'checked');
    $('#check3').attr('checked', 'checked');
    expect($('#element').parsley().isValid()).to.be(false);
  });
  it('should support select multiple', () => {
    $('body').append(
      '<select multiple name="foo" id="element" required data-parsley-mincheck="2">' +
        '<option value="1">1</option>'  +
        '<option value="2">2</option>'  +
        '<option value="3">3</option>'  +
      '</select>');
    var parsleyField = $('#element').parsley();
    expect(parsleyField.__class__).to.be('ParsleyFieldMultiple');
    expect(parsleyField.options.multiple).to.be('foo');
    expect(parsleyField.getValue()).to.be.eql([]);
    expect(parsleyField.isValid()).to.be(false);
    $('#element option[value="1"]').attr('selected', 'selected');
    expect(parsleyField.getValue()).to.be.eql(['1']);
    expect(parsleyField.isValid()).to.be(false);
    $('#element option[value="2"]').attr('selected', 'selected');
    expect(parsleyField.getValue()).to.be.eql(['1', '2']);
    expect(parsleyField.isValid()).to.be(true);
  });
  it('should support select with default without a value', () => {
    $('body').append(
      '<select id="element" required>'    +
        '<option selected="selected" value>default</option>'  +
        '<option value="2">2</option>'    +
      '</select>');
    expect($('#element').parsley().isValid()).to.be(false);
  });
  it('should not bind radio or checkboxes without a name or and id or a multiple option', () => {
    $('body').append('<input type="radio" value="foo" />');
    var parsleyInstance =
      expectWarning(() => {
        return $('input[type=radio]').psly();
      });
    expect(parsleyInstance.__class__).to.be('Parsley');
    $('input[type=radio]').attr('id', 'element');
    parsleyInstance = $('#element').parsley();
    expect(parsleyInstance.__class__).to.be('ParsleyFieldMultiple');
    expect(parsleyInstance.options.multiple).to.be('element');
    $('#element').attr('name', 'element');
    parsleyInstance = $('input[name=element]').parsley();
    expect(parsleyInstance.__class__).to.be('ParsleyFieldMultiple');
    expect(parsleyInstance.options.multiple).to.be('element');
    parsleyInstance.destroy();
    $('#element').attr('data-parsley-multiple', 'elementfoo');
    parsleyInstance = $('input[name=element]').parsley();
    expect(parsleyInstance.__class__).to.be('ParsleyFieldMultiple');
    expect(parsleyInstance.options.multiple).to.be('elementfoo');
  });
  it('should bind select multiple input without a name or a multiple option', () => {
    $('body').append('<select multiple id="element"></select>');
    expect($('#element').parsley().__class__).to.be('ParsleyFieldMultiple');
    expect($('#element').attr('data-parsley-multiple')).to.be('element');
  });
  it('should remove errors on change, whatever field is changed', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="checkbox" name="check[]" id="check1" value="1" required />'  +
        '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
        '<input type="checkbox" name="check[]" id="check3" value="3" />'  +
        '<input type="checkbox" name="check[]" id="check4" value="4" />'  +
      '</form>');
    $('#element').parsley().validate();
    expect($('.parsley-errors-list.filled').length).to.be(1);
    $('#check2').attr('checked', 'checked').trigger('input');
    expect($('.parsley-errors-list.filled').length).to.be(0);
  });
  it('should add errors on change if trigger enabled, whatever field is changed', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="checkbox" name="check[]" id="check1" value="1" required data-parsley-mincheck="2" data-parsley-trigger="change" />'  +
        '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
        '<input type="checkbox" name="check[]" id="check3" value="3" />'  +
        '<input type="checkbox" name="check[]" id="check4" value="4" />'  +
      '</form>');
    var parsleyInstance = $('#check1').parsley();
    expect(parsleyInstance.validationResult).to.be(true);
    $('#check3').trigger($.Event('change'));
    expect(parsleyInstance.validationResult.length).to.be(1);
  });
  it('should bind only valid multiple siblings sharing the same name', () => {
    $('body').append(
      '<form id="element">' +
        '<input name="foo" type="hidden" value="0"/>' +
        '<input name="foo" id="check" type="checkbox" value="1"/>' +
        '<input name="foo" id="check-2" type="checkbox" value="2"/>' +
      '</form>' +
      '<form id="element-2">' +
        '<input name="foo" id="other-check" type="checkbox" value="3"/>' +
      '</form>');
    $('#element, #element-2').parsley();
    expect($('#check').parsley().$elements.length).to.be(2);
  });
  it('should handle form namespace configuration inheritance and click events while multiple binding through ParsleyForm', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="radio" name="radio" id="radio1" value="3" foo-bar-required />'  +
        '<input type="radio" name="radio" id="radio2" value="4" />'  +
      '</form>');
    // set specific namespace here for form
    var parsleyInstance = $('#element').parsley({namespace: 'foo-bar-'});
    parsleyInstance.validate();
    expect($('ul.parsley-errors-list li').length).to.be(1);
    $('#radio2').trigger('click').trigger('input');
    expect($('ul.parsley-errors-list li').length).to.be(0);
  });
  it('should handle dynamic multiple items removal', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="checkbox" name="check[]" id="check1" value="1" data-parsley-check="[1, 2]" />'  +
        '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
        '<input type="checkbox" name="check[]" id="check3" value="3" />'  +
        '<input type="checkbox" name="check[]" id="check4" value="4" />'  +
      '</form>');
    // bind all multiple checkbox inputs. TODO refacto multiple binding
    $('#element').parsley();
    var parsleyInstance = $('[type=checkbox]:first').parsley();
    expect(parsleyInstance.$elements.length).to.be(4);
    $('[type=checkbox]:last').remove();
    // validate form to go through all multiple inputs. TODO refacto multiple binding
    $('#element').parsley().validate();
    expect(parsleyInstance.$elements.length).to.be(3);
  });
  it('value option can be a function', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="checkbox" name="check[]" id="check1" value="1" required />'  +
        '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
        '<input type="checkbox" name="check[]" id="check3" value="3" />'  +
        '<input type="checkbox" name="check[]" id="check4" value="4" />'  +
      '</form>');
    var called = false;
    var valid = $('#element')
    .parsley({value: function() { called = true; return ['x']; }})
    .isValid();
    expect(valid).to.be(true);
    expect(called).to.be(true);
  });
  afterEach(() => {
    $('#element, #element-2, .parsley-errors-list').remove();
  });
});
