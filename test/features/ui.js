define(function () {
  return function (ParsleyUI) {
    describe('ParsleyUI', function () {
      it('should be an function', function () {
        expect(ParsleyUI).to.be.a('function');
      });
      it('should throw an error if no parsleyFieldInstance given', function () {
        expect(ParsleyUI).to.throwException();
        try {
          new ParsleyUI(new Parsley());
          expect(false).to.be(true);
        } catch (e) {
          expect(true).to.be(true);
        }
        $('body').append('<input type="text" id="element" />');
        var UI = new ParsleyUI(new Parsley($('#element')));
        expect(UI.__class__).to.be('ParsleyUI');
      });
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();
      });
    });
  }
});
