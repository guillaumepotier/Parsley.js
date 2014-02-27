define(function () {
  return function (ParlseyOptionsFactory) {
    describe('ParlseyOptionsFactory', function () {
      before(function() {
        ParsleyUtils._attr = ParsleyUtils.attr;
        ParsleyUtils.attr = sinon.stub().returns({ bar: 'bar', qux: 'bux' });
      });
      it('should be a function', function () {
        expect(ParlseyOptionsFactory).to.be.a('function');
      });
      it('should handle simple instanciation', function () {
        var options = new ParlseyOptionsFactory(
          { foo: 'bar', bar: 'baz', baz: 'qux' },
          { foo: 'BAR', bar: 'BAZ' },
          { foo: null }
        );
        expect(options.staticOptions).to.eql({ foo: null, bar: 'BAZ', baz: 'qux' });
      });
      it('should throw an exception if get() called withoud a Parsley instance', function () {
        expect(new ParlseyOptionsFactory().get).to.throwException();
      });
      it('should handle properly ParsleyForm options', function () {
        var options = new ParlseyOptionsFactory(
          { foo: 'bar', bar: 'baz', baz: 'qux' },
          { foo: 'BAR', bar: 'BAZ' },
          { foo: null }
        );
        expect(options.get({'__class__': 'ParsleyForm'})).to.eql({ foo: null, bar: 'bar', baz: 'qux', qux: 'bux' });
      });
      it('should handle properly ParsleyField options', function () {
        var options = new ParlseyOptionsFactory(
          { foo: 'bar', bar: 'baz', baz: 'qux' },
          { foo: 'BAR', bar: 'BAZ' },
          { foo: null }
        );
        options.formOptions = { bar: 'bux', bux: 'bux' };
        expect(options.get({'__class__': 'ParsleyField'})).to.eql({ foo: null, bar: 'bar', baz: 'qux', qux: 'bux', bux: 'bux' });
      });
      after(function () {
        ParsleyUtils.attr = ParsleyUtils._attr;
        delete(ParsleyUtils._attr);
      });
    });
  };
});
