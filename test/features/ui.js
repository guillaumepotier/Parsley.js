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
      it.skip('should create proper errors container');
      it.skip('should show higher priority error message by default');
      it.skip('should show all errors message if priority enabled set to false');
      it.skip('should add proper parsley class on success or failure');
      it.skip('should show custom error message by validator');
      it.skip('should show custom error message for whole field');
      it.skip('should handle triggers');
      it.skip('should auto bind error triggers on field error');
      it.skip('should handle trigger keyup tresshold validation');
      it.skip('should handle UI disabling');
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();
      });
    });
  }
});
