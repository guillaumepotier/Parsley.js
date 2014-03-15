define(function () {
  return function (Parsley) {
    describe('ParsleyMultiple', function () {
      it('should support select multiple', function () {
        $('body').append(
          '<select multiple id="element" >' +
            '<option value="1">1</option>'  +
            '<option value="2">2</option>'  +
            '<option value="3">3</option>'  +
          '</select>');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.__class__).to.be('ParsleyFieldMultiple');
        expect(parsleyField.options.multiple).to.be('element');
        expect(parsleyField.getValue()).to.be('');
        $('#element option[value="1"]').attr('selected', 'selected');
        expect(parsleyField.getValue()).to.be.eql(['1']);
      });
      it('should not bind radio or checkboxes withoud a name, an id or a multiple option', function () {
        $('body').append('<input type="radio" value="foo" />');
        window.console.warn = sinon.spy();
        var parsleyInstance = $('input[type=radio]').psly();
        expect(parsleyInstance.__class__).to.be('Parsley');
        expect(window.console.warn.called).to.be(true);
        $('input[type=radio]').attr('id', '');
        parsleyInstance = $('input[type=radio]').psly();
        expect(parsleyInstance.__class__).to.be('Parsley');
        expect(window.console.warn.called).to.be(true);
        $('input[type=radio]').attr('id', 'element');
        parsleyInstance = $('#element').parsley();
        expect(parsleyInstance.__class__).to.be('ParsleyFieldMultiple');
        expect(parsleyInstance.options.multiple).to.be('element');
        parsleyInstance.destroy();
        $('input[type=radio]').attr('name', 'element');
        parsleyInstance = $('input[name=element]').parsley();
        expect(parsleyInstance.__class__).to.be('ParsleyFieldMultiple');
        expect(parsleyInstance.options.multiple).to.be('element');
        $('input[name=element]').remove();
      });
      afterEach(function () {
        window.ParsleyConfig = { i18n: window.ParsleyConfig.i18n, validators: window.ParsleyConfig.validators };

        if ($('#element').length)
          $('#element').remove();
        if ($('.parsley-errors-list').length)
          $('.parsley-errors-list').remove();
      });
    });
  };
});
