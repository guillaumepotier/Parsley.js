define(function () {
  return function (ParsleyForm, Parsley) {
    describe('ParsleyForm', function () {
      it('should be an function', function () {
        expect(ParsleyForm).to.be.a('function');
      });
      it('should throw an error if no element given', function () {
        expect(ParsleyForm).to.throwException();
      });
      it('should bind parsleyFields children', function () {
        $('body').append(
          '<form id="element">'                 +
            '<input id="field1" type="text"/>'  +
            '<div id="field2"></div>'           +
            '<textarea id="field2"></textarea>' +
          '</form>');
        parsleyForm = new Parsley($('#element'));
        expect(parsleyForm.fields.length).to.be(2);
      });
      afterEach(function () {
        if ($('#element').length)
            $('#element').remove();
      });
    });
  }
});
