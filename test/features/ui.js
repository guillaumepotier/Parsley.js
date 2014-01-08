define(function () {
  return function (ParsleyUI) {
    describe('ParsleyUI', function () {
      it('should be an function', function () {
        expect(ParsleyUI).to.be.a('function');
      });
      it('should have a listen() method', function () {
        var UI = new ParsleyUI();
        expect(UI.listen).not.to.be(undefined);
      });
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();
      });
    });
  }
});
