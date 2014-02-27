define(function () {
  return function () {
    describe('PubSub', function () {
      it('listen() without context', function (done) {
        $.listen('foo', function (arg) {
          expect(arg).to.be('bar');
          done();
        });
        $.emit('foo', 'bar');
      });
      it('listen() with context', function (done) {
        var obj = { foo: function (bar) { return 'foo' + bar; } };
        $.listen('foo', obj, function (arg) {
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
      it('unsubscribeTo()', function () {
        $('body').append('<input type="text" id="element" />');
        $.listen('foo', $.noop);
        $.listenTo($('#element').psly(), 'foo', $.noop);
        expect($.subscribed()).to.have.key('foo');
        expect($.subscribed().foo.length).to.be(2);
        $.unsubscribeTo($('#element').psly(), 'foo');
        expect($.subscribed().foo.length).to.be(1);
      });
      it('unsubscribe()', function () {
        $.listen('foo', $.noop);
        expect($.subscribed()).to.have.key('foo');
        expect($.subscribed().foo.length).to.be(1);
        $.unsubscribe('foo', $.noop);
        expect($.subscribed().foo.length).to.be(0);
      });
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();

        if ($('#element2').length)
          $('#element2').remove();

        $.unsubscribeAll('foo');
      });
    });
  };
});
