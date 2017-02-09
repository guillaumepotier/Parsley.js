import $ from 'jquery';
import Parsley from '../../src/parsley';
var Factory = Parsley.Factory;

describe('Factory', () => {
  it('should be a function', () => {
    expect(Factory).to.be.a('function');
  });
  it('should register some window globals', () => {
    expect(window.ParsleyUtils).not.to.be(undefined);
    expect(window.ParsleyValidator).not.to.be(undefined);
  });
  it('should throw an error if no element given', () => {
    expect(Factory).to.throwException();
  });
  it('should return Form instance if instantiated on a form', () => {
    $('body').append('<form id="element"></form>');
    var parsleyInstance = new Factory($('#element')[0]);
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('Form');
  });
  it('should return Field instance if instantiated on a field', () => {
    $('body').append('<input id="element" />');
    var parsleyInstance = new Factory($('#element')[0]);
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('Field');
  });
  it('should return Field even if instantiated on an unsupported element', () => {
    $('body').append('<div id="element"></div>');
    var parsleyInstance = new Factory($('#element')[0]);
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('Field');
  });
  it('should return Field instance even if instantiated on an excluded field type, and do not have an errors container', () => {
    $('body').append('<input type="submit" id="element" />');
    var parsleyInstance = new Factory($('#element')[0]);
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('Field');
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
  it('should return Form if instantiated on an unsupported element with data-parsley-validate attribute', () => {
    $('body').append('<div id="element" data-parsley-validate></div>');
    var parsleyInstance = new Factory($('#element')[0]);
    expect(parsleyInstance).to.be.an('object');
    expect(parsleyInstance.__class__).to.be('Form');
  });
  it('should handle namespace configuration', () => {
    $('body').append('<div id="element"></div>');

    // default ParsleyOptions.namespace
    expect(new Factory($('#element')[0]).options.namespace).to.be('data-parsley-');

    // global JS config
    $('#element').parsley().destroy();
    window.ParsleyConfig.namespace = 'data-foo-';
    expect(new Factory($('#element')[0]).options.namespace).to.be('data-foo-');

    // option on the go
    $('#element').parsley().destroy();
    expect(new Factory($('#element')[0], {
      namespace: 'data-bar-'
    }).options.namespace).to.be('data-bar-');

    // data- DOM-API
    $('#element').parsley().destroy();
    $('#element').attr('data-parsley-namespace', 'data-baz-');
    expect(new Factory($('#element')[0], {
      namespace: 'data-bar-'
    }).options.namespace).to.be('data-bar-');
    delete window.ParsleyConfig.namespace;
  });
  it('should handle proper options management', () => {
    $('body').append('<form id="element" data-parsley-foo="bar" data-parsley-baz="baz"></form>');
    window.ParsleyConfig = Object.assign(window.ParsleyConfig, {bar: 'baz', baz: 'qux'});
    var parsleyInstance = new Factory($('#element')[0], {qux: 'bux'});
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
    expect(parsleyInstance.__class__).to.be('Field');
    expect(parsleyInstance.options.namespace).to.be('baz-');
    expect(parsleyInstance.options.foo).to.be('bar');
  });
  it('should have a jquery API returning undefined if done on a empty set', () => {
    expect($('#foo').parsley()).to.be(undefined);
  });
  it('should have a jquery API that binds multiple selectors', () => {
    $('body').append('<div id="element">' +
      '<input type="text" id="foo" required />' +
      '<input type="text" id="bar" required />' +
    '</div>');
    expect($('input').parsley().length).to.be(2);
  });
  it('should set options with $.fn.parsley', () => {
    $('body').append('<form id="element" data-parsley-foo="bar"></form>');
    var parsleyInstance = $('#element').parsley({foo: 42});
    expect(parsleyInstance.options.foo).to.be(42);
    $('#element').parsley({foo: 'updated'});
    expect(parsleyInstance.options.foo).to.be('updated');
    delete parsleyInstance.options.foo;
    expect(parsleyInstance.options.foo).to.be('bar');
  });

  afterEach(() => {
    $('#element').remove();
  });
});
