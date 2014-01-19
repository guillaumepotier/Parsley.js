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
      afterEach(function () {
        window.ParsleyConfig = { i18n: window.ParsleyConfig.i18n };

        if ($('#element').length)
          $('#element').remove();
      });
    });
  }
});
