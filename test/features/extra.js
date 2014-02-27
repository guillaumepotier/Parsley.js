define('features/extra', [
  'extra/dateiso'
], function () {

  return function (ParsleyValidator) {
    describe('ParsleyExtras', function () {
      it('should have dateiso validator', function () {
        expect(window.ParsleyConfig.validators).to.have.key('dateiso');
        var parsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators);

        expect(parsleyValidator.validate('', parsleyValidator.validators.dateiso())).not.to.be(true);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.dateiso())).not.to.be(true);
        expect(parsleyValidator.validate('1986-30-01', parsleyValidator.validators.dateiso())).not.to.be(true);
        expect(parsleyValidator.validate('1986-12-45', parsleyValidator.validators.dateiso())).not.to.be(true);
        expect(parsleyValidator.validate('1986-12-01', parsleyValidator.validators.dateiso())).to.be(true);
      });
    });
  };
});
