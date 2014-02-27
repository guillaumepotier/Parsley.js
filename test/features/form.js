define(function () {
  return function (ParsleyForm, Parsley) {
    describe('ParsleyForm', function () {
      it('should be a function', function () {
        expect(ParsleyForm).to.be.a('function');
      });
      it('should throw an error if no element given', function () {
        expect(ParsleyForm).to.throwException();
      });
      it('should bind parsleyFields children', function () {
        $('body').append(
          '<form id="element">'                 +
            '<input id="field1" type="text"/>'  +
            '<div id="field2"></div>'           +
            '<textarea id="field2"></textarea>' +
          '</form>');
        parsleyForm = new Parsley($('#element'));
        expect(parsleyForm.fields.length).to.be(2);
      });
      it('should bind parsleyFields children, and not excluded ones', function () {
        $('body').append(
          '<form id="element">'                 +
            '<input id="field1" type="text"/>'  +
            '<div id="field2"></div>'           +
            '<textarea id="field2"></textarea>' +
            '<div data-parsley-validate></div>' + // ParsleyForm, not a valid child
            '<input type="submit"/>'            + // Excluded field, not valid
          '</form>');
        parsleyForm = new Parsley($('#element'));
        expect(parsleyForm.fields.length).to.be(2);
      });
      it('should properly bind options for form and children fields', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
        parsleyForm = new Parsley($('#element'));
        expect(parsleyForm.fields.length).to.be(2);
        expect(new Parsley('#field1').options.trigger).to.be('change');
        expect(new Parsley('#field1').options).to.have.key('required');
        expect(new Parsley('#field1').options).to.not.have.key('notblank');
        expect(new Parsley('#field3').options).to.have.key('notblank');
        expect(new Parsley('#field3').options).to.not.have.key('required');
      });
      it('should properly store validation state after `validate()`', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
          parsleyForm = new Parsley($('#element'));
          parsleyForm.validate();
          expect(parsleyForm.validationResult).to.be(false);
          $('#field1').val('foo');
          $('#field3').val('foo');
          expect(parsleyForm.validate()).to.be(true);
      });
      it('should handle group validation', function () {
        $('body').append(
          '<form id="element">'                                                                        +
            '<input id="field1" type="text" data-parsley-group="foo" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                                                  +
            '<textarea id="field3" data-parsley-group="bar" data-parsley-required="true"></textarea>'  +
          '</form>');
          parsleyForm = new Parsley($('#element'));
          expect(parsleyForm.isValid()).to.be(false);
          $('#field1').val('value');
          expect(parsleyForm.isValid()).to.be(false);
          expect(parsleyForm.isValid('foo')).to.be(true);
          expect(parsleyForm.isValid('bar')).to.be(false);
      });
      it('should handle `onFormSubmit` validation', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
          parsleyForm = new Parsley($('#element'));
          var event = $.Event();
          event.preventDefault = sinon.spy();
          parsleyForm.onSubmitValidate(event);
          expect(event.preventDefault.called).to.be(true);

          $('#field1').val('foo');
          $('#field3').val('foo');
          event = $.Event();
          event.preventDefault = sinon.spy();
          parsleyForm.onSubmitValidate(event);
          expect(event.preventDefault.called).to.be(false);
      });
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();
      });
    });
  };
});
