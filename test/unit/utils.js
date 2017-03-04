import $ from 'jquery';
import Utils from '../../src/parsley/utils';

describe('Utils', () => {
  it('should warn when using the old global ParsleyUtils', () => {
    expectWarning(() => {
      expect(window.ParsleyUtils.deserializeValue('true')).to.be(true);
    });
  });
  it('should have a proper deserializeValue() function', () => {
    expect(Utils.deserializeValue('true')).to.be(true);
    expect(Utils.deserializeValue('1')).to.be(1);
    expect(Utils.deserializeValue('["foo", "bar"]')).to.be.an('array');
    expect(Utils.deserializeValue('{"foo": "bar"}')).to.be.an('object');
  });
  it('should have a proper camelize() function', () => {
    expect(Utils.camelize('foo-bar')).to.be('fooBar');
    expect(Utils.camelize('foo-bar-baz')).to.be('fooBarBaz');
    expect(Utils.camelize('foo-bAr-baz')).to.be('fooBArBaz');
  });
  it('should have a proper dasherize() function', () => {
    expect(Utils.dasherize('fooBar')).to.be('foo-bar');
    expect(Utils.dasherize('fooBarBaz')).to.be('foo-bar-baz');
    expect(Utils.dasherize('fooBArBaz')).to.be('foo-b-ar-baz');
  });
  it('should have a proper attr() function', () => {
    var element = {
      attributes: [
        {
          specified: true,
          name: "data-parsley-foo",
          value: "bar"
        },
        {
          specified: true,
          name: "parsley-foo",
          value: "baz"
        },
        {
          specified: true,
          name: "data-parsley-bar",
          value: "[0, 42]"
        },
        {
          specified: false,
          name: "data-parsley-foo",
          value: "bar"
        },
        {
          foo: "bar"
        }
      ]
    };
    var attr = Utils.attr(element, 'data-parsley-');

    expect(attr).to.eql({'foo': 'bar', 'bar': [0, 42]});
  });
  it('should have a proper attr() function that rewrites a given object', () => {
    var obj = Utils.objectCreate({foo: 'x', fox: 'trot'});
    obj.deleteMe = 'please';
    var $element = $('<b data-parsley-foo="a" data-parsley-bar="[0, 42]" parsley-baz="baz">');

    Utils.attr($element[0], 'data-parsley-', obj);

    expect(obj).to.eql({foo: "a", bar: [0, 42]});
    expect(obj.fox).to.eql('trot');
  });

  it('should have a checkAttr feature', () => {
    var element = $('<span data-parsley-required-message="foo" data-parsley-validate="true">')[0];
    expect(Utils.checkAttr(element, 'data-parsley-', 'required')).to.be(false);
    expect(Utils.checkAttr(element, 'data-parsley-', 'required-message')).to.be(true);
    expect(Utils.checkAttr(element, 'data-parsley-', 'validate')).to.be(true);
  });

  describe('namespaceEvents', () => {
    var itMaps = (what, toWhat) => {
      it(`maps '${what}' to ''`, () => {
        expect(Utils.namespaceEvents(what, 'ns')).to.eql(toWhat);
      });
    };
    itMaps('foo', 'foo.ns');
    for (var evt of ['', '  ', false, null, undefined]) {
      itMaps(evt, '');
    }
    itMaps('   foo    bar   ', 'foo.ns bar.ns');
  });

  describe('parse', () => {
    describe('date', () => {
      it('returns null for invalid dates', () => {
        expect(Utils.parse.date('1972-13-02')).to.be.null;
        expect(Utils.parse.date('1973-02-29')).to.be.null;
        expect(Utils.parse.date('72-01-06')).to.be.null;
        expect(Utils.parse.date('1972/01/06')).to.be.null;
        expect(Utils.parse.date('1972-01-6')).to.be.null;
        expect(Utils.parse.date('1972-1-06')).to.be.null;
        expect(Utils.parse.date('  1972-01 -06  ')).to.be.null;
      });
      it('returns a date for strings of form YYYY/MM/DD', () => {
        expect(Utils.parse.date('1972-01-06')).to.eql(new Date('1972/01/06'));
      });
    });
  });
});
