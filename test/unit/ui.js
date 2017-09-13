import $ from 'jquery';
import UI from '../../src/parsley/ui';
import Parsley from '../../src/parsley';

describe('UI', () => {
  before(() => {
    Parsley.setLocale('en');
  });

  it('should create proper errors container when needed', () => {
    $('body').append('<input type="text" id="element" data-parsley-required />');
    var parsleyField = $('#element').psly();
    expect($('ul#parsley-id-' + parsleyField.__id__).length).to.be(0);
    parsleyField.validate();
    expect($('#element').attr('data-parsley-id')).to.be(parsleyField.__id__);
    expect($('ul#parsley-id-' + parsleyField.__id__).length).to.be(1);
    expect($('ul#parsley-id-' + parsleyField.__id__).hasClass('parsley-errors-list')).to.be(true);
  });
  it('should handle errors-container option', () => {
    $('body').append(
      '<form id="element">'                                                                      +
        '<input id="field1" type="text" required data-parsley-errors-container="#container" />'  +
        '<div id="container"></div>'                                                             +
        '<div id="container2"></div>'                                                            +
      '</form>');
    $('#element').psly().validate();
    expect($('#container .parsley-errors-list').length).to.be(1);
    $('#element').psly().destroy();
    $('#field1').removeAttr('data-parsley-errors-container');
    $('#element').psly({
      errorsContainer: function (ins) {
        expect(ins).to.be($('#field1').psly());
        expect(this).to.be($('#field1').psly());
        return $('#container2');
      }
    }).validate();
    expect($('#container2 .parsley-errors-list').length).to.be(1);
  });
  it('should handle errors-container option with function', () => {
    $('body').append(
      '<form id="element">'                                                                                    +
        '<input id="field1" type="text" required data-parsley-errors-container="parsleyContainerFunction" />'  +
        '<div id="container"></div>'                                                                           +
        '<div id="container2"></div>'                                                                          +
      '</form>');
    window.parsleyContainerFunction = function (ins) {
      expect(ins).to.be($('#field1').psly());
      expect(this).to.be($('#field1').psly());
      return $('#container2');
    };
    $('#element').psly().validate();
    expect($('#container2 .parsley-errors-list').length).to.be(1);
    delete window.parsleyContainerFunction;
  });
  it('should handle wrong errors-container option', () => {
    $('body').append('<input type="text" id="element" data-parsley-errors-container="#donotexist" required/>');
    var parsley = $('#element').psly();
    expectWarning(() => {
      parsley.validate();
    });
  });
  it('should not add success class on a field without constraints', () => {
    $('body').append('<input type="text" id="element" />');
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('#element').hasClass('parsley-error')).to.be(false);
    expect($('#element').hasClass('parsley-success')).to.be(false);
  });
  it('should not add success class on an empty optional field', () => {
    $('body').append('<input type="number" id="element" />');
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('#element').hasClass('parsley-error')).to.be(false);
    expect($('#element').hasClass('parsley-success')).to.be(false);
  });
  var checkType = (type, html, fillValue) => {
    it(`should add proper parsley class on success or failure (${type})`, () => {
      $('body').append(`<form id="element"><section>${html}</section></form>`);
      let form = $('#element').parsley();
      let $inputHolder = $('#element section').children().first();
      form.validate();
      expect($inputHolder.attr('class')).to.be('parsley-error');
      expect($('.parsley-errors-list').parent().prop("tagName")).to.be('SECTION');
      // Fill and revalidate:
      fillValue($inputHolder);
      form.validate();
      expect($inputHolder.attr('class')).to.be('parsley-success');
    });
  };

  let callVal = $input => $input.val('foo');
  checkType('text', '<input type="text" required/>', callVal);
  checkType('select', '<select multiple required><option value="foo">foo</option>', callVal);

  let callProp = $fieldset => $fieldset.find('input').prop('checked', true);
  checkType('radio', '<fieldset><input type="radio" name="foo" required /></fieldset>', callProp);
  checkType('checkbox', '<fieldset><input type="checkbox" name="foo" required /></fieldset>', callProp);

  it('should handle class-handler option', () => {
    $('body').append(
      '<form id="element">'                                                                 +
        '<input id="field1" type="email" data-parsley-class-handler="#field2" required />'  +
        '<div id="field2"></div>'                                                           +
        '<div id="field3"></div>'                                                           +
      '</form>');
    $('#element').psly().validate();
    expect($('#field2').hasClass('parsley-error')).to.be(true);
    $('#element').psly().destroy();
    $('#field1').removeAttr('data-parsley-class-handler');
    $('#element').psly({
      classHandler: function (ins) {
        expect(ins).to.be($('#field1').parsley());
        expect(this).to.be($('#field1').parsley());
        return $('#field3');
      }
    }).validate();
    expect($('#field3').hasClass('parsley-error')).to.be(true);
  });
  it('should handle class-handler option with a function', () => {
    $('body').append(
      '<form id="element">'                                                                 +
        '<input id="field1" type="email" data-parsley-class-handler="#field2" required />'  +
        '<div id="field4"></div>'                                                           +
      '</form>');
    $('#field1').attr('data-parsley-class-handler', 'parsleyClassHandler');
    window.parsleyClassHandler = function (ins) {
      expect(ins).to.be($('#field1').parsley());
      expect(this).to.be($('#field1').parsley());
      return $('#field4');
    };
    $('#element').psly().validate();
    expect($('#field4').hasClass('parsley-error')).to.be(true);
    $('#element').psly().destroy();
    $('#field1').attr('data-parsley-class-handler', 'someUndefinedFunctionName');
    expectWarning(() => {
      $('#element').psly().validate();
    });
    expect($('#field1').hasClass('parsley-error')).to.be(true);
    delete window.parsleyClassHandler;
  });
  it('should show higher priority error message by default', () => {
    $('body').append('<input type="email" id="element" required />');
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('#element').hasClass('parsley-error')).to.be(true);
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').hasClass('parsley-required')).to.be(true);

    $('#element').val('foo').psly().validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').hasClass('parsley-type')).to.be(true);
  });
  it('should show all errors message if priority enabled set to false', () => {
    $('body').append('<input type="email" id="element" required data-parsley-priority-enabled="false"/>');
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(2);
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').eq(0).hasClass('parsley-required')).to.be(true);
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').eq(1).hasClass('parsley-type')).to.be(true);

    $('#element').val('foo').psly().validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').hasClass('parsley-type')).to.be(true);
  });
  it('should show custom error message by validator', () => {
    $('body').append('<input type="email" id="element" required data-parsley-required-message="foo" data-parsley-type-message="bar"/>');
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('foo');
    $('#element').val('foo').psly().validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('bar');
  });
  it('should show custom error message with variabilized parameters', () => {
    $('body').append('<input type="text" id="element" value="bar" data-parsley-minlength="7" data-parsley-minlength-message="foo %s bar"/>');
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('foo 7 bar');
  });
  it('should show custom error message for whole field', () => {
    $('body').append('<input type="email" id="element" required data-parsley-error-message="baz"/>');
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('baz');
    $('#element').val('foo').psly().validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('baz');
    $('#element').val('foo@bar.baz').psly().validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
  });
  it('should display no error message if diabled', () => {
    $('body').append('<input type="email" id="element" required data-parsley-errors-messages-disabled />');
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
    expect($('#element').hasClass('parsley-error')).to.be(true);
  });
  it('should handle simple triggers (change, focus...)', () => {
    $('body').append('<input type="email" id="element" required data-parsley-trigger="change" />');
    var parsleyField = $('#element').psly();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
    $('#element').trigger($.Event('change'));
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
  });
  it('should allow customization of triggers after first error', () => {
    $('body').append('<input type="email" id="element" required data-parsley-trigger-after-failure="focusout" />');
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
    $('#element').val('a@example.com');
    $('#element').trigger('input');
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
    $('#element').trigger('focusout');
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
  });
  it('should auto bind error trigger on select field error (input=text)', () => {
    $('body').append('<input type="email" id="element" required />');
    var parsleyField = $('#element').psly();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').hasClass('parsley-required')).to.be(true);
    $('#element').val('foo').trigger('input');
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').hasClass('parsley-type')).to.be(true);
  });
  it('should auto bind error trigger on select field error (select)', () => {
    $('body').append('<select id="element" required>' +
      '<option value="">Choose</option>' +
      '<option value="foo">foo</option>' +
      '<option value="bar">bar</option>' +
    '</select>');
    var parsleyField = $('#element').psly();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').hasClass('parsley-required')).to.be(true);
    $('#element [option="foo"]').attr('selected', 'selected');
    $('#element').trigger($.Event('change'));
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').hasClass('parsley-type')).to.be(false);
  });
  it('should handle complex triggers (keyup, keypress...)', () => {
    $('body').append('<input type="email" id="element" required data-parsley-trigger="keyup" />');
    var parsleyField = $('#element').psly();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
    $('#element').val('foo').trigger($.Event('keyup'));
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
    $('#element').val('foob').trigger($.Event('keyup'));
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
  });
  it('should handle trigger keyup threshold validation', () => {
    $('body').append('<input type="email" id="element" data-parsley-validation-threshold="7" required data-parsley-trigger="keyup" />');
    var parsleyField = $('#element').psly();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
    $('#element').val('a@b.com').trigger('keyup');
    expect($('#element').hasClass('success')).to.be(false);
    $('#element').val('aa@b.com').trigger('keyup');
    expect($('#element').hasClass('parsley-success')).to.be(true);
    $('#element').val('@b.com').trigger('keyup');
    expect($('#element').hasClass('parsley-success')).to.be(false);
  });
  it('should handle UI disabling', () => {
    $('body').append('<input type="email" id="element" data-parsley-ui-enabled="false" required data-parsley-trigger="keyup" />');
    var parsleyField = $('#element').psly();
    expect($('ul#parsley-id-' + parsleyField.__id__).length).to.be(0);
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__).length).to.be(0);
  });
  it('should add novalidate on form elem', () => {
    $('body').append(
      '<form id="element" data-parsley-trigger="change">'                 +
        '<input id="field1" type="text" data-parsley-required="true" />'  +
        '<div id="field2"></div>'                                         +
        '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
      '</form>');
    var parsleyForm = $('#element').parsley();
    expect($('#element').attr('novalidate')).not.to.be(undefined);
  });
  it('should test the no-focus option', () => {
    $('body').append(
      '<form id="element" data-parsley-focus="first">'                                          +
        '<input id="field1" type="text" data-parsley-required="true" data-parsley-no-focus />'  +
        '<input id="field2" data-parsley-required />'                                           +
      '</form>');
    $('#element').parsley().validate();
    expect($('#element').parsley()._focusedField.attr('id')).to.be('field2');
    $('#field2').val('foo');
    $('#element').psly().validate();
    expect($('#element').parsley()._focusedField).to.be(null);
    $('#field1').removeAttr('data-parsley-no-focus');
    $('#element').psly().validate();
    expect($('#element').parsley()._focusedField.attr('id')).to.be('field1');
    $('#element').attr('data-parsley-focus', 'last');
    $('#element').psly().validate();
    expect($('#element').parsley()._focusedField.attr('id')).to.be('field1');
    $('#field2').val('');
    $('#element').psly().validate();
    expect($('#element').parsley()._focusedField.attr('id')).to.be('field2');
  });
  it('should test the manual add / update / remove error', () => {
    $('body').append('<input type="text" id="element" />');
    var parsleyField = $('#element').parsley();
    parsleyField.removeError('non-existent');
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
    expect($('#element').hasClass('parsley-error')).to.be(false);
    expectWarning(() => {
      window.ParsleyUI.addError(parsleyField, 'foo', 'bar');
    });
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
    expect($('#element').hasClass('parsley-error')).to.be(true);
    expect($('li.parsley-foo').length).to.be(1);
    expect($('li.parsley-foo').text()).to.be('bar');
    expectWarning(() => {
      window.ParsleyUI.updateError(parsleyField, 'foo', 'baz');
    });
    expect($('li.parsley-foo').text()).to.be('baz');
    expectWarning(() => {
      window.ParsleyUI.removeError(parsleyField, 'foo');
    });
    expect($('#element').hasClass('parsley-error')).to.be(false);
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
  });
  it('should have a getErrorsMessage() method', () => {
    $('body').append('<input type="email" id="element" value="foo" data-parsley-minlength="5" />');
    var parsleyInstance = $('#element').parsley();
    parsleyInstance.validate();
    expectWarning(() => {
      window.ParsleyUI.getErrorsMessages(parsleyInstance);
    });
    expect(window.ParsleyUI.getErrorsMessages(parsleyInstance).length).to.be(1);
    expect(window.ParsleyUI.getErrorsMessages(parsleyInstance)[0]).to.be('This value should be a valid email.');

    $('#element').attr('data-parsley-priority-enabled', false);
    parsleyInstance.validate();
    expect(window.ParsleyUI.getErrorsMessages(parsleyInstance).length).to.be(2);
    expect(window.ParsleyUI.getErrorsMessages(parsleyInstance)[0]).to.be('This value is too short. It should have 5 characters or more.');

  });
  it('should not have errors ul created for excluded fields', () => {
    $('body').append('<div id="hidden"><input type="hidden" id="element" value="foo" data-parsley-minlength="5" /></div>');
    var parsleyInstance = $('#element').parsley();
    expect($('#hidden ul').length).to.be(0);
    $('#hidden').remove();
  });
  it('should remove filled class from errors container when reseting', () => {
    $('body').append('<input type="email" id="element" value="foo" data-parsley-minlength="5" />');
    var parsleyInstance = $('#element').parsley();
    parsleyInstance.validate();
    parsleyInstance.reset();
    expect($('ul#parsley-id-' + parsleyInstance.__id__).hasClass('filled')).to.be(false);
  });
  it('should re-bind error triggers after a reset (input=text)', () => {
    $('body').append('<input type="text" id="element" required />');
    var parsleyInstance = $('#element').parsley();
    parsleyInstance.validate();
    parsleyInstance.reset();
    parsleyInstance.validate();
    expect($('ul#parsley-id-' + parsleyInstance.__id__ + ' li').length).to.be(1);
    $('#element').val('foo').trigger('input');
    expect($('ul#parsley-id-' + parsleyInstance.__id__ + ' li').length).to.be(0);
  });
  it('should re-bind error triggers after a reset (select)', () => {
    $('body').append('<select id="element" required>' +
      '<option value="">Choose</option>' +
      '<option value="foo">foo</option>' +
      '<option value="bar">bar</option>' +
    '</select>');
    var parsleyInstance = $('#element').parsley();
    parsleyInstance.validate();
    parsleyInstance.reset();
    parsleyInstance.validate();
    expect($('ul#parsley-id-' + parsleyInstance.__id__ + ' li').length).to.be(1);
    $('#element option[value="foo"]').prop('selected', true);
    $('#element').trigger('input');
    expect($('ul#parsley-id-' + parsleyInstance.__id__ + ' li').length).to.be(0);
  });
  it('should re-bind custom triggers after a reset', () => {
    $('body').append('<input type="text" id="element" required data-parsley-trigger="focusout" />');
    var parsleyInstance = $('#element').parsley();
    parsleyInstance.validate();
    parsleyInstance.reset();
    $('#element').trigger('focusout');
    expect($('ul#parsley-id-' + parsleyInstance.__id__ + ' li').length).to.be(1);
  });
  it('should handle custom error message for validators with compound names', () => {
    $('body').append('<input type="text" value="1" id="element" data-parsley-custom-validator="2" data-parsley-custom-validator-message="custom-validator error"/>');
    window.Parsley.addValidator('customValidator', (value, requirement) => {
      return requirement === value;
    }, 32);
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('custom-validator error');
    window.Parsley.removeValidator('customValidator');
  });
  it('should handle custom error messages returned from custom validators', () => {
    $('body').append('<input type="text" value="1" id="element" data-parsley-custom-validator="2" data-parsley-custom-validator-message="custom-validator error"/>');
    window.Parsley.addValidator('customValidator', (value, requirement) => {
      return $.Deferred().reject("Hey, this ain't good at all").promise();
    }, 32);
    var parsleyField = $('#element').psly();
    parsleyField.validate();
    expect($(`ul#parsley-id-${parsleyField.__id__} li`).text()).to.be("Hey, this ain't good at all");
    window.Parsley.removeValidator('customValidator');
  });
  it('should run before events are fired', () => {
    $('body').append('<input type="text" id="element" required/>');
    var parsley = $('#element').parsley().on('field:validated', () => {
      expect($('.parsley-errors-list')).to.have.length(1);
    });
    parsley.validate();
  });

  afterEach(() => {
    $('#element, .parsley-errors-list').remove();
  });
});
