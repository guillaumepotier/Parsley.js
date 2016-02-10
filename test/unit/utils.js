import $ from 'jquery';
import ParsleyUtils from '../../src/parsley/utils';

describe('ParsleyUtils', () => {
  it('should have a proper deserializeValue() function', () => {
    expect(ParsleyUtils.deserializeValue('true')).to.be(true);
    expect(ParsleyUtils.deserializeValue('1')).to.be(1);
    expect(ParsleyUtils.deserializeValue('["foo", "bar"]')).to.be.an('array');
    expect(ParsleyUtils.deserializeValue('{"foo": "bar"}')).to.be.an('object');
  });
  it('should have a proper camelize() function', () => {
    expect(ParsleyUtils.camelize('foo-bar')).to.be('fooBar');
    expect(ParsleyUtils.camelize('foo-bar-baz')).to.be('fooBarBaz');
    expect(ParsleyUtils.camelize('foo-bAr-baz')).to.be('fooBArBaz');
  });
  it('should have a proper dasherize() function', () => {
    expect(ParsleyUtils.dasherize('fooBar')).to.be('foo-bar');
    expect(ParsleyUtils.dasherize('fooBarBaz')).to.be('foo-bar-baz');
    expect(ParsleyUtils.dasherize('fooBArBaz')).to.be('foo-b-ar-baz');
  });
  it('should have a proper attr() function', () => {
    var element = [{
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
    }];
    var attr = ParsleyUtils.attr(element, 'data-parsley-');

    expect(attr).to.eql({'foo': 'bar', 'bar': [0, 42]});
  });
  it('should have a proper attr() function that rewrites a given object', () => {
    var obj = ParsleyUtils.objectCreate({foo: 'x', fox: 'trot'});
    obj.deleteMe = 'please';
    var $element = $('<b data-parsley-foo="a" data-parsley-bar="[0, 42]" parsley-baz="baz">');

    ParsleyUtils.attr($element, 'data-parsley-', obj);

    expect(obj).to.eql({foo: "a", bar: [0, 42]});
    expect(obj.fox).to.eql('trot');
  });

  it('should have a checkAttr feature', () => {
    var $element = $('<span data-parsley-required-message="foo" data-parsley-validate="true">');
    expect(ParsleyUtils.checkAttr($element, 'data-parsley-', 'required')).to.be(false);
    expect(ParsleyUtils.checkAttr($element, 'data-parsley-', 'required-message')).to.be(true);
    expect(ParsleyUtils.checkAttr($element, 'data-parsley-', 'validate')).to.be(true);
  });

  describe('namespaceEvents', () => {
    var itMaps = (what, toWhat) => {
      it(`maps '${what}' to ''`, () => {
        expect(ParsleyUtils.namespaceEvents(what, 'ns')).to.eql(toWhat);
      });
    };
    itMaps('foo', 'foo.ns');
    for (var evt of ['', '  ', false, null, undefined]) {
      itMaps(evt, '');
    }
    itMaps('   foo    bar   ', 'foo.ns bar.ns');
  });
});
