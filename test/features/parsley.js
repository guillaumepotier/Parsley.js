define(function () {
  return function (Parsley) {
    describe('Parsley', function () {
      it('should be an function', function () {
        expect(Parsley).to.be.a('function');
      });
      it('should return this without an element', function () {
        expect(new Parsley()).to.be.an('object');
        expect(new Parsley().__class__).to.be('Parsley');
      });
    });
  }
});
