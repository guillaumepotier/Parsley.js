define(function () {
  return function (Parsley) {
    describe('Parsley', function () {
      it('should be an function', function () {
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
      it('should handle namespace configuration', function () {
        $('body').append('<div id="element"></div>');

        // default ParsleyOptions.namespace
        expect(new Parsley($('#element'))['namespace']).to.be('data-parsley-');

        // global JS config
        window.ParsleyConfig = {namespace: 'data-foo-'};
        expect(new Parsley($('#element'))['namespace']).to.be('data-foo-');

        // option on the go
        expect(new Parsley($('#element'), {
          namespace: "data-bar-"
        })['namespace']).to.be('data-bar-');

        // data- DOM-API
        $('#element').attr('data-parsley-namespace', 'data-baz-');
        expect(new Parsley($('#element'), {
          namespace: "data-bar-"
        })['namespace']).to.be('data-baz-');
        delete window.ParsleyConfig.namespace;
      });
      it('should handle proper options management', function () {
        $('body').append('<form id="element" data-parsley-foo="bar" data-parsley-baz="baz"></form>');
        window.ParsleyConfig = {bar: "baz", baz:"qux"};
        var parsleyInstance = new Parsley($('#element'), {qux: "bux"});
        expect(parsleyInstance.options.foo).to.be('bar');
        expect(parsleyInstance.options.baz).to.be('baz');
        expect(parsleyInstance.options.bar).to.be('baz');
        expect(parsleyInstance.options.qux).to.be('bux');
      });
      it('should have a jquery plugin API', function () {
        $('body').append('<div id="element" data-parsley-namespace="baz-"></div>');
        var parsleyInstance = $('#element').parsley({foo: 'bar'});
        expect(parsleyInstance.__class__).to.be('Parsley');
        expect(parsleyInstance.namespace).to.be('baz-');
        expect(parsleyInstance.options.foo).to.be('bar');
      });
      afterEach(function () {
        if ($('#element').length)
            $('#element').remove();
      });
    });
  }
});
