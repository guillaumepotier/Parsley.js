define(function () {
  return function (ParsleyValidator, ParsleyValidatorRegistry) {
    describe('ParsleyValidatorRegistry', function () {
      var validatorRegistry = new ParsleyValidatorRegistry(window.ParsleyConfig.validators || {}, window.ParsleyConfig.i18n || {});

      var expectValidation = function(value, name, requirements) {
        var validatorSpec = validatorRegistry.validators[name];
        var validator = new ParsleyValidator(validatorSpec);
        var argList = validator.parseRequirements(requirements);
        argList.unshift(value);
        return expect(validator.validate.apply(validator, argList));
      };

      it('should be a function', function () {
        expect(ParsleyValidatorRegistry).to.be.a('function');
      });
      it('should bind global config validators if given in constructor', function () {
        $.extend(true, window.ParsleyConfig, {
          validators: {
            foo: { fn: function () {}, priority: 42 },
            bar: { fn: function () {}, priority: 12 }
          }
        });
        var validator = new ParsleyValidatorRegistry(window.ParsleyConfig.validators);
        expect(validator.validators).to.have.key('foo');
        expect(validator.validators).to.have.key('bar');
        expect(validatorRegistry.validators).not.to.have.key('foo');
        delete window.ParsleyConfig.validators.foo;
        delete window.ParsleyConfig.validators.bar;
      });
      it('should have a required validator', function () {
        expectValidation('', 'required').not.to.be(true);
        expectValidation('foo', 'required').to.be(true);
      });
      it('should have a notblank validator', function () {
        expectValidation(' ', 'notblank').not.to.be(true);
        expectValidation('foo', 'notblank').to.be(true);
      });
      it('should have a type="email" validator', function () {
        expectValidation('',                    'type', 'email').not.to.be(true);
        expectValidation('foo',                 'type', 'email').not.to.be(true);
        expectValidation('foo@bar.baz',         'type', 'email').to.be(true);
        expectValidation('foo+bar@bar.baz',     'type', 'email').to.be(true);
        expectValidation('foo.bar@bar.baz',     'type', 'email').to.be(true);
        expectValidation('foo.bar@bar.com.ext', 'type', 'email').to.be(true);
      });
      it('should have a min validator', function () {
        expectValidation('',    'min',6).not.to.be(true);
        expectValidation('foo', 'min',6).not.to.be(true);
        expectValidation('1',   'min',6).not.to.be(true);
        expectValidation('6',   'min',6).to.be(true);
        expectValidation('10',  'min',6).to.be(true);
        $('body').append('<input type="text" id="element" value="7" min="2" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a max validator', function () {
        expectValidation('',    'max', 10).not.to.be(true);
        expectValidation('foo', 'max', 10).not.to.be(true);
        expectValidation('1',   'max', 10).to.be(true);
        expectValidation('1',   'max', '10').to.be(true);
        expectValidation('10',  'max', 10).to.be(true);
        expectValidation('17',  'max', 10).not.to.be(true);
        $('body').append('<input type="text" id="element" value="7" max="20" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a range validator', function () {
        expectValidation('1',  'range', [5, 10]).not.to.be(true);
        expectValidation('7',  'range', [5, 10]).to.be(true);
        expectValidation('17', 'range', [5, 10]).not.to.be(true);
        $('body').append('<input type="text" id="element" value="7" max="20" min="2" />');
        expect($('#element').parsley().isValid()).to.be(true);

        $('#element').remove();
        $('body').append('<input type="range" id="element" value="7" max="20" min="2" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a type="number" validator', function () {
        expectValidation('-',         'type', 'number').not.to.be(true);
        expectValidation('foo',       'type', 'number').not.to.be(true);
        expectValidation('1',         'type', 'number').to.be(true);
        expectValidation('1.5',       'type', 'number').to.be(true);
        expectValidation('-1.5',      'type', 'number').to.be(true);
        expectValidation('1,500.642', 'type', 'number').to.be(true);
      });
      it('should have a type="digits" validator', function () {
        expectValidation('foo',       'type', 'digits').not.to.be(true);
        expectValidation('1',         'type', 'digits').to.be(true);
        expectValidation('-1',        'type', 'digits').not.to.be(true);
        expectValidation('1.5',       'type', 'digits').not.to.be(true);
        expectValidation('-1.5',      'type', 'digits').not.to.be(true);
        expectValidation('1,500.642', 'type', 'digits').not.to.be(true);
      });
      it('should have a type="integer" validator', function () {
        expectValidation('foo',  'type', 'integer').not.to.be(true);
        expectValidation('1',    'type', 'integer').to.be(true);
        expectValidation('-1',   'type', 'integer').to.be(true);
        expectValidation('1.5',  'type', 'integer').not.to.be(true);
        expectValidation('-1.5', 'type', 'integer').not.to.be(true);
      });
      it('should have a type="alphanum" validator', function () {
        expectValidation('foo',     'type', 'alphanum').to.be(true);
        expectValidation('foo bar', 'type', 'alphanum').not.to.be(true);
        expectValidation('foo$',    'type', 'alphanum').not.to.be(true);
        $('body').append('<input data-parsley-type="alphanum" id="element" value="v4kRRyhYvo0P" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a type="url" validator', function () {
        expectValidation('foo',                        'type', 'url').not.to.be(true);
        expectValidation('foo bar',                    'type', 'url').not.to.be(true);
        expectValidation('http://',                    'type', 'url').not.to.be(true);
        expectValidation('foo.bar',                    'type', 'url').to.be(true);
        expectValidation('www.foo.bar',                'type', 'url').to.be(true);
        expectValidation('http://www.foo.bar',         'type', 'url').to.be(true);
        expectValidation('https://www.foo.bar',        'type', 'url').to.be(true);
        expectValidation('http://192.168.1.1/foo/bar', 'type', 'url').to.be(true);
      });
      it('should have a pattern validator', function () {
        expectValidation('a', 'pattern','[a-z]+'   ).to.be(true);
        expectValidation('A', 'pattern','[a-z]+'   ).not.to.be(true);
        expectValidation('a', 'pattern','/[a-z]+/' ).to.be(true);
        expectValidation('A', 'pattern','/[a-z]+/' ).not.to.be(true);
        expectValidation('a', 'pattern','/[a-z]+/i').to.be(true);
        expectValidation('A', 'pattern','/[a-z]+/i').to.be(true);
      });
      it('should have a pattern validator that behaves as the standard when not of the form /pattern/flag', function () {
        expectValidation('aa', 'pattern', '[a-z]{1,2}').to.be(true);
        expectValidation('aaa', 'pattern', '[a-z]{1,2}').not.to.be(true);
        expectValidation('aa',  'pattern', '^[a-z]{2}$').to.be(true);
      });
      it('should have a pattern validator that extends the standard for form /pattern/flag', function () {
        expectValidation('zAz', 'pattern', '/a/i').to.be(true);
      });
      it('should have a length validator', function () {
        expectValidation('foobar',    'length', [3, 9]).to.be(true);
        expectValidation('foo',       'length', [4, 9]).not.to.be(true);
        expectValidation('foobarbaz', 'length', [3, 8]).not.to.be(true);
      });
      it('should have a minlength validator', function () {
        expectValidation('foo', 'minlength', 3).to.be(true);
        expectValidation('fo',  'minlength', 3).not.to.be(true);
        $('body').append('<input type="text" id="element" value="foo" data-parsley-minlength="2" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a maxlength validator', function () {
        expectValidation('foo',    'maxlength', 3).to.be(true);
        expectValidation('foobar', 'maxlength', 3).not.to.be(true);
        $('body').append('<input type="text" id="element" value="foo" data-parsley-maxlength="10" />');
        expect($('#element').parsley().isValid()).to.be(true);
      });
      it('should have a check validator', function () {
        expectValidation(['foo', 'bar', 'baz'],               'check', [3, 5]).to.be(true);
        expectValidation(['foo', 'bar', 'baz', 'qux', 'bux'], 'check', [3, 4]).not.to.be(true);
        expectValidation(['foo', 'bar'],                      'check', [3, 5]).not.to.be(true);
      });
      it('should have a mincheck validator', function () {
        expectValidation(['foo', 'bar', 'baz'], 'mincheck', 3).to.be(true);
        expectValidation(['foo', 'bar'],        'mincheck', 3).not.to.be(true);
      });
      it('should have a maxcheck validator', function () {
        expectValidation(['foo', 'bar', 'baz'],        'maxcheck', 3).to.be(true);
        expectValidation(['foo', 'bar', 'baz', 'qux'], 'maxcheck', 3).not.to.be(true);
      });
      it('should have an equalto validator', function () {
        expectValidation('',    'equalto', 'foo').not.to.be(true);
        expectValidation('bar', 'equalto', 'foo').not.to.be(true);
        expectValidation('foo', 'equalto', 'foo').to.be(true);
        $('body').append('<input type="text" id="element" data-parsley-equalto="#equalto" required /><input type="text" id="equalto" value="foo" />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('fo');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo');
        expect($('#element').psly().isValid()).to.be(true);
        $('#equalto').remove();
      });
      it('should handle proper error message for validators', function () {
        expect(validatorRegistry.getErrorMessage({ name: 'length', requirements: [3, 6] })).to.be('This value length is invalid. It should be between 3 and 6 characters long.');
        expect(validatorRegistry.getErrorMessage({ name: 'notexisting' })).to.be('This value seems to be invalid.');
      });
      it('should handle proper error message for validators in various languages', function () {
        validatorRegistry.setLocale('fr');
        expect(validatorRegistry.getErrorMessage({ name: 'length', requirements: [3, 6] })).to.be('Cette valeur doit contenir entre 3 et 6 caractères.');
        expect(validatorRegistry.getErrorMessage({ name: 'notexisting' })).to.be('Cette valeur semble non valide.');
      });

      it('should not break for an incomplete language', function () {
        validatorRegistry.addCatalog('klingon', {}, true);
        expect(validatorRegistry.getErrorMessage({ name: 'type', requirements: 'email' })).to.be('This value seems to be invalid.');
        expect(validatorRegistry.getErrorMessage({ name: 'length', requirements: [3, 6] })).to.be('This value seems to be invalid.');
      });

      afterEach(function () {
        $('#element').remove();
      });

      it('should warn if a custom validator has a reserved name', function () {
        $.extend(true, window.ParsleyConfig, {
          validators: {
            excluded: { fn: function () {}, priority: 42 },
          }
        });

        expectWarning(function() {
          var validatorRegistry = new ParsleyValidatorRegistry(window.ParsleyConfig.validators);
        });
        delete window.ParsleyConfig.validators.excluded;
      });

      it('should warn when adding an already defined validator', function () {
        validatorRegistry.addValidator('foo', $.noop);
        expectWarning(function() {
          validatorRegistry.addValidator('foo', $.noop);
        });
        validatorRegistry.removeValidator('foo');
      });

      it('should warn when updating or deleting a custom validator not already defined', function () {
        expectWarning(function() {
          validatorRegistry.updateValidator('foo', function () {});
        });
        validatorRegistry.removeValidator('foo');
      });

      it('should warn when updating or deleting a custom validator not already defined', function () {
        expectWarning(function() {
          validatorRegistry.removeValidator('foo');
        });
      });

      it('should provide deprecated access through ParsleyValidator for compatibility', function () {
        window.Parsley.formatMessage('foo', 'bar');
        expectWarning(function() {
          window.ParsleyValidator.formatMessage('foo', 'bar');
        });
      });

      it('should provide two ways to add error messages', function () {
        window.Parsley.addValidator('testMessage', {
          validateString: $.noop,
          messages: {
            en: 'Not good at all',
            fr: 'Très nul'
          }
        });
        window.Parsley.addMessage('es', 'testMessage', 'Muy malo');
        expect(window.Parsley.getErrorMessage({name: 'testMessage'})).to.eql('Not good at all');
        window.Parsley.setLocale('fr');
        expect(window.Parsley.getErrorMessage({name: 'testMessage'})).to.eql('Très nul');
        window.Parsley.setLocale('es');
        expect(window.Parsley.getErrorMessage({name: 'testMessage'})).to.eql('Muy malo');
        window.Parsley.setLocale('en');
      });
    });
  };
});
