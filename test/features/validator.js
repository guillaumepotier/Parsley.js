define(function () {
  return function (ParsleyValidator) {
    describe('ParsleyValidator', function () {
      it('should be an function', function () {
        expect(ParsleyValidator).to.be.a('function');
      });
      it('should bind global config validators if given in constructor', function () {
        window.ParsleyConfig = {
          validators: {
            foo: { fn: function () {}, priority: 42 },
            bar: { fn: function () {}, priority: 12 }
          }
        };
        var parsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators);
        expect(parsleyValidator.validators).to.have.key('foo');
        expect(parsleyValidator.validators).to.have.key('bar');
      });
      it('should have a required validator', function () {
        var parsleyValidator = new ParsleyValidator();
        expect(parsleyValidator.validate('', parsleyValidator.validators['required']()).length).to.be(1);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators['required']())).to.be(true);
      });
      it('should have a notblank validator', function () {
        var parsleyValidator = new ParsleyValidator();
        expect(parsleyValidator.validate(' ', parsleyValidator.validators['notblank']()).length).to.be(1);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators['notblank']())).to.be(true);
      });
      it('should have a type="email" validator', function () {
        var parsleyValidator = new ParsleyValidator();
        expect(parsleyValidator.validate('', parsleyValidator.validators['type']('email')).length).to.be(1);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators['type']('email')).length).to.be(1);
        expect(parsleyValidator.validate('foo@bar.baz', parsleyValidator.validators['type']('email'))).to.be(true);
        expect(parsleyValidator.validate('foo+bar@bar.baz', parsleyValidator.validators['type']('email'))).to.be(true);
        expect(parsleyValidator.validate('foo.bar@bar.baz', parsleyValidator.validators['type']('email'))).to.be(true);
        expect(parsleyValidator.validate('foo.bar@bar.com.ext', parsleyValidator.validators['type']('email'))).to.be(true);
      });
      afterEach(function () {
        window.ParsleyConfig = { i18n: window.ParsleyConfig.i18n };

        if ($('#element').length)
          $('#element').remove();
      });
    });
  }
});
