define(function () {
  return function (ParsleyField, Parsley) {
    describe('ParsleyField', function () {
      it('should be an function', function () {
        expect(ParsleyField).to.be.a('function');
      });
      it('should throw an error if no element given', function () {
        expect(ParsleyField).to.throwException();
      });
      it('should generate proper hash', function () {
        $('body').append('<input type="text" id="element" data-parsley-notnull />')
        expect(new ParsleyField($('#element')).hash.length).to.be(new String('parsley-').length + 7);
      });
      it('should properly bind constraints', function () {
        $('body').append('<input type="text" id="element" data-parsley-required />');
        var parsleyField = new ParsleyField($('#element'), new Parsley($('#element')).options);
        expect(parsleyField.constraints.length).to.be(1);
      });
      afterEach(function () {
        window.ParsleyConfig = {};
        if ($('#element').length)
            $('#element').remove();
      });
    });
  }
});
