import $ from 'jquery';
import ParsleyValidator from '../../src/parsley/validator';
import ParsleyValidatorRegistry from '../../src/parsley/validator_registry';
import Parsley from '../../src/parsley';
import fr from '../../src/i18n/fr';

describe('ParsleyValidatorRegistry', () => {
  var validatorRegistry = Parsley._validatorRegistry;

  var expectValidation = function(value, name, requirements, extra = {}) {
    var validatorSpec = validatorRegistry.validators[name];
    var validator = new ParsleyValidator(validatorSpec);
    var argList = validator.parseRequirements(requirements, key => { return extra[key]; });
    argList.unshift(value);
    return expect(validator.validate.apply(validator, argList));
  };

  afterEach(() => {
    Parsley.setLocale('en');
  });

  it('should be a function', () => {
    expect(ParsleyValidatorRegistry).to.be.a('function');
  });
  it('should bind global config validators if given in constructor', () => {
    $.extend(true, Parsley.options, {
      validators: {
        foo: {fn: () => {}, priority: 42},
        bar: {fn: () => {}, priority: 12}
      }
    });
    var validator = new ParsleyValidatorRegistry(Parsley.options.validators);
    expect(validator.validators).to.have.key('foo');
    expect(validator.validators).to.have.key('bar');
    expect(validatorRegistry.validators).not.to.have.key('foo');
    delete Parsley.options.validators.foo;
    delete Parsley.options.validators.bar;
  });
  it('should have a required validator', () => {
    expectValidation('', 'required').not.to.be(true);
    expectValidation('foo', 'required').to.be(true);
  });
  it('should have a notblank validator', () => {
    expectValidation(' ', 'notblank').not.to.be(true);
    expectValidation('foo', 'notblank').to.be(true);
  });
  it('should have a type="email" validator', () => {
    expectValidation('',                    'type', 'email').not.to.be(true);
    expectValidation('foo',                 'type', 'email').not.to.be(true);
    expectValidation('foo@bar.baz',         'type', 'email').to.be(true);
    expectValidation('foo+bar@bar.baz',     'type', 'email').to.be(true);
    expectValidation('foo.bar@bar.baz',     'type', 'email').to.be(true);
    expectValidation('foo.bar@bar.com.ext', 'type', 'email').to.be(true);
  });
  it('should have a min validator', () => {
    expectValidation('',    'min',6).not.to.be(true);
    expectValidation('foo', 'min',6).not.to.be(true);
    expectValidation('1',   'min',6).not.to.be(true);
    expectValidation('6',   'min',6).to.be(true);
    expectValidation('10',  'min',6).to.be(true);
    $('body').append('<input type="text" id="element" value="7" min="2" />');
    expect($('#element').parsley().isValid()).to.be(true);
  });
  it('should have a max validator', () => {
    expectValidation('',    'max', 10).not.to.be(true);
    expectValidation('foo', 'max', 10).not.to.be(true);
    expectValidation('1',   'max', 10).to.be(true);
    expectValidation('1',   'max', '10').to.be(true);
    expectValidation('10',  'max', 10).to.be(true);
    expectValidation('17',  'max', 10).not.to.be(true);
    $('body').append('<input type="text" id="element" value="7" max="20" />');
    expect($('#element').parsley().isValid()).to.be(true);

  });
  it('should have a range validator', () => {
    expectValidation('1',  'range', [5, 10]).not.to.be(true);
    expectValidation('7',  'range', [5, 10]).to.be(true);
    expectValidation('17', 'range', [5, 10]).not.to.be(true);
    $('body').append('<input type="text" id="element" value="7" max="20" min="2" />');
    expect($('#element').parsley().isValid()).to.be(true);

    $('#element').remove();
    $('body').append('<input type="range" id="element" value="7" max="20" min="2" />');
    expect($('#element').parsley().isValid()).to.be(true);
  });
  it('should have a isodaterange validator', () => {
    expectValidation('2016-08-02',  'isodaterange', ['2016-05-01', '2016-08-01']).not.to.be(true);
    expectValidation('2016-08-01',  'isodaterange', ['2016-05-01', '2016-08-01']).to.be(true);
    $('#element').remove();
    $('body').append('<input type="date" id="element" value="2016-08-05" min="2016-08-01" max="2016-08-06" />');
    expect($('#element').parsley().isValid()).to.be(true);

    $('#element').remove();
    $('body').append('<input type="date" id="element" value="2016-08-08" min="2016-08-01" max="2016-08-06" />');
    expect($('#element').parsley().isValid()).to.be(false);
  });
  it('should have a isodatemin validator', () => {
    expectValidation('2016-08-01',  'isodatemin', '2016-08-02').not.to.be(true);
    expectValidation('2016-08-02',  'isodatemin', '2016-08-02').to.be(true);
    $('body').append('<input type="date" id="element" value="2016-08-01" min="2016-08-01" />');
    expect($('#element').parsley().isValid()).to.be(true);

    $('#element').remove();
    $('body').append('<input type="date" id="element" value="2016-08-01" min="2016-08-02" />');
    expect($('#element').parsley().isValid()).to.be(false);
  });
  it('should have a isodatemax validator', () => {
    expectValidation('2016-08-01',  'isodatemax', '2016-08-01').to.be(true);
    expectValidation('2016-08-02',  'isodatemax', '2016-08-01').not.to.be(true);
    $('body').append('<input type="date" id="element" value="2016-08-01" max="2016-08-01" />');
    expect($('#element').parsley().isValid()).to.be(true);

    $('#element').remove();
    $('body').append('<input type="date" id="element" value="2016-08-02" max="2016-08-01" />');
    expect($('#element').parsley().isValid()).to.be(false);
  });
  it('should have a type="number" validator', () => {
    expectValidation('foo',       'type', 'number').not.to.be(true);
    expectValidation('-',         'type', 'number').not.to.be(true);
    expectValidation('1',         'type', 'number').to.be(true);
    expectValidation('1.5',       'type', 'number', {step: 'any'}).to.be(true);
    expectValidation('-1.5',      'type', 'number', {step: 'any'}).to.be(true);
    expectValidation('1500.642',  'type', 'number', {step: 'any'}).to.be(true);
    expectValidation('0.5',       'type', 'number', {step: 'any'}).to.be(true);
    expectValidation('.5',        'type', 'number', {step: 'any'}).to.be(true);
  });
  it('should have a type="digits" validator', () => {
    expectValidation('foo',       'type', 'digits').not.to.be(true);
    expectValidation('1',         'type', 'digits').to.be(true);
    expectValidation('-1',        'type', 'digits').not.to.be(true);
    expectValidation('1.5',       'type', 'digits').not.to.be(true);
    expectValidation('-1.5',      'type', 'digits').not.to.be(true);
    expectValidation('1,500.642', 'type', 'digits').not.to.be(true);
  });
  it('should have a type="integer" validator', () => {
    expectValidation('foo',  'type', 'integer').not.to.be(true);
    expectValidation('1',    'type', 'integer').to.be(true);
    expectValidation('-1',   'type', 'integer').to.be(true);
    expectValidation('1.5',  'type', 'integer').not.to.be(true);
    expectValidation('-1.5', 'type', 'integer').not.to.be(true);
  });
  it('should have a type="alphanum" validator', () => {
    expectValidation('foo',     'type', 'alphanum').to.be(true);
    expectValidation('foo bar', 'type', 'alphanum').not.to.be(true);
    expectValidation('foo$',    'type', 'alphanum').not.to.be(true);
    $('body').append('<input data-parsley-type="alphanum" id="element" value="v4kRRyhYvo0P" />');
    expect($('#element').parsley().isValid()).to.be(true);
  });
  it('should have a type="url" validator', () => {
    expectValidation('foo',                        'type', 'url').not.to.be(true);
    expectValidation('foo bar',                    'type', 'url').not.to.be(true);
    expectValidation('http://',                    'type', 'url').not.to.be(true);
    expectValidation('foo.bar',                    'type', 'url').to.be(true);
    expectValidation('www.foo.bar',                'type', 'url').to.be(true);
    expectValidation('http://www.foo.bar',         'type', 'url').to.be(true);
    expectValidation('https://www.foo.bar',        'type', 'url').to.be(true);
    expectValidation('http://192.168.1.1/foo/bar', 'type', 'url').to.be(true);
  });
  it('should have a type="isodate" validator', () => {
    expectValidation('2016-08-31',  'type', 'isodate').to.be(true);
    expectValidation('2016-8-31',   'type', 'isodate').not.to.be(true);
  });
  it('should have a pattern validator', () => {
    expectValidation('a', 'pattern','[a-z]+'   ).to.be(true);
    expectValidation('A', 'pattern','[a-z]+'   ).not.to.be(true);
    expectValidation('a', 'pattern','/[a-z]+/' ).to.be(true);
    expectValidation('A', 'pattern','/[a-z]+/' ).not.to.be(true);
    expectValidation('a', 'pattern','/[a-z]+/i').to.be(true);
    expectValidation('A', 'pattern','/[a-z]+/i').to.be(true);
  });
  it('should have a pattern validator that behaves as the standard when not of the form /pattern/flag', () => {
    expectValidation('aa', 'pattern', '[a-z]{1,2}').to.be(true);
    expectValidation('aaa', 'pattern', '[a-z]{1,2}').not.to.be(true);
    expectValidation('aa',  'pattern', '^[a-z]{2}$').to.be(true);
  });
  it('should have a pattern validator that extends the standard for form /pattern/flag', () => {
    expectValidation('zAz', 'pattern', '/a/i').to.be(true);
  });
  it('should have a length validator', () => {
    expectValidation('foobar',    'length', [3, 9]).to.be(true);
    expectValidation('foo',       'length', [4, 9]).not.to.be(true);
    expectValidation('foobarbaz', 'length', [3, 8]).not.to.be(true);
  });
  it('should have a minlength validator', () => {
    expectValidation('foo', 'minlength', 3).to.be(true);
    expectValidation('fo',  'minlength', 3).not.to.be(true);
    $('body').append('<input type="text" id="element" value="foo" data-parsley-minlength="2" />');
    expect($('#element').parsley().isValid()).to.be(true);
  });
  it('should have a maxlength validator', () => {
    expectValidation('foo',    'maxlength', 3).to.be(true);
    expectValidation('foobar', 'maxlength', 3).not.to.be(true);
    $('body').append('<input type="text" id="element" value="foo" data-parsley-maxlength="10" />');
    expect($('#element').parsley().isValid()).to.be(true);
  });
  it('should have a check validator', () => {
    expectValidation(['foo', 'bar', 'baz'],               'check', [3, 5]).to.be(true);
    expectValidation(['foo', 'bar', 'baz', 'qux', 'bux'], 'check', [3, 4]).not.to.be(true);
    expectValidation(['foo', 'bar'],                      'check', [3, 5]).not.to.be(true);
  });
  it('should have a mincheck validator', () => {
    expectValidation(['foo', 'bar', 'baz'], 'mincheck', 3).to.be(true);
    expectValidation(['foo', 'bar'],        'mincheck', 3).not.to.be(true);
  });
  it('should have a maxcheck validator', () => {
    expectValidation(['foo', 'bar', 'baz'],        'maxcheck', 3).to.be(true);
    expectValidation(['foo', 'bar', 'baz', 'qux'], 'maxcheck', 3).not.to.be(true);
  });
  it('should have an equalto validator', () => {
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
  it('should handle proper error message for validators', () => {
    expect(validatorRegistry.getErrorMessage({name: 'length', requirements: [3, 6]})).to.be('This value length is invalid. It should be between 3 and 6 characters long.');
    expect(validatorRegistry.getErrorMessage({name: 'notexisting'})).to.be('This value seems to be invalid.');
  });
  it('should handle proper error message for validators in various languages', () => {
    validatorRegistry.setLocale('fr');
    expect(validatorRegistry.getErrorMessage({name: 'length', requirements: [3, 6]})).to.be('Cette valeur doit contenir entre 3 et 6 caractères.');
    expect(validatorRegistry.getErrorMessage({name: 'notexisting'})).to.be('Cette valeur semble non valide.');
  });

  it('should not break for an incomplete language', () => {
    validatorRegistry.addCatalog('klingon', {}, true);
    expect(validatorRegistry.getErrorMessage({name: 'type', requirements: 'email'})).to.be('This value seems to be invalid.');
    expect(validatorRegistry.getErrorMessage({name: 'length', requirements: [3, 6]})).to.be('This value seems to be invalid.');
  });

  afterEach(() => {
    $('#element').remove();
  });

  it('should warn if a custom validator has a reserved name', () => {
    $.extend(true, Parsley.options, {
      validators: {
        excluded: {fn: () => {}, priority: 42},
      }
    });

    expectWarning(() => {
      var validatorRegistry = new ParsleyValidatorRegistry(Parsley.options.validators);
    });
    delete Parsley.options.validators.excluded;
  });

  it('should warn when adding an already defined validator', () => {
    validatorRegistry.addValidator('foo', $.noop);
    expectWarning(() => {
      validatorRegistry.addValidator('foo', $.noop);
    });
    validatorRegistry.removeValidator('foo');
  });

  it('should warn when updating or deleting a custom validator not already defined', () => {
    expectWarning(() => {
      validatorRegistry.updateValidator('foo', () => {});
    });
    validatorRegistry.removeValidator('foo');
  });

  it('should warn when updating or deleting a custom validator not already defined', () => {
    expectWarning(() => {
      validatorRegistry.removeValidator('foo');
    });
  });

  it('should provide deprecated access through ParsleyValidator for compatibility', () => {
    window.Parsley.formatMessage('foo', 'bar');
    expectWarning(() => {
      window.ParsleyValidator.formatMessage('foo', 'bar');
    });
  });

  it('should provide two ways to add error messages', () => {
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
