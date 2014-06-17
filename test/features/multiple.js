define(function () {
  return function (Parsley) {
    describe('ParsleyMultiple', function () {
      it('should return same ParsleyMultiple instance for each field in same multiple group, and it should count as one field in form', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="checkbox" name="check" id="check1" value="1" />'  +
            '<input type="checkbox" name="check" id="check2" value="2" />'  +
            '<input type="checkbox" name="check" id="check3" value="3" />'  +
          '</form>');
        var parsleyMultipleInstance = $('#check1').parsley();
        expect($('#check2').parsley().__id__).to.be(parsleyMultipleInstance.__id__);
        expect($('#check3').parsley().__id__).to.be(parsleyMultipleInstance.__id__);
        expect(parsleyMultipleInstance.$elements.length).to.be(3);
        expect($('#element').parsley().fields.length).to.be(1);
      });
      it('should auto add a data-parsley-multiple attribute to each correctly binded multiple input', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="checkbox" name="check" id="check1" value="1" />'  +
            '<input type="checkbox" name="check" id="check2" value="2" />'  +
            '<input type="checkbox" name="check" id="check3" value="3" />'  +
            '<input type="checkbox" value="foo" />' +
          '</form>');
        $('#element').parsley();
        expect($('#check1').attr('data-parsley-multiple')).to.be('check');
        expect($('#check2').attr('data-parsley-multiple')).to.be('check');
        expect($('#check3').attr('data-parsley-multiple')).to.be('check');
        expect($('#check4').eq(3).attr('data-parsley-multiple')).to.be(undefined);
      });
      it('should have a specific `getValue` method (checkbox)', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="checkbox" name="check[]" id="check1" value="1" />'  +
            '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
          '</form>');
        expect($('#check1').parsley().getValue()).to.be.eql([]);
        expect($('#check2').attr('checked', 'checked').parsley().getValue()).to.be.eql(['2']);
      });
      it('should have a specific `getValue` method (radio)', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="radio" name="radio" id="radio1" value="3" />'  +
            '<input type="radio" name="radio" id="radio2" value="4" />'  +
          '</form>');
        expect($('#radio1').parsley().getValue()).to.be.eql('');
        expect($('#radio2').attr('checked', 'checked').parsley().getValue()).to.be.eql('4');
      });
      it('should handle required constraint (checkbox)', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="checkbox" name="check[]" id="check1" value="1" />'  +
            '<input type="checkbox" name="check[]" id="check2" value="2" required />'  +
          '</form>');
        expect($('#element').parsley().isValid()).to.be(false);
        $('#check2').attr('checked', 'checked');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should handle required constraint (radio)', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="radio" name="radio" id="radio1" value="3" required />'  +
            '<input type="radio" name="radio" id="radio2" value="4" />'  +
          '</form>');
        expect($('#element').parsley().isValid()).to.be(false);
        $('#radio1').attr('checked', 'checked');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should handle check constraint', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="checkbox" name="check[]" id="check1" value="1" data-parsley-check="[1, 2]" />'  +
            '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
            '<input type="checkbox" name="check[]" id="check3" value="3" />'  +
            '<input type="checkbox" name="check[]" id="check4" value="4" />'  +
          '</form>');

        // if not required, field is optional and do not fail
        expect($('#check1').parsley().isValid()).to.be.eql([]);
        expect($('#element').parsley().isValid()).to.be(true);

        // once required, it fails if not rightly checked
        $('#check1').attr('required', 'true');
        expect($('#element').parsley().isValid()).to.be(false);
        $('#check2').attr('checked', 'checked');
        expect($('#element').parsley().isValid()).to.be(true);
        $('#check1').attr('checked', 'checked');
        $('#check3').attr('checked', 'checked');
        expect($('#element').parsley().isValid()).to.be(false);
      });
      it('should support select multiple', function () {
        $('body').append(
          '<select multiple name="foo" id="element" required data-parsley-mincheck="2">' +
            '<option value="1">1</option>'  +
            '<option value="2">2</option>'  +
            '<option value="3">3</option>'  +
          '</select>');
        var parsleyField = new Parsley($('#element'));
        expect(parsleyField.__class__).to.be('ParsleyFieldMultiple');
        expect(parsleyField.options.multiple).to.be('foo');
        expect(parsleyField.getValue()).to.be.eql([]);
        expect(parsleyField.isValid()).to.be(false);
        $('#element option[value="1"]').attr('selected', 'selected');
        expect(parsleyField.getValue()).to.be.eql(['1']);
        expect(parsleyField.isValid()).to.be(false);
        $('#element option[value="2"]').attr('selected', 'selected');
        expect(parsleyField.getValue()).to.be.eql(['1', '2']);
        expect(parsleyField.isValid()).to.be(true);
      });
      it('should support select with default without a value', function () {
        $('body').append(
          '<select id="element" required>'    +
            '<option selected="selected" value>default</option>'  +
            '<option value="2">2</option>'    +
          '</select>');
        expect($('#element').parsley().isValid()).to.be(false);
      });
      it('should not bind radio or checkboxes withoud a name or and id or a multiple option', function () {
        $('body').append('<input type="radio" value="foo" />');
        window.console.warn = sinon.spy();
        var parsleyInstance = $('input[type=radio]').psly();
        expect(parsleyInstance.__class__).to.be('Parsley');
        expect(window.console.warn.called).to.be(true);
        $('input[type=radio]').attr('id', 'element');
        parsleyInstance = $('#element').parsley();
        expect(parsleyInstance.__class__).to.be('ParsleyFieldMultiple');
        expect(parsleyInstance.options.multiple).to.be('element');
        $('#element').attr('name', 'element');
        parsleyInstance = $('input[name=element]').parsley();
        expect(parsleyInstance.__class__).to.be('ParsleyFieldMultiple');
        expect(parsleyInstance.options.multiple).to.be('element');
        parsleyInstance.destroy();
        $('#element').attr('data-parsley-multiple', 'elementfoo');
        parsleyInstance = $('input[name=element]').parsley();
        expect(parsleyInstance.__class__).to.be('ParsleyFieldMultiple');
        expect(parsleyInstance.options.multiple).to.be('elementfoo');
      });
      it('should bind select multiple input without a name or a multiple option', function () {
        $('body').append('<select multiple id="element"></select>');
        expect($('#element').parsley().__class__).to.be('ParsleyFieldMultiple');
        expect($('#element').attr('data-parsley-multiple')).to.be('element');
      });
      it('should remove errors on change, whatever field is changed', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="checkbox" name="check[]" id="check1" value="1" required data-parsley-mincheck="1" />'  +
            '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
            '<input type="checkbox" name="check[]" id="check3" value="3" />'  +
            '<input type="checkbox" name="check[]" id="check4" value="4" />'  +
          '</form>');
        var parsleyInstance = $('#check1').parsley();
        parsleyInstance.validate();
        expect(parsleyInstance.$elements.length).to.be(4);
        expect(parsleyInstance.validationResult).not.to.be(true);
        $('#check2').attr('checked', 'checked');
        $('#check2').trigger($.Event('change'));
        expect(parsleyInstance.validationResult).to.be.eql(true);
      });
      it('should add errors on change if trigger enabled, whatever field is changed', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="checkbox" name="check[]" id="check1" value="1" required data-parsley-mincheck="2" data-parsley-trigger="change" />'  +
            '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
            '<input type="checkbox" name="check[]" id="check3" value="3" />'  +
            '<input type="checkbox" name="check[]" id="check4" value="4" />'  +
          '</form>');
        var parsleyInstance = $('#check1').parsley();
        expect(parsleyInstance.validationResult.length).to.be(0);
        $('#check3').trigger($.Event('change'));
        expect(parsleyInstance.validationResult.length).to.be(1);
      });
      it('should bind only valid multiple siblings sharing the same name', function () {
        $('body').append(
          '<form id="element">' +
            '<input name="foo" type="hidden" value="0"/>' +
            '<input name="foo" id="check" type="checkbox" value="1"/>' +
          '</form>');
        $('#element').parsley();
        expect($('#check').parsley().$elements.length).to.be(1);
      });
      it('should handle form namespace configuration inheritance and click events while multiple binding through ParsleyForm', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="radio" name="radio" id="radio1" value="3" foo-bar-required />'  +
            '<input type="radio" name="radio" id="radio2" value="4" />'  +
          '</form>');
        // set specific namespace here for form
        var parsleyInstance = $('#element').parsley({ namespace: 'foo-bar-' });
        parsleyInstance.validate();
        expect($('ul.parsley-errors-list li').length).to.be(1);
        $('#radio2').trigger('click');
        expect($('ul.parsley-errors-list li').length).to.be(0);
      });
      it('should handle dynamic multiple items removal', function () {
        $('body').append(
          '<form id="element" >' +
            '<input type="checkbox" name="check[]" id="check1" value="1" data-parsley-check="[1, 2]" />'  +
            '<input type="checkbox" name="check[]" id="check2" value="2" />'  +
            '<input type="checkbox" name="check[]" id="check3" value="3" />'  +
            '<input type="checkbox" name="check[]" id="check4" value="4" />'  +
          '</form>');
        // bind all multiple checkbox inputs. TODO refacto multiple binding
        $('#element').parsley();
        var parsleyInstance = $('[type=checkbox]:first').parsley();
        expect(parsleyInstance.$elements.length).to.be(4);
        $('[type=checkbox]:last').remove();
        // validate form to go through all multiple inputs. TODO refacto multiple binding
        $('#element').parsley().validate();
        expect(parsleyInstance.$elements.length).to.be(3);
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
