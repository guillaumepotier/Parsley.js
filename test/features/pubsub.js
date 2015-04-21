define(function () {
  return function () {
    describe('PubSub', function () {
      it('listen() without context', function (done) {
        expectWarning(function(){
          $.listen('foo', function (instance, arg) {
            expect(arg).to.be('bar');
            done();
          });
        })
        $.emit('foo', 'bar');
      });
      it('listen() with context', function (done) {
        var obj = { foo: function (bar) { return 'foo' + bar; } };
        $.listen('foo', obj, function (instance, arg) {
          expect(this.foo(arg)).to.be('foobar');
          done();
        });
        $.emit('foo', 'bar');
      });
      it('listenTo() ParsleyField', function (done) {
        $('body').append('<input type="text" id="element" />');
        $('body').append('<input type="text" id="element2" />');

        var instance = $('#element').psly();

        $.listenTo(instance, 'foo', function (parsleyInstance) {
          expect(parsleyInstance.__id__).to.be(instance.__id__);
          done();
        });

        $.emit('foo', 'bar');
        $.emit('foo', $('#element2').psly());
        $.emit('foo', instance);
      });
      it('listenTo() ParsleyForm will listen to Form', function (done) {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');

        $.listenTo($('#element').psly(), 'foo', function (parsleyInstance) {
          expect($('#element').psly().__id__ === parsleyInstance.__id__);
          done();
        });

        $.emit('foo', $('#element').psly());
      });
      it('listenTo() Form will listen to its fields too', function (done) {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');

        $.listenTo($('#element').psly(), 'foo', function (instance) {
          done();
        });

        $.emit('foo', $('#field1').psly());
      });
      it('unsubscribeTo()', function (done) {
        $('body').append('<input type="text" id="element" />');
        $.listen('foo', function() { done(); });
        $.listenTo($('#element').psly(), 'foo', function() { expect(true).to.be(false); });
        $.unsubscribeTo($('#element').psly(), 'foo');
        $.emit('foo', $('#element').psly())
      });
      it('unsubscribe()', function () {
        var fn = function() { expect(true).to.be(false); };
        $.listen('foo', fn);
        $.unsubscribe('foo', fn);
        $.emit('foo');
      });
      afterEach(function () {
        $('#element, #element2').remove();

        $.unsubscribeAll('foo');
      });
    });
  };
});
