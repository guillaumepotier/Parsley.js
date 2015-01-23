define(function () {
  return function (Parsley) {
    describe('ParsleyBase', function () {
      it('should be a function', function () {
        expect(Parsley).to.be.a('function');
      });
      it('should register some window globals', function () {
        expect(window.ParsleyUI).not.to.be(undefined);
        expect(window.ParsleyUtils).not.to.be(undefined);
        expect(window.ParsleyValidator).not.to.be(undefined);
      });
      it('should throw an error if no element given', function () {
        expect(Parsley).to.throwException();
      });
      it('should return ParsleyForm instance if instantiated on a form', function () {
        $('body').append('<form id="element"></form>');
        var parsleyInstance = new Parsley($('#element'));
        expect(parsleyInstance).to.be.an('object');
        expect(parsleyInstance.__class__).to.be('ParsleyForm');
      });
      it('should return ParsleyField instance if instantiated on a field', function () {
        $('body').append('<input id="element" />');
        var parsleyInstance = new Parsley($('#element'));
        expect(parsleyInstance).to.be.an('object');
        expect(parsleyInstance.__class__).to.be('ParsleyField');
      });
      it('should return Parsley if instantiated on an unsupported element', function () {
        $('body').append('<div id="element"></div>');
        var parsleyInstance = new Parsley($('#element'));
        expect(parsleyInstance).to.be.an('object');
        expect(parsleyInstance.__class__).to.be('Parsley');
      });
      it('should return Parsley instance if instantiated on an excluded field type, and do not have an errors container', function () {
        $('body').append('<input type="submit" id="element" />');
        var parsleyInstance = new Parsley($('#element'));
        expect(parsleyInstance).to.be.an('object');
        expect(parsleyInstance.__class__).to.be('Parsley');
        expect($('#parsley-id-' + parsleyInstance.__id__).length).to.be(0);
      });
      it('should have excluded fields by default', function () {
        $('body').append(
          '<form id="element" >'        +
            '<input type="submit" />'   +
            '<input type="reset" />'    +
            '<input type="hidden" />'   +
            '<input type="button" />'   +
          '</form>');
        var parsleyInstance = $('#element').parsley();
        expect(parsleyInstance.fields.length).to.be(0);
      });
      it('should return ParsleyForm if instantiated on an unsupported element with data-parsley-validate attribute', function () {
        $('body').append('<div id="element" data-parsley-validate></div>');
        var parsleyInstance = new Parsley($('#element'));
        expect(parsleyInstance).to.be.an('object');
        expect(parsleyInstance.__class__).to.be('ParsleyForm');
      });
      it('should handle namespace configuration', function () {
        $('body').append('<div id="element"></div>');

        // default ParsleyOptions.namespace
        expect(new Parsley($('#element')).OptionsFactory.staticOptions.namespace).to.be('data-parsley-');

        // global JS config
        window.ParsleyConfig.namespace = 'data-foo-';
        expect(new Parsley($('#element')).OptionsFactory.staticOptions.namespace).to.be('data-foo-');

        // option on the go
        expect(new Parsley($('#element'), {
          namespace: "data-bar-"
        }).OptionsFactory.staticOptions.namespace).to.be('data-bar-');

        // data- DOM-API
        $('#element').attr('data-parsley-namespace', 'data-baz-');
        expect(new Parsley($('#element'), {
          namespace: "data-bar-"
        }).OptionsFactory.staticOptions.namespace).to.be('data-baz-');
        delete window.ParsleyConfig.namespace;
      });
      it('should handle proper options management', function () {
        $('body').append('<form id="element" data-parsley-foo="bar" data-parsley-baz="baz"></form>');
        window.ParsleyConfig = $.extend(window.ParsleyConfig, {bar: "baz", baz:"qux"});
        var parsleyInstance = new Parsley($('#element'), { qux: "bux" });
        expect(parsleyInstance.options.foo).to.be('bar');
        expect(parsleyInstance.options.baz).to.be('baz');
        expect(parsleyInstance.options.bar).to.be('baz');
        expect(parsleyInstance.options.qux).to.be('bux');
      });
      it('should have a jquery plugin API', function () {
        $('body').append('<input type="text" id="element" data-parsley-namespace="baz-"></div>');
        var parsleyInstance = $('#element').parsley({ foo: 'bar' });
        expect(parsleyInstance.__class__).to.be('ParsleyField');
        expect(parsleyInstance.options.namespace).to.be('baz-');
        expect(parsleyInstance.options.foo).to.be('bar');
      });
      it('should have a jquery API returning undefined if done on a non existing element', function () {
        window.console.warn = sinon.spy();
        expect($('#foo').parsley()).to.be(undefined);
        expect(window.console.warn.called).to.be(true);
      });
      it('should have a jquery API that binds multiple selectors', function () {
        $('body').append('<div id="element">'+
          '<input type="text" id="foo" required />' +
          '<input type="text" id="bar" required />' +
        '</div>');
        expect($('input').parsley().length).to.be(2);
      });
      afterEach(function () {
        window.ParsleyConfig = { i18n: window.ParsleyConfig.i18n, validators: window.ParsleyConfig.validators };

        $('#element').remove();
      });
    });
  };
});
