define(function () {
  return function (ParsleyUI) {
    describe('ParsleyUI', function () {
      it('should be a function', function () {
        expect(ParsleyUI).to.be.a('function');
      });
      it('should have a listen() method', function () {
        var UI = new ParsleyUI();
        expect(UI.listen).not.to.be(undefined);
      });
      it('should create proper errors container when needed', function () {
        $('body').append('<input type="text" id="element" data-parsley-required />');
        var parsleyField = $('#element').psly();
        expect($('#element').attr('data-parsley-id')).to.be(parsleyField.__id__);
        expect($('ul#parsley-id-' + parsleyField.__id__).length).to.be(0);
        parsleyField.validate();
        expect($('ul#parsley-id-' + parsleyField.__id__).length).to.be(1);
        expect($('ul#parsley-id-' + parsleyField.__id__).hasClass('parsley-errors-list')).to.be(true);
      });
      it('should handle errors-container option', function () {
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
          errorsContainer: function () { return $('#container2'); }
        }).validate();
        expect($('#container2 .parsley-errors-list').length).to.be(1);
      });
      it('should handle wrong errors-container option', function () {
        $('body').append('<input type="text" id="element" data-parsley-errors-container="#donotexist" required/>');
        var parsley = $('#element').psly();
        expectWarning(function() {
          parsley.validate();
        });
      });
      it('should add proper parsley class on success or failure (type=text)', function () {
        $('body').append('<input type="text" id="element" required />');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('#element').hasClass('parsley-error')).to.be(true);
        expect($('#element').hasClass('parsley-success')).to.be(false);
        $('#element').val('foo').psly().validate();
        expect($('#element').hasClass('parsley-success')).to.be(true);
        expect($('#element').hasClass('parsley-error')).to.be(false);
      });
      it('should not add success class on a field without constraints', function () {
        $('body').append('<input type="text" id="element" />');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('#element').hasClass('parsley-error')).to.be(false);
        expect($('#element').hasClass('parsley-success')).to.be(false);
      });
      it('should not add success class on an empty optional field', function () {
        $('body').append('<input type="number" id="element" />');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('#element').hasClass('parsley-error')).to.be(false);
        expect($('#element').hasClass('parsley-success')).to.be(false);
      });
      it('should add proper parsley class on success or failure (type=radio)', function () {
        $('body').append('<input type="radio" id="element" required />');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('#element').parent().hasClass('parsley-error')).to.be(true);
        expect($('#element').parent().hasClass('parsley-success')).to.be(false);
        $('#element').attr('checked', 'checked').psly().validate();
        expect($('#element').parent().hasClass('parsley-success')).to.be(true);
        expect($('#element').parent().hasClass('parsley-error')).to.be(false);
      });
      it('should add proper parsley class on success or failure (input=checkbox)', function () {
        $('body').append('<input type="checkbox" id="element" required />');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('#element').parent().hasClass('parsley-error')).to.be(true);
        expect($('#element').parent().hasClass('parsley-success')).to.be(false);
        $('#element').attr('checked', 'checked').psly().validate();
        expect($('#element').parent().hasClass('parsley-success')).to.be(true);
        expect($('#element').parent().hasClass('parsley-error')).to.be(false);
      });
      it('should add proper parsley class on success or failure (select multiple)', function () {
        $('body').append('<select multiple id="element" required><option value="foo">foo</option></select>');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('#element').hasClass('parsley-error')).to.be(true);
        expect($('#element').hasClass('parsley-success')).to.be(false);
        $('#element option[value="foo"]').attr('selected', 'selected');
        parsleyField.validate();
        expect($('#element').hasClass('parsley-success')).to.be(true);
        expect($('#element').hasClass('parsley-error')).to.be(false);
      });
      it('should handle class-handler option', function () {
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
          classHandler: function () { return $('#field3'); }
        }).validate();
        expect($('#field3').hasClass('parsley-error')).to.be(true);
      });
      it('should show higher priority error message by default', function () {
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
      it('should show all errors message if priority enabled set to false', function () {
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
      it('should show custom error message by validator', function () {
        $('body').append('<input type="email" id="element" required data-parsley-required-message="foo" data-parsley-type-message="bar"/>');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('foo');
        $('#element').val('foo').psly().validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('bar');
      });
      it('should show custom error message with variabilized parameters', function () {
        $('body').append('<input type="text" id="element" value="bar" data-parsley-minlength="7" data-parsley-minlength-message="foo %s bar"/>');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('foo 7 bar');
      });
      it('should show custom error message for whole field', function () {
        $('body').append('<input type="email" id="element" required data-parsley-error-message="baz"/>');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('baz');
        $('#element').val('foo').psly().validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('baz');
        $('#element').val('foo@bar.baz').psly().validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
      });
      it('should display no error message if diabled', function () {
        $('body').append('<input type="email" id="element" required data-parsley-errors-messages-disabled />');
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
        expect($('#element').hasClass('parsley-error')).to.be(true);
      });
      it('should handle simple triggers (change, focus...)', function () {
        $('body').append('<input type="email" id="element" required data-parsley-trigger="change" />');
        var parsleyField = $('#element').psly();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
        $('#element').trigger($.Event('change'));
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
      });
      it('should auto bind error trigger on select field error (input=text)', function () {
        $('body').append('<input type="email" id="element" required />');
        var parsleyField = $('#element').psly();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
        parsleyField.validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').hasClass('parsley-required')).to.be(true);
        $('#element').val('foo').trigger($.Event('keyup'));
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').hasClass('parsley-type')).to.be(true);
      });
      it('should auto bind error trigger on select field error (select)', function () {
        $('body').append('<select id="element" required>'+
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
      it('should handle complex triggers (keyup, keypress...)', function () {
        $('body').append('<input type="email" id="element" required data-parsley-trigger="keyup" />');
        var parsleyField = $('#element').psly();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
        $('#element').val('foo').trigger($.Event('keyup'));
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
        $('#element').val('foob').trigger($.Event('keyup'));
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
      });
      it('should handle trigger keyup threshold validation', function () {
        $('body').append('<input type="email" id="element" data-parsley-validation-threshold="2" required data-parsley-trigger="keyup" />');
        var parsleyField = $('#element').psly();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
        $('#element').val('fo').trigger($.Event('keyup'));
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
        $('#element').val('foo').trigger($.Event('keyup'));
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
      });
      it('should handle UI disabling', function () {
        $('body').append('<input type="email" id="element" data-parsley-ui-enabled="false" required data-parsley-trigger="keyup" />');
        var parsleyField = $('#element').psly();
        expect($('ul#parsley-id-' + parsleyField.__id__).length).to.be(0);
        parsleyField.validate();
        expect($('ul#parsley-id-' + parsleyField.__id__).length).to.be(0);
      });
      it('should add novalidate on form elem', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
        var parsleyForm = $('#element').parsley();
        expect($('#element').attr('novalidate')).not.to.be(undefined);
      });
      it('should test the no-focus option', function () {
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
      it('should test the manual add / update / remove error', function () {
        $('body').append('<input type="text" id="element" />');
        var parsleyField = $('#element').parsley();
        parsleyField.validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
        expect($('#element').hasClass('parsley-error')).to.be(false);
        window.ParsleyUI.addError(parsleyField, 'foo', 'bar');
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);
        expect($('#element').hasClass('parsley-error')).to.be(true);
        expect($('li.parsley-foo').length).to.be(1);
        expect($('li.parsley-foo').text()).to.be('bar');
        window.ParsleyUI.updateError(parsleyField, 'foo', 'baz');
        expect($('li.parsley-foo').text()).to.be('baz');
        window.ParsleyUI.removeError(parsleyField, 'foo');
        expect($('#element').hasClass('parsley-error')).to.be(false);
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
      });
      it('should have a getErrorsMessage() method', function () {
        $('body').append('<input type="email" id="element" value="foo" data-parsley-minlength="5" />');
        var parsleyInstance = $('#element').parsley();
        parsleyInstance.validate();
        expect(window.ParsleyUI.getErrorsMessages(parsleyInstance).length).to.be(1);
        expect(window.ParsleyUI.getErrorsMessages(parsleyInstance)[0]).to.be('This value should be a valid email.');

        $('#element').attr('data-parsley-priority-enabled', false);
        parsleyInstance.validate();
        expect(window.ParsleyUI.getErrorsMessages(parsleyInstance).length).to.be(2);
        expect(window.ParsleyUI.getErrorsMessages(parsleyInstance)[0]).to.be('This value is too short. It should have 5 characters or more.');
      });
      it('should not have errors ul created for excluded fields', function () {
        $('body').append('<div id="hidden"><input type="hidden" id="element" value="foo" data-parsley-minlength="5" /></div>');
        var parsleyInstance = $('#element').parsley();
        expect($('#hidden ul').length).to.be(0);
        $('#hidden').remove();
      });
      it('should remove filled class from errors container when reseting', function () {
        $('body').append('<input type="email" id="element" value="foo" data-parsley-minlength="5" />');
        var parsleyInstance = $('#element').parsley();
        parsleyInstance.validate();
        parsleyInstance.reset();
        expect($('ul#parsley-id-' + parsleyInstance.__id__).hasClass('filled')).to.be(false);
      });
      it('should re-bind error triggers after a reset (input=text)', function () {
        $('body').append('<input type="text" id="element" required />');
        var parsleyInstance = $('#element').parsley();
        parsleyInstance.validate();
        parsleyInstance.reset();
        parsleyInstance.validate();
        expect($('ul#parsley-id-' + parsleyInstance.__id__ + ' li').length).to.be(1);
        $('#element').val('foo').trigger($.Event('keyup'));
        expect($('ul#parsley-id-' + parsleyInstance.__id__ + ' li').length).to.be(0);
      });
      it('should re-bind error triggers after a reset (select)', function () {
        $('body').append('<select id="element" required>'+
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
        $('#element').trigger($.Event('change'));
        expect($('ul#parsley-id-' + parsleyInstance.__id__ + ' li').length).to.be(0);
      });
      it('should re-bind custom triggers after a reset', function () {
        $('body').append('<input type="text" id="element" required data-parsley-trigger="focusout" />');
        var parsleyInstance = $('#element').parsley();
        parsleyInstance.validate();
        parsleyInstance.reset();
        $('#element').focus().blur();
        expect($('ul#parsley-id-' + parsleyInstance.__id__ + ' li').length).to.be(1);
      });
      it('should handle custom error message for validators with compound names', function () {
        $('body').append('<input type="text" value="1" id="element" data-parsley-custom-validator="2" data-parsley-custom-validator-message="custom-validator error"/>');
        window.Parsley.addValidator('customValidator', function (value, requirement) {
          return requirement === value;
        }, 32);
        var parsleyField = $('#element').psly();
        parsleyField.validate();
        expect($('ul#parsley-id-' + parsleyField.__id__ + ' li').text()).to.be('custom-validator error');
        window.Parsley.removeValidator('customValidator');
      });

      afterEach(function () {
        $('#element, .parsley-errors-list').remove();
      });
    });
  };
});
