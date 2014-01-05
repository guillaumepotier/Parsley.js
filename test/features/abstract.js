define(function () {
  return function (Parsley) {
    describe('ParsleyAbstract', function () {
      it.skip('should provide a refreshOptions() method', function () {
        $('body').append('<input type="email" data-parsley-pattern="[A-F][0-9]{5}" data-parsley-required id="element" />');
        var parsleyField = new Parsley($('#element'), { foo: 'bar' });
        expect(parsleyField.options).have.key('pattern');
        expect(parsleyField.options).have.key('required');

        $('#element').removeAttr('data-parsley-pattern');
        expect(parsleyField.options).not.to.have.key('pattern');
        expect(parsleyField.options).have.key('required');
      });
      it.skip('should test onFormValidate() listener');
      it.skip('should use addListener()');
      it.skip('should use updateListener()');
      it.skip('should use removeListener()');
      it.skip('should use registerValidator()');
      it.skip('should use removeValidator()');
      it.skip('should use updateValidator()');
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();
      });
    });
  }
});
