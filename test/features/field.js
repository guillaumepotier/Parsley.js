define(function () {
  return function (ParsleyField, Parsley) {
    describe('ParsleyField', function () {
      it('should be a function', function () {
        expect(ParsleyField).to.be.a('function');
      });
      it('should throw an error if no parsleyInstance given', function () {
        expect(ParsleyField).to.throwException();
      });
      it('should properly bind DOM constraints', function () {
        $('body').append('<input type="text" id="element" data-parsley-required />');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.constraints.length).to.be(1);
        expect(parsleyField.constraints[0].__class__).to.be('Required');
        expect(parsleyField.constraints[0].__parentClass__).to.be('Assert');
        expect(parsleyField.constraints[0].name).to.be('required');
        expect(parsleyField.constraints[0].isDomConstraint).to.be(true);
      });
      it('should properly bind HTML DOM supported constraints', function () {
        $('body').append('<input type="email" id="element" />');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.constraints.length).to.be(1);
        expect(parsleyField.constraints[0].__class__).to.be('Email');
        expect(parsleyField.constraints[0].__parentClass__).to.be('Assert');
        expect(parsleyField.constraints[0].name).to.be('type');
        expect(parsleyField.constraints[0].isDomConstraint).to.be(true);
      });
      it('should ignore unknown types', function () {
        $('body').append('<input type="" id="element" />');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.constraints.length).to.be(0);
      });
      it('should ignore mistyped types', function () {
        $('body').append('<input type="    email" id="element" />');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.constraints.length).to.be(0);
      });
      it('should have a proper addConstraint() javascript method', function () {
        $('body').append('<input type="text" id="element" />');
        var parsleyField = new Parsley($('#element'))
          .addConstraint('required', true);
        expect(parsleyField.constraints.length).to.be(1);
        expect(parsleyField.constraints[0].__class__).to.be('Required');
        expect(parsleyField.constraints[0].__parentClass__).to.be('Assert');
        expect(parsleyField.constraints[0].name).to.be('required');
        expect(parsleyField.constraints[0].requirements).to.be(true);
        expect(parsleyField.constraints[0].priority).to.be(512);
        expect(parsleyField.constraints[0].isDomConstraint).to.be(false);

        // trying to add an existing constraint result in an update
        parsleyField.addConstraint('required', false, 64);
        expect(parsleyField.constraints.length).to.be(1);
        expect(parsleyField.constraints[0].name).to.be('required');
        expect(parsleyField.constraints[0].requirements).to.be(false);
        expect(parsleyField.constraints[0].priority).to.be(64);
      });
      it('should have a proper updateConstraint() javascript method', function () {
        $('body').append('<input type="text" id="element" />');
        var parsleyField = new Parsley($('#element'))
          .addConstraint('required', true);

        // same as above test where addConstraint resulted in an updateConstraint
        parsleyField.updateConstraint('required', false, 64);
        expect(parsleyField.constraints.length).to.be(1);
        expect(parsleyField.constraints[0].name).to.be('required');
        expect(parsleyField.constraints[0].requirements).to.be(false);
        expect(parsleyField.constraints[0].priority).to.be(64);
      });
      it('should have a proper removeConstraint() javascript method', function () {
        $('body').append('<input type="text" id="element" />');
        var parsleyField = new Parsley($('#element'))
          .addConstraint('required', true)
          .addConstraint('notblank', true)
          .removeConstraint('required');
        expect(parsleyField.constraints.length).to.be(1);
        expect(parsleyField.constraints[0].name).to.be('notblank');
        expect(parsleyField._isRequired()).to.be(false);
      });
      it('should return true for fields without constraints', function () {
        $('body').append('<input type="text" id="element" value="hola" data-parsley-minlength="5" />');
        var parsleyField = new Parsley($('#element'));
        // Start with some validation errors:
        expect(parsleyField.isValid()).to.eql(false);
        // The remove constraint and check result:
        $('#element').removeAttr('data-parsley-minlength');
        expect(parsleyField.isValid()).to.be(true);
      });
      it('should properly bind HTML5 supported constraints', function () {
        $('body').append('<input type="email" pattern="\\w+" id="element" required min="5" max="100" minlength="1" maxlength="3" />');
        var parsleyField = new Parsley($('#element'));
        // 5 validators: type=email, pattern, required, (min+max => range) and (minlength+maxlength => length)
        expect(parsleyField.constraints.length).to.be(5);
        $('#element').removeAttr('min');
        // still 5 validators, with max instead of range now
        expect(parsleyField.actualizeOptions().constraints.length).to.be(5);
        $('#element').removeAttr('minlength');
        // still 5 validators, with maxlength instead of length now
        expect(parsleyField.actualizeOptions().constraints.length).to.be(5);
      });
      it('should use integer validation HTML5 `number` type without a step attribute', function () {
        $('body').append('<input type="number" id="element" />');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.constraints[0].requirements).to.be('integer');
      });
      it('should use integer validation HTML5 `number` type with integer value step', function () {
        $('body').append('<input type="number" id="element" step="3" />');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.constraints[0].requirements).to.be('integer');
      });
      it('should use number validation for HTML5 `number` with float value step', function () {
        $('body').append('<input type="number" id="element" step="0.3" />');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.constraints[0].requirements).to.be('number');
      });
      it('should use number validation for HTML5 `number` with step="any"', function () {
        $('body').append('<input type="number" id="element" step="any" />');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.constraints[0].requirements).to.be('number');
      });
      it('should valid simple validator', function () {
        $('body').append('<input type="text" id="element" value="" />');
        var parsleyField = new Parsley($('#element'))
          .addConstraint('required', true);
        expect(parsleyField.isValid()).to.be(false);
        $('#element').val('foo');
        expect(parsleyField.isValid()).to.be(true);
      });
      it('should valid more complex `type` validator', function () {
        $('body').append('<input type="text" id="element" value="foo" />');
        var parsleyField = new Parsley($('#element'))
          .addConstraint('type', 'email');
        expect(parsleyField.isValid()).to.be(false);
        $('#element').val('foo');
        expect(parsleyField.isValid()).to.be(false);
        $('#element').val('foo@bar.baz');
        expect(parsleyField.isValid()).to.be(true);
      });
      it('should valid most complex Callback() validator', function () {
        $('body').append('<input type="text" id="element" value="" />');
        ParsleyValidator.addValidator('ismultiple', function (value, multiple) {
          if (!isNaN(parseFloat(value)) && isFinite(value))
            return !(Number(value) % multiple);

          return false;
        }, 512);

        var parsleyField = new Parsley($('#element'))
          .addConstraint('ismultiple', 2);
        expect(parsleyField.isValid()).to.eql(true);
        $('#element').val('1');
        expect(parsleyField.isValid()).to.be(false);
        $('#element').val('2');
        expect(parsleyField.isValid()).to.be(true);
        parsleyField.updateConstraint('ismultiple', 3);
        expect(parsleyField.isValid()).to.be(false);
        $('#element').val('9');
        expect(parsleyField.isValid()).to.be(true);
        ParsleyValidator.removeValidator('ismultiple');
      });
      it('should properly compute constraints on each validation', function () {
        $('body').append('<input type="email" data-parsley-required id="element" />');
        ParsleyValidator.addValidator('foobazer', function (value) {
          return 'foobar' === value;
        }, 2);
        ParsleyValidator.addValidator('ismultiple', function (value, multiple) {
          if (!isNaN(parseFloat(value)) && isFinite(value))
            return !(Number(value) % multiple);

          return false;
        }, 512);

        var parsleyField = new Parsley($('#element'))
          .addConstraint('ismultiple', 4)
          .addConstraint('foobazer', true);
        parsleyField.refreshConstraints();
        expect(parsleyField.constraints.length).to.be(4);
        $('#element').removeAttr('data-parsley-required');
        parsleyField.refreshConstraints();
        expect(parsleyField.constraints.length).to.be(3);
        parsleyField
          .removeConstraint('ismultiple')
          .refreshConstraints();
        expect(parsleyField.constraints.length).to.be(2);
        ParsleyValidator.removeValidator('foobazer');
        ParsleyValidator.removeValidator('ismultiple');
      });
      it('should handle constraints priorities on validation', function () {
        $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.isValid()).to.be(false);
        expect(parsleyField.validationResult.length).to.be(1);
        expect(parsleyField.validationResult[0].assert.name).to.be('required');
        $('#element').val('foo');
        expect(parsleyField.isValid()).to.be(false);
        expect(parsleyField.validationResult.length).to.be(1);
        expect(parsleyField.validationResult[0].assert.name).to.be('type');
        $('#element').val('foo@bar.baz');
        expect(parsleyField.isValid()).to.be(false);
        expect(parsleyField.validationResult.length).to.be(1);
        expect(parsleyField.validationResult[0].assert.name).to.be('pattern');
      });
      it('should handle all violations if `priorityEnabled` is set to false', function () {
        $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
        var parsleyField = new Parsley($('#element'), { priorityEnabled: false });
        expect(parsleyField.isValid()).to.be(false);
        expect(parsleyField.validationResult.length).to.be(3);
      });
      it('should trigger field:validate event', function (done) {
        $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
        $('#element').on('field:validate.parsley', function (event, instance) {
          // we are before validation!
          expect(instance.validationResult.length).to.be(0);
          done();
        });
        $('#element').psly().validate();
      });
      it('should trigger field:validated event', function (done) {
        $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
        $('#element').on('field:validated.parsley', function (event, instance) {
          // we are after validation!
          expect(instance.validationResult.length).to.be(1);
          done();
        });
        $('#element').psly().validate();
      });
      it('should trigger field:error event', function (done) {
        $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
        $('#element').on('field:error.parsley', function (event, instance) {
          expect(instance.validationResult.length).to.be(1);
          done();
        });
        $('#element').psly().validate();
      });
      it('should trigger field:success event', function (done) {
        $('body').append('<input type="email" required id="element" value="foo@bar.baz" />');
        $('#element').on('field:success.parsley', function (event, instance) {
          expect(instance.validationResult).to.be(true);
          done();
        });
        $('#element').psly().validate();
      });
      it('should have validateIfEmpty option', function () {
        $('body').append('<input type="email" data-parsley-rangelength="[5, 10]" id="element" />');
        expect($('#element').psly().isValid()).to.be.eql(true);
        $('#element').attr('data-parsley-validate-if-empty', '');
        expect($('#element').psly().isValid()).to.be.eql(false);
      });
      it('should allow `this.value` alteration with field:validate.parsley event', function () {
        $('body').append('<input type="email" required id="element" value="foo@bar.baz" />');
        expect($('#element').parsley().validate()).to.be(true);

        $('#element').on('field:validate.parsley', function (evt, fieldInstance) {
          fieldInstance.value = '';
        });

        expect($('#element').parsley().validate()).not.to.be(true);
      });
      it('should have a force option for validate and isValid methods', function () {
        $('body').append('<input type="email" id="element" />');
        expect($('#element').parsley().isValid()).to.be.eql(true);
        expect($('#element').parsley().validate()).to.be.eql(true);
        expect($('#element').parsley().isValid(true)).to.be(false);
        expect($('#element').parsley().validate(true).length).to.be(1);
      });
      it('should allow passing a specific value to `isValid` method', function () {
        expect($('<input type="email" value="">').parsley().isValid(false)).to.be(true);
        expect($('<input type="email" value="foo">').parsley().isValid()).to.be(false);
        expect($('<input type="email" value="foo">').parsley().isValid(false, "")).to.be(true);
        expect($('<input type="email" value="">').parsley().isValid(true)).to.be(false);
        expect($('<input type="email" value="foo">').parsley().isValid(true, "")).to.be(false);
      });
      it('should have a trim-value option', function () {
        $('body').append('<input type="text" id="element" value=" foo " />');
        expect($('#element').parsley().getValue()).to.be(' foo ');
        $('#element').attr('data-parsley-trim-value', true).parsley().actualizeOptions();
        expect($('#element').parsley().getValue()).to.be('foo');
      });
      it('should inherit options from the form, even if the form is bound after', function () {
        $('body').append('<form id="element" data-parsley-required>' +
          '<input type="text"/></form>');
        var psly = $('#element input').parsley();
        expect(psly.isValid()).not.to.be(false);
        $('#element').parsley();
        expect(psly.isValid()).to.be(false);
      });
      it('should have options that can be set easily', function () {
        var psly = $('<input type="text"/>').parsley();
        psly.options.required = true;
        expect(psly.isValid()).to.be(false);
      });
      it('should have a value option', function () {
        $('body').append('<input type="text" id="element"/>');
        expect($('#element').parsley({value: 'foo'}).getValue()).to.be('foo');
      });
      it('should accept a function as value option', function () {
        $('body').append('<input type="text" id="element"/>');
        var str = 'fo';
        var parsley = $('#element').parsley({value: function () { return str = str + 'o' } });
        expect(parsley.getValue()).to.be('foo');
        expect(parsley.getValue()).to.be('fooo');
      });
      it('should properly handle null or undefined values', function () {
        $('body').append('<input type="text" id="element" required value/>');
        expect($('#element').parsley().isValid()).to.be(false);
      });
      afterEach(function () {
        $('#element, .parsley-errors-list').remove();
      });
    });
  };
});
