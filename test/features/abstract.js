define(function () {
  return function (Parsley) {
    describe('ParsleyAbstract', function () {
      it('should provide a actualizeOptions() method', function () {
        $('body').append('<input type="email" data-parsley-pattern="[A-F][0-9]{5}" data-parsley-required id="element" />');
        var parsleyField = new Parsley('#element', { foo: 'bar' });
        expect(parsleyField.options).have.key('pattern');
        expect(parsleyField.options).have.key('required');

        $('#element').removeAttr('data-parsley-pattern');
        parsleyField.actualizeOptions();

        expect(parsleyField.options).not.to.have.key('pattern');
        expect(parsleyField.options).have.key('required');
      });
      it('should use subscribe()', function (done) {
        $('body').append('<input type="email" data-parsley-pattern="[A-F][0-9]{5}" data-parsley-required id="element" />');
        var parsleyField = new Parsley('#element');

        parsleyField.subscribe('foo', function (instance, val) {
          expect(instance.__id__).to.be(parsleyField.__id__);
          expect(val).to.be('baz');
          done();
        });

        $.emit('foo', 'bar');
        $.emit('foo', parsleyField, 'baz');
      });
      it.skip('should use unsubscribe()');
      it('should use reset() on field', function () {
        $('body').append('<input type="email" data-parsley-pattern="[A-F][0-9]{5}" data-parsley-required id="element" />');
        var parsleyField = new Parsley('#element').validate();
        expect($('#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);

        parsleyField.reset();
        expect($('#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
      });
      it.skip('should use reset() on form');
      it.skip('should use destroy() on field');
      it.skip('should use destroy() on form');
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();
        // if ($('.parsley-errors-list').length)
        //   $('.parsley-errors-list').remove();
      });
    });
  }
});
