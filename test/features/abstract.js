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

        parsleyField.subscribe('parsley:field:foo', function (instance, val) {
          expect(instance.__id__).to.be(parsleyField.__id__);
          expect(val).to.be('baz');
          done();
        });

        $.emit('parsley:field:foo', 'bar');
        $.emit('parsley:field:foo', parsleyField, 'baz');
      });
      it.skip('should use unsubscribe()');
      it('should use reset() on field', function () {
        $('body').append('<input type="email" data-parsley-pattern="[A-F][0-9]{5}" data-parsley-required id="element" />');
        var parsleyField = new Parsley('#element');
        parsleyField.validate();
        expect($('#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(1);

        parsleyField.reset();
        expect($('#parsley-id-' + parsleyField.__id__ + ' li').length).to.be(0);
      });
      it('should use reset() on form', function (done) {
        $('body').append(
          '<form id="element">'                           +
            '<input id="field1" type="text" required />'  +
            '<div id="field2"></div>'                     +
            '<textarea id="field2"></textarea>'           +
          '</form>');
        parsleyForm = new Parsley($('#element'));
        parsleyForm.validate();
        expect($('#parsley-id-' + $('#field1').psly().__id__ + ' li').length).to.be(1);

        parsleyForm.subscribe('parsley:form:reset', function () {
          done();
        });

        parsleyForm.reset();
        expect($('#parsley-id-' + $('#field1').psly().__id__ + ' li').length).to.be(0);
      });
      it('should use destroy() on field', function (done) {
        $('body').append('<input type="email" data-parsley-pattern="[A-F][0-9]{5}" data-parsley-required id="element" />');
        var parsleyField = new Parsley('#element');

        parsleyField.subscribe('parsley:field:destroy', function () {
          done();
        });

        expect($('#element').data('Parsley')).to.have.key('__class__');
        expect($('#element').data('Parsley').__class__).to.be('ParsleyField');
        parsleyField.destroy();
        expect($('#element').data('Parsley')).to.be(undefined);
      });
      it('should use destroy() on form', function (done) {
        var triggered = 0;

        $('body').append(
          '<form id="element">'                 +
            '<input id="field1" type="text"/>'  +
            '<div id="field2"></div>'           +
            '<textarea id="field2"></textarea>' +
          '</form>');
        parsleyForm = new Parsley($('#element'));

        // Test that a subscribed field event on parent form would be triggered by fields too
        // Here we only have field1 and field2 as valid parsley fields
        parsleyForm.subscribe('parsley:field:destroy', function () {
          if (1 === triggered)
            done();

          triggered++;
        });

        expect($('#element').data('Parsley')).to.have.key('__class__');
        expect($('#element').data('Parsley').__class__).to.be('ParsleyForm');
        expect($('#field1').data('Parsley')).to.have.key('__class__');
        expect($('#field1').data('Parsley').__class__).to.be('ParsleyField');

        parsleyForm.destroy();

        expect($('#element').data('Parsley')).to.be(undefined);
        expect($('#field1').data('Parsley')).to.be(undefined);
      });
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();

        if ($('.parsley-errors-list').length)
          $('.parsley-errors-list').remove();
      });
    });
  };
});
