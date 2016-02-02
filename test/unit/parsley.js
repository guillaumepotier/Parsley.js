import $ from 'jquery';
import Parsley from '../../src/parsley';
var ParsleyFactory = Parsley.Factory;

describe('ParsleyFactory', () => {
  it('should be a function', () => {
    expect(ParsleyFactory).to.be.a('function');
  });
  it('should register some window globals', () => {
    expect(window.ParsleyUtils).not.to.be(undefined);
    expect(window.ParsleyValidator).not.to.be(undefined);
  });
  it('should throw an error if no element given', () => {
    expect(ParsleyFactory).to.throwException();
  });
  it('should return ParsleyForm instance if instantiated on a form', () => {
    $('body').append('<form id="element"></form>');
    var parsleyInstance = new ParsleyFactory($('#element'));
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('ParsleyForm');
  });
  it('should return ParsleyField instance if instantiated on a field', () => {
    $('body').append('<input id="element" />');
    var parsleyInstance = new ParsleyFactory($('#element'));
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('ParsleyField');
  });
  it('should return ParsleyField even if instantiated on an unsupported element', () => {
    $('body').append('<div id="element"></div>');
    var parsleyInstance = new ParsleyFactory($('#element'));
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('ParsleyField');
  });
  it('should return ParsleyField instance even if instantiated on an excluded field type, and do not have an errors container', () => {
    $('body').append('<input type="submit" id="element" />');
    var parsleyInstance = new ParsleyFactory($('#element'));
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('ParsleyField');
  });
  it('should have excluded fields by default', () => {
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
  it('should return ParsleyForm if instantiated on an unsupported element with data-parsley-validate attribute', () => {
    $('body').append('<div id="element" data-parsley-validate></div>');
    var parsleyInstance = new ParsleyFactory($('#element'));
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('ParsleyForm');
  });
  it('should handle namespace configuration', () => {
    $('body').append('<div id="element"></div>');

    // default ParsleyOptions.namespace
    expect(new ParsleyFactory($('#element')).options.namespace).to.be('data-parsley-');

    // global JS config
    $('#element').parsley().destroy();
    window.ParsleyConfig.namespace = 'data-foo-';
    expect(new ParsleyFactory($('#element')).options.namespace).to.be('data-foo-');

    // option on the go
    $('#element').parsley().destroy();
    expect(new ParsleyFactory($('#element'), {
      namespace: 'data-bar-'
    }).options.namespace).to.be('data-bar-');

    // data- DOM-API
    $('#element').parsley().destroy();
    $('#element').attr('data-parsley-namespace', 'data-baz-');
    expect(new ParsleyFactory($('#element'), {
      namespace: 'data-bar-'
    }).options.namespace).to.be('data-bar-');
    delete window.ParsleyConfig.namespace;
  });
  it('should handle proper options management', () => {
    $('body').append('<form id="element" data-parsley-foo="bar" data-parsley-baz="baz"></form>');
    window.ParsleyConfig = $.extend(window.ParsleyConfig, {bar: 'baz', baz: 'qux'});
    var parsleyInstance = new ParsleyFactory($('#element'), {qux: 'bux'});
    expect(parsleyInstance.options.foo).to.be('bar');
    expect(parsleyInstance.options.baz).to.be('baz');
    expect(parsleyInstance.options.bar).to.be('baz');
    expect(parsleyInstance.options.qux).to.be('bux');
    delete window.ParsleyConfig.bar;
    delete window.ParsleyConfig.baz;
  });
  it('should have a jquery plugin API', () => {
    $('body').append('<input type="text" id="element" data-parsley-namespace="baz-"></div>');
    var parsleyInstance = $('#element').parsley({foo: 'bar'});
    expect(parsleyInstance.__class__).to.be('ParsleyField');
    expect(parsleyInstance.options.namespace).to.be('baz-');
    expect(parsleyInstance.options.foo).to.be('bar');
  });
  it('should have a jquery API returning undefined if done on a non existing element', () => {
    expectWarning(() => {
      expect($('#foo').parsley()).to.be(undefined);
    });
  });
  it('should have a jquery API that binds multiple selectors', () => {
    $('body').append('<div id="element">' +
      '<input type="text" id="foo" required />' +
      '<input type="text" id="bar" required />' +
    '</div>');
    expect($('input').parsley().length).to.be(2);
  });
  afterEach(() => {
    $('#element').remove();
  });
});
