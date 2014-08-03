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
        var parsleyForm = new Parsley($('#element'));
        expect(parsleyForm.fields.length).to.be(2);
      });
      it('should bind parsleyFields children, and not excluded ones', function () {
        $('body').append(
          '<form id="element">'                 +
            '<input id="field1" type="text"/>'  +
            '<div id="field2"></div>'           +
            '<textarea id="field2"></textarea>' +
            '<div data-parsley-validate></div>' + // ParsleyForm, not a valid child
            '<input id="field3" disabled />'    + // Disabled, excluded buy custom options below
            '<input type="submit"/>'            + // Excluded field, not valid
          '</form>');
        var parsleyForm = new Parsley($('#element'), { excluded: '[disabled], input[type=button], input[type=submit], input[type=reset]' });
        expect(parsleyForm.fields.length).to.be(2);
      });
      it('should properly bind options for form and children fields', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
        var parsleyForm = new Parsley($('#element'));
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
          var parsleyForm = new Parsley($('#element'));
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
          var parsleyForm = new Parsley($('#element'));
          expect(parsleyForm.isValid()).to.be(false);
          $('#field1').val('value');
          expect(parsleyForm.isValid()).to.be(false);
          expect(parsleyForm.isValid('foo')).to.be(true);
          expect(parsleyForm.isValid('bar')).to.be(false);
      });
      it('should handle group validation with controls with multiple group names', function () {
        $('body').append(
          '<form id="element">'                                                                        +
            '<input id="field1" type="text" data-parsley-group=\'["foo", "baz"]\' data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                                                  +
            '<textarea id="field3" data-parsley-group="bar" data-parsley-required="true"></textarea>'  +
          '</form>');
          var parsleyForm = new Parsley($('#element'));
          expect(parsleyForm.isValid()).to.be(false);
          $('#field1').val('value');
          expect(parsleyForm.isValid()).to.be(false);
          expect(parsleyForm.isValid('foo')).to.be(true);
          expect(parsleyForm.isValid('baz')).to.be(true);
          expect(parsleyForm.isValid('bar')).to.be(false);
      });
      it('should handle `onFormSubmit` validation', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
          var parsleyForm = new Parsley($('#element'));

          // parsley.remote hack because if valid, parsley remote re-send form
          parsleyForm.subscribe('parsley:form:validate', function (formInstance) {
            if (formInstance.asyncSupport)
              formInstance.submitEvent._originalPreventDefault();
          });

          var event = $.Event();
          // parsley.remote hack
          event._originalPreventDefault = event.preventDefault;
          event.preventDefault = sinon.spy();
          parsleyForm.onSubmitValidate(event);
          expect(event.preventDefault.called).to.be(true);

          $('#field1').val('foo');
          $('#field3').val('foo');

          event = $.Event();
          // parsley.remote hack
          event._originalPreventDefault = event.preventDefault;
          event.preventDefault = sinon.spy();
          parsleyForm.onSubmitValidate(event);

          if (!parsleyForm.asyncSupport)
            expect(event.preventDefault.called).to.be(false);
          else
            expect(event.preventDefault.called).to.be(true);
      });
      it('should have a force option for validate and isValid methods', function () {
        $('body').append(
          '<form id="element">'                                   +
            '<input id="field1" type="email" />'                  +
            '<input id="field3" data-parsley-notblank="true" />'  +
          '</form>');
        expect($('#element').parsley().isValid()).to.be(true);
        expect($('#element').parsley().isValid(undefined, true)).to.be(false);
        expect($('#element').parsley().validate()).to.be(true);
        expect($('#element').parsley().validate(undefined, true)).to.be(false);
      });
      it('should properly bind dynamically added fields', function () {
        $('body').append('<form id="element" data-parsley-trigger="change"></form>');
        $('#element').append('<input type="email" id="email" required />');
        var fieldInstance = $('#email').psly();
        expect(fieldInstance.__class__).to.be('ParsleyField');
        var formInstance = $('#element').psly();
        // form corectly have its field, and field have finaly its parent form
        expect(formInstance.fields[0].$element.attr('id')).to.be('email');
        expect(fieldInstance.parent.__class__).to.be('ParsleyForm');
      });
      it('should stop event propagation on form submit', function (done) {
        $('body').append('<form id="element"><input type="text" required/></form>');
        var parsleyInstance = $('#element').parsley();

        $('#element').on('submit', function () {
          // It sould never pass here!
          expect(true).to.be(false);
        });

        parsleyInstance.subscribe('parsley:form:validated', function () {
          done();
        });

        $('#element').submit();
      });
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();
      });
    });
  };
});
