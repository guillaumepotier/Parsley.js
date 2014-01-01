define(function () {
  return function (ParsleyField) {
    describe('ParsleyField', function () {
      it('should be an function', function () {
        expect(ParsleyField).to.be.a('function');
      });
      it('should throw an error if no element given', function () {
        expect(ParsleyField).to.throwException();
      });
    });
  }
});
