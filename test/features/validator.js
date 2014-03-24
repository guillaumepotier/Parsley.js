define(function () {
  return function (ParsleyValidator) {
    describe('ParsleyValidator', function () {
      var parsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators || {}, window.ParsleyConfig.i18n || {});

      it('should be a function', function () {
        expect(ParsleyValidator).to.be.a('function');
      });
      it('should bind global config validators if given in constructor', function () {
        window.ParsleyConfig = {
          i18n : window.ParsleyConfig.i18n,
          validators: $.extend(window.ParsleyConfig.validators, {
            foo: { fn: function () {}, priority: 42 },
            bar: { fn: function () {}, priority: 12 }
          })
        };
        var parsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators);
        expect(parsleyValidator.validators).to.have.key('foo');
        expect(parsleyValidator.validators).to.have.key('bar');
        delete window.ParsleyConfig.validators.foo;
        delete window.ParsleyConfig.validators.bar;
      });
      it('should have a required validator', function () {
        expect(parsleyValidator.validate('', parsleyValidator.validators.required())).not.to.be(true);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.required())).to.be(true);
      });
      it('should have a notblank validator', function () {
        expect(parsleyValidator.validate(' ', parsleyValidator.validators.notblank())).not.to.be(true);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.notblank())).to.be(true);
      });
      it('should have a type="email" validator', function () {
        expect(parsleyValidator.validate('', parsleyValidator.validators.type('email'))).not.to.be(true);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.type('email'))).not.to.be(true);
        expect(parsleyValidator.validate('foo@bar.baz', parsleyValidator.validators.type('email'))).to.be(true);
        expect(parsleyValidator.validate('foo+bar@bar.baz', parsleyValidator.validators.type('email'))).to.be(true);
        expect(parsleyValidator.validate('foo.bar@bar.baz', parsleyValidator.validators.type('email'))).to.be(true);
        expect(parsleyValidator.validate('foo.bar@bar.com.ext', parsleyValidator.validators.type('email'))).to.be(true);
      });
      it('should have a min validator', function () {
        expect(parsleyValidator.validate('', parsleyValidator.validators.min(6))).not.to.be(true);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.min(6))).not.to.be(true);
        expect(parsleyValidator.validate('1', parsleyValidator.validators.min(6))).not.to.be(true);
        expect(parsleyValidator.validate('6', parsleyValidator.validators.min(6))).to.be(true);
        expect(parsleyValidator.validate('10', parsleyValidator.validators.min(6))).to.be(true);
        $('body').append('<input type="text" id="element" value="7" min="2" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a max validator', function () {
        expect(parsleyValidator.validate('', parsleyValidator.validators.max(10))).not.to.be(true);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.max(10))).not.to.be(true);
        expect(parsleyValidator.validate('1', parsleyValidator.validators.max(10))).to.be(true);
        expect(parsleyValidator.validate('1', parsleyValidator.validators.max("10"))).to.be(true);
        expect(parsleyValidator.validate('10', parsleyValidator.validators.max(10))).to.be(true);
        expect(parsleyValidator.validate('17', parsleyValidator.validators.max(10))).not.to.be(true);
        $('body').append('<input type="text" id="element" value="7" max="20" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a range validator', function () {
        expect(parsleyValidator.validate('1', parsleyValidator.validators.range([5, 10]))).not.to.be(true);
        expect(parsleyValidator.validate('7', parsleyValidator.validators.range([5, 10]))).to.be(true);
        expect(parsleyValidator.validate('17', parsleyValidator.validators.range([5, 10]))).not.to.be(true);
        $('body').append('<input type="text" id="element" value="7" max="20" min="2" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a type="number" validator', function () {
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.type('number'))).not.to.be(true);
        expect(parsleyValidator.validate('1', parsleyValidator.validators.type('number'))).to.be(true);
        expect(parsleyValidator.validate('1.5', parsleyValidator.validators.type('number'))).to.be(true);
        expect(parsleyValidator.validate('-1.5', parsleyValidator.validators.type('number'))).to.be(true);
        expect(parsleyValidator.validate('1,500.642', parsleyValidator.validators.type('number'))).to.be(true);
      });
      it('should have a type="digits" validator', function () {
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.type('digits'))).not.to.be(true);
        expect(parsleyValidator.validate('1', parsleyValidator.validators.type('digits'))).to.be(true);
        expect(parsleyValidator.validate('-1', parsleyValidator.validators.type('digits'))).not.to.be(true);
        expect(parsleyValidator.validate('1.5', parsleyValidator.validators.type('digits'))).not.to.be(true);
        expect(parsleyValidator.validate('-1.5', parsleyValidator.validators.type('digits'))).not.to.be(true);
        expect(parsleyValidator.validate('1,500.642', parsleyValidator.validators.type('digits'))).not.to.be(true);
      });
      it('should have a type="integer" validator', function () {
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.type('integer'))).not.to.be(true);
        expect(parsleyValidator.validate('1', parsleyValidator.validators.type('integer'))).to.be(true);
        expect(parsleyValidator.validate('-1', parsleyValidator.validators.type('integer'))).to.be(true);
        expect(parsleyValidator.validate('1.5', parsleyValidator.validators.type('integer'))).not.to.be(true);
        expect(parsleyValidator.validate('-1.5', parsleyValidator.validators.type('integer'))).not.to.be(true);
      });
      it('should have a type="alphanum" validator', function () {
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.type('alphanum'))).to.be(true);
        expect(parsleyValidator.validate('foo bar', parsleyValidator.validators.type('alphanum'))).not.to.be(true);
        expect(parsleyValidator.validate('foo$', parsleyValidator.validators.type('alphanum'))).not.to.be(true);
        $('body').append('<input type="alphanum" id="element" value="v4kRRyhYvo0P" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a type="url" validator', function () {
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.type('url'))).not.to.be(true);
        expect(parsleyValidator.validate('foo bar', parsleyValidator.validators.type('url'))).not.to.be(true);
        expect(parsleyValidator.validate('http://', parsleyValidator.validators.type('url'))).not.to.be(true);
        expect(parsleyValidator.validate('foo.bar', parsleyValidator.validators.type('url'))).to.be(true);
        expect(parsleyValidator.validate('www.foo.bar', parsleyValidator.validators.type('url'))).to.be(true);
        expect(parsleyValidator.validate('http://www.foo.bar', parsleyValidator.validators.type('url'))).to.be(true);
        expect(parsleyValidator.validate('https://www.foo.bar', parsleyValidator.validators.type('url'))).to.be(true);
        expect(parsleyValidator.validate('https://www.foobarbaz.barbazbar.bazbar', parsleyValidator.validators.type('url'))).not.to.be(true);
      });
      it('should have a pattern validator', function () {
        expect(parsleyValidator.validate('a', parsleyValidator.validators.pattern('[a-z]+'))).to.be(true);
        expect(parsleyValidator.validate('A', parsleyValidator.validators.pattern('[a-z]+'))).not.to.be(true);
        expect(parsleyValidator.validate('a', parsleyValidator.validators.pattern('/[a-z]+/'))).to.be(true);
        expect(parsleyValidator.validate('A', parsleyValidator.validators.pattern('/[a-z]+/'))).not.to.be(true);
        expect(parsleyValidator.validate('a', parsleyValidator.validators.pattern('/[a-z]+/i'))).to.be(true);
        expect(parsleyValidator.validate('A', parsleyValidator.validators.pattern('/[a-z]+/i'))).to.be(true);
      });
      it('should have a length validator', function () {
        expect(parsleyValidator.validate('foobar', parsleyValidator.validators.length([3, 9]))).to.be(true);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.length([4, 9]))).not.to.be(true);
        expect(parsleyValidator.validate('foobarbaz', parsleyValidator.validators.length([3, 8]))).not.to.be(true);
      });
      it('should have a minlength validator', function () {
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.minlength(3))).to.be(true);
        expect(parsleyValidator.validate('fo', parsleyValidator.validators.minlength(3))).not.to.be(true);
        $('body').append('<input type="text" id="element" value="foo" minlength="2" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a maxlength validator', function () {
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.maxlength(3))).to.be(true);
        expect(parsleyValidator.validate('foobar', parsleyValidator.validators.maxlength(3))).not.to.be(true);
        $('body').append('<input type="text" id="element" value="foo" maxlength="10" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a check validator', function () {
        expect(parsleyValidator.validate(['foo', 'bar', 'baz'], parsleyValidator.validators.check([3, 5]))).to.be(true);
        expect(parsleyValidator.validate(['foo', 'bar', 'baz', 'qux', 'bux'], parsleyValidator.validators.check([3, 4]))).not.to.be(true);
        expect(parsleyValidator.validate(['foo', 'bar'], parsleyValidator.validators.check([3, 5]))).not.to.be(true);
      });
      it('should have a mincheck validator', function () {
        expect(parsleyValidator.validate(['foo', 'bar', 'baz'], parsleyValidator.validators.mincheck(3))).to.be(true);
        expect(parsleyValidator.validate(['foo', 'bar'], parsleyValidator.validators.mincheck(3))).not.to.be(true);
      });
      it('should have a maxcheck validator', function () {
        expect(parsleyValidator.validate(['foo', 'bar', 'baz'], parsleyValidator.validators.maxcheck(3))).to.be(true);
        expect(parsleyValidator.validate(['foo', 'bar', 'baz', 'qux'], parsleyValidator.validators.maxcheck(3))).not.to.be(true);
      });
      it('should have an equalto validator', function () {
        expect(parsleyValidator.validate('', parsleyValidator.validators.equalto('foo'))).not.to.be(true);
        expect(parsleyValidator.validate('bar', parsleyValidator.validators.equalto('foo'))).not.to.be(true);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.equalto('foo'))).to.be(true);
        $('body').append('<input type="text" id="element" data-parsley-equalto="#equalto" required /><input type="text" id="equalto" value="foo" />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('fo');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo');
        expect($('#element').psly().isValid()).to.be(true);
        $('#equalto').remove();
      });
      it('should handle proper error message for validators', function () {
        expect(parsleyValidator.getErrorMessage({ name: 'length', requirements: [3, 6] })).to.be('This value length is invalid. It should be between 3 and 6 characters long.');
        expect(parsleyValidator.getErrorMessage({ name: 'notexisting' })).to.be('This value seems to be invalid.');
      });
      it('should handle proper error message for validators in various languages', function () {
        parsleyValidator.setLocale('fr');
        expect(parsleyValidator.getErrorMessage({ name: 'length', requirements: [3, 6] })).to.be('Cette valeur doit contenir entre 3 et 6 caractères.');
        expect(parsleyValidator.getErrorMessage({ name: 'notexisting' })).to.be('Cette valeur semble non valide.');
      });
      afterEach(function () {
        window.ParsleyConfig = { i18n: window.ParsleyConfig.i18n, validators: window.ParsleyConfig.validators };

        if ($('#element').length)
          $('#element').remove();
      });
    });
  };
});
