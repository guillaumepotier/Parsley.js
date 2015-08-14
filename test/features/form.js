define(function () {
  return function (ParsleyForm) {
    describe('ParsleyForm', function () {
      it('should be a function', function () {
        expect(ParsleyForm).to.be.a('function');
      });
      it('should bind parsleyFields children', function () {
        $('body').append(
          '<form id="element">'                 +
            '<input id="field1" type="text"/>'  +
            '<div id="field2"></div>'           +
            '<textarea id="field2"></textarea>' +
          '</form>');
        var parsleyForm = $('#element').parsley();
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
            '<input id="field-excluded" data-parsley-excluded="true" />'    + // Disabled, excluded buy custom options below
            '<input type="submit"/>'            + // Excluded field, not valid
          '</form>');
        var parsleyForm = $('#element').parsley({ excluded: '[disabled], input[type=button], input[type=submit], input[type=reset]' });
        expect(parsleyForm.fields.length).to.be(2);
      });
      it('should properly bind options for form and children fields', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
        var parsleyForm = $('#element').parsley();
        expect(parsleyForm.fields.length).to.be(2);
        expect($('#field1').parsley().options.trigger).to.be('change');
        expect($('#field1').parsley().options.required).to.eql(true);
        expect($('#field1').parsley().options.notblank).to.be(undefined);
        expect($('#field3').parsley().options.notblank).to.eql(true);
        expect($('#field3').parsley().options.required).to.be(undefined);
      });
      it('should properly store validation state after `validate()`', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
          var parsleyForm = $('#element').parsley();
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
          var parsleyForm = $('#element').parsley();
          expect(parsleyForm.isValid()).to.be(false);
          $('#field1').val('value');
          expect(parsleyForm.isValid()).to.be(false);
          expect(parsleyForm.isValid('foo')).to.be(true);
          expect(parsleyForm.isValid('bar')).to.be(false);
      });
      it('should handle group validation with controls with multiple group names', function () {
        $('body').append(
          '<form id="element">'                                                                        +
            '<input id="field1" type="text" data-parsley-group=\'["foo", "bar"]\' data-parsley-required="true" />'  +
            '<input id="field2" type="text" data-parsley-group=\'["bar", "baz"]\' data-parsley-required="true" />'  +
            '<textarea id="field3" data-parsley-group=\'["baz", "qux"]\' data-parsley-required="true"></textarea>'  +
          '</form>');
          var parsleyForm = $('#element').parsley();
          expect(parsleyForm.isValid()).to.be(false);
          $('#field1').val('value');
          $('#field2').val('value');
          expect(parsleyForm.isValid()).to.be(false);
          // group name only on one required field, with value
          expect(parsleyForm.isValid('foo')).to.be(true);
          // group name on multiple required fields, all with values
          expect(parsleyForm.isValid('bar')).to.be(true);
          // group name on multiple required fields, one missing a value
          expect(parsleyForm.isValid('baz')).to.be(false);
          // group name on single required field, without value
          expect(parsleyForm.isValid('qux')).to.be(false);
      });
      it('should handle form submission correctly', function (done) {
        $('body').append(
          '<form id="element">'                 +
            '<input id="field1" type="text" name="nick" data-parsley-required="true" />'  +
            '<div id="field2" name="comment"></div>'                                         +
            '<input type="submit" name="foo" value="bar" />'  +
            '<input type="submit" name="foo" value="other" />'  +
          '</form>');
          var parsleyForm = $('#element').parsley();

          $('#element input:last').click();
          // Form should not be submitted at this point

          $('#field1').val('foo');
          $('#element').on('submit', function(evt) {
            if(evt.parsley) {
              evt.preventDefault();
              done();
            }
          });
          $('#element input:last').click();
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
      it('should fire the right callbacks in the right order', function () {
        var $form = $('<form id="element"><input type="string" required /><form>').appendTo($('body'));
        $form.on('submit', function (e) {
          e.preventDefault();
        });

        var callbacks = [];
        $.each(['validate', 'error', 'success', 'validated', 'submit'], function (i, cb) {
          $form.parsley().on('form:' + cb, function () {
            callbacks.push(cb);
          });
        });
        $form.parsley();
        $form.submit();
        $form.find('input').val('Hello');
        $form.submit();
        expect(callbacks.join()).to.be('validate,error,validated,validate,success,validated,submit');
      });
      it('should fire "form:validate.parsley" to give the opportunity for changes before validation occurs', function() {
        var $form = $('<form><input type="string" required /><form>').appendTo($('body'));
        $form.parsley().on('form:validate', function () {
          this.$element.find('input').remove();
        });
        expect($form.parsley().validate()).to.be(true);
      });
      it('should stop event propagation on form submit', function (done) {
        $('body').append('<form id="element"><input type="text" required/></form>');
        var parsleyInstance = $('#element').parsley()
        .on('form:validated', function () {
          done();
        });
        $('#element').on('submit', function () {
          // It sould never pass here!
          expect(true).to.be(false);
        })
        .submit();
      });

      it('should fire form:submit.event and be interruptable when validated', function (done) {
        $('<form id="element"></form>')
        .appendTo('body')
        .parsley()
        .on('form:submit', function() {
          done();
          return false;
        });
        $('#element').submit();
      });

      it('should fire field:reset event if fields are removed or excluded', function () {
        var parsleyInstance,
          steps = [],
          step = 'init',
          parsleyForm = $('<form id="element"><input type="text" required></form>')
            .appendTo('body')
            .parsley()
            .on('field:reset', function() {
              steps.push('form: ' + step);
              expect(this).to.be(parsleyInstance);
            })
            ;
        parsleyInstance = $('#element input').parsley()
          .on('field:reset', function() {
              steps.push('field: ' + step);
              expect(this).to.be(parsleyInstance);
            });

        parsleyForm.validate();
        parsleyForm.validate();
        parsleyForm.options.excluded = '[required]';
        step = 'excluded';
        parsleyForm.validate();
        parsleyForm.validate();
        parsleyForm.options.excluded = '';
        step = 'not excluded';
        parsleyForm.validate();
        parsleyForm.validate();
        var $i = $('#element input').detach();
        step = 'detached';
        parsleyForm.validate();
        parsleyForm.validate();
        $i.appendTo('form');
        step = 'reattached';
        parsleyForm.validate();
        parsleyForm.validate();
        $i.remove();
        step = 'removed';
        parsleyForm.validate();
        parsleyForm.validate();
        expect(steps).to.eql(['field: excluded', 'form: excluded', 'field: detached', 'form: detached', 'field: removed', 'form: removed']);
      });

      it('should handle validators returning promises', function (done) {
        var called = 0;
        var shouldSubmit = false;
        var form = $('<form id="element"><input data-parsley-custom value="x"/></form>')
        .appendTo('body')
        .parsley();
        var deferred;
        window.Parsley.addValidator('custom', function() {
          called++;
          deferred = $.Deferred();
          return deferred.promise();
        });

        $('#element').on('submit', function(evt) {
          evt.preventDefault();
          expect(evt.parsley).to.be(true); // Sanity check
          expect(shouldSubmit).to.be(true);
          window.Parsley.removeValidator('custom');
          done();
        })
        $('#element').submit();
        expect(called).to.eql(1);
        deferred.reject();

        var promise = form.whenValidate();
        expect(called).to.eql(2);
        expect(promise.state()).to.eql('pending');
        deferred.reject();
        expect(promise.state()).to.eql('rejected');

        $('#element').submit();
        expect(called).to.eql(3);
        shouldSubmit = true;
        deferred.resolve();
      });

      afterEach(function () {
        $('#element').remove();
      });
    });
  };
});
