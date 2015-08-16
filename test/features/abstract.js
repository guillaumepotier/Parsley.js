define(function () {
  return function () {
    describe('ParsleyAbstract', function () {
      it('should provide a actualizeOptions() method', function () {
        $('body').append('<input type="email" data-parsley-pattern="[A-F][0-9]{5}" data-parsley-required id="element" />');
        var parsleyField = $('#element').parsley({ foo: 'bar' });
        expect(parsleyField.options.pattern).to.eql('[A-F][0-9]{5}');
        expect(parsleyField.options.required).to.eql('');

        $('#element').removeAttr('data-parsley-pattern');
        parsleyField.actualizeOptions();

        expect(parsleyField.options.pattern).to.be(undefined);
        expect(parsleyField.options.required).to.eql('');
      });
      it('should use reset() on field', function () {
        $('body').append('<input type="email" data-parsley-pattern="[A-F][0-9]{5}" data-parsley-required id="element" />');
        var parsleyField = $('#element').parsley();
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
        var parsleyForm = $('#element').parsley();
        parsleyForm.validate();
        expect($('#parsley-id-' + $('#field1').psly().__id__ + ' li').length).to.be(1);

        $('#element').parsley().on('form:reset', function () {
          done();
        });
        parsleyForm.reset();

        expect($('#parsley-id-' + $('#field1').psly().__id__ + ' li').length).to.be(0);
      });
      it('should use destroy() on field', function (done) {
        $('body').append('<input type="email" data-parsley-pattern="[A-F][0-9]{5}" data-parsley-required id="element" />');
        var parsleyField = $('#element').parsley();

        $('#element').parsley().on('field:destroy', function () {
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
        var parsleyForm = $('#element').parsley();
        var fieldEventsCount = 0, formEventsCount = 0;

        // Test that a subscribed field event on parent form would be triggered by fields too
        // Here we only have field1 and field2 as valid parsley fields
        $('#element').parsley().on('field:destroy', function () {
          fieldEventsCount++;
        });

        $('#element').parsley().on('form:destroy', function () {
          formEventsCount++;
        });

        expect($('#element').data('Parsley')).to.have.key('__class__');
        expect($('#element').data('Parsley').__class__).to.be('ParsleyForm');
        expect($('#field1').data('Parsley')).to.have.key('__class__');
        expect($('#field1').data('Parsley').__class__).to.be('ParsleyField');

        parsleyForm.destroy();

        expect(fieldEventsCount).to.be(2);
        expect(formEventsCount).to.be(1);

        // we should never enter here since parsley form instance is destroyed
        window.Parsley.on('form:validate', function () {
          expect(true).to.be(false);
        });

        // test that a submit event does not trigger parsley validation anymore
        $('#element').on('submit', function (e) {
          e.preventDefault();

          expect($('#element').data('Parsley')).to.be(undefined);
          expect($('#field1').data('Parsley')).to.be(undefined);
          window.Parsley.off('form:validate');
          done();
        });

        $('#element').submit();
      });
      afterEach(function () {
        $('#element, .parsley-errors-list').remove();
      });
    });
  };
});
