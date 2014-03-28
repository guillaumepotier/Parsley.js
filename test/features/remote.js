define('features/remote', [
  'src/parsley.remote',
], function (ParsleyExtend) {

  // Preseve ParsleyExtend in order to load it only when needed by this suite and do not alter other tests runned before
  window._remoteParsleyExtend = window.ParsleyExtend;
  window._remoteParsleyConfig = window.ParsleyConfig;
  window.ParsleyExtend = window.ParsleyExtend || {};
  window.ParsleyConfig = window.ParsleyConfig || {};

  return function () {
    describe('ParsleyRemote', function () {
      before(function () {
        // Restore ParsleyExtend from remote
        window.ParsleyExtend = window._remoteParsleyExtend;
        window.ParsleyConfig = window._remoteParsleyConfig;
        window.ParsleyValidator.init(window.ParsleyConfig.validators);
      });
      it('should have window.ParsleyExtend defined', function () {
        expect(window.ParsleyExtend).not.to.be(undefined);
      });
      it('should return a promise object when calling asyncIsValid and asyncValidate on a field', function () {
        $('body').append('<input type="email" id="element" required data-parsley-remote="http://foo.bar" />');
        var promise = $('#element').psly().asyncIsValid();
        expect(promise).to.be.an('object');
        expect(promise).to.have.key('promise');
        promise = $('#element').psly().asyncValidate();
        expect(promise).to.be.an('object');
        expect(promise).to.have.key('promise');
      });
      it('should return a promise object when calling asyncIsValid and asyncValidate on a form', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
        var promise = $('#element').psly().asyncIsValid();
        expect(promise).to.be.an('object');
        expect(promise).to.have.key('promise');
        promise = $('#element').psly().asyncValidate();
        expect(promise).to.be.an('object');
        expect(promise).to.have.key('promise');
      });
      it('should trigger right events on asyncValidate for form and field', function (done) {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
        $('#element').psly()
          .subscribe('parsley:form:validated', function () { done(); })
          .asyncValidate();
      });
      it('should have a force option for asyncValidate and asyncIsValid methods', function (done) {
        $('body').append('<input type="email" id="element" />');
        var parsleyInstance = $('#element').parsley();
        parsleyInstance.asyncIsValid()
          .done(function () {
            parsleyInstance.asyncValidate()
              .done(function () {
                parsleyInstance.asyncIsValid(true)
                  .fail(function () {
                    parsleyInstance.asyncValidate(true)
                      .fail(function () {
                        done();
                      });
                  });
              });
          });
      });
      it('should handle properly validation with remote validator', function (done) {
        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" required name="element" value="foo" />');
        var parsleyInstance = $('#element').parsley();

        sinon.stub($, 'ajax').returns($.Deferred().reject({ status: 400, state: function () { return 'rejected' } }, 'error', 'error'));
        parsleyInstance.asyncIsValid()
          .fail(function () {
            $.ajax.restore();
            sinon.stub($, 'ajax').returns($.Deferred().resolve({}, 'success', { status: 200, state: function () { return 'resolved' } }));

            $('#element').val('bar');
            parsleyInstance.asyncIsValid()
              .done(function () {
                $.ajax.restore();
                done();
              });
          });
      });
      it('should handle remote reverse option', function (done) {
        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" data-parsley-remote-reverse="true" required name="element" value="baz" />');
        var parsleyInstance = $('#element').parsley();

        sinon.stub($, 'ajax').returns($.Deferred().resolve({}, 'success', { status: 200, state: function () { return 'resolved' } }));
        parsleyInstance.asyncIsValid()
          .fail(function () {
            $.ajax.restore();
            sinon.stub($, 'ajax').returns($.Deferred().reject({ status: 400, state: function () { return 'rejected' } }, 'error', 'error'));

            $('#element').val('bux');
            parsleyInstance.asyncIsValid()
              .done(function () {
                $.ajax.restore();
                done();
              });
          });
      });
      it('should handle remote options', function (done) {
        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" data-parsley-remote-options=\'{ "type": "POST", "data": {"foo": "bar"} }\' required name="element" value="baz" />');
        var parsleyInstance = $('#element').parsley();

        sinon.stub($, 'ajax').returns($.Deferred().resolve({}, 'success', { status: 200, state: function () { return 'resolved' } }));
        parsleyInstance.asyncIsValid()
          .done(function () {
            expect($.ajax.calledWithMatch({ type: "POST" })).to.be(true);
            expect($.ajax.calledWithMatch({ url: "http://foo.bar" })).to.be(true);
            expect($.ajax.calledWithMatch({ data: { "foo": "bar", "element": "baz" } })).to.be(true);
            $.ajax.restore();
            done();
          });
      });

      it('should save some calls for querries already done', function (done) {
        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" required name="element" value="foo" />');
        var parsleyInstance = $('#element').parsley();

        sinon.stub($, 'ajax').returns($.Deferred().resolve({}, 'success', { status: 200, state: function () { return 'resolved' } }));
        parsleyInstance.asyncIsValid()
          .done(function () {
            expect($.ajax.calledOnce).to.be(true);
            expect($.ajax.calledWithMatch({ data: { "element": "foo" } })).to.be(true);
            $.ajax.restore();
            sinon.stub($, 'ajax').returns($.Deferred().reject({ status: 400, state: function () { return 'rejected' } }, 'error', 'error'));

            $('#element').val('bar');
            parsleyInstance.asyncIsValid()
              .fail(function () {
                expect($.ajax.calledOnce).to.be(true);
                expect($.ajax.calledWithMatch({ data: { "element": "bar" } })).to.be(true);

                $.ajax.restore();
                sinon.stub($, 'ajax').returns($.Deferred().resolve({}, 'success', { status: 200, state: function () { return 'resolved' } }));
                $('#element').val('foo');

                parsleyInstance.asyncIsValid()
                  .done(function () {
                    expect($.ajax.callCount).to.be(0);
                    expect($.ajax.calledOnce).to.be(false);
                    $.ajax.restore();
                    done();
                  });
              });
          });
      });

      it('should handle remote validator option', function (done) {
        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" data-parsley-remote-validator="remote-custom" required name="element" value="foobar" />');
        var parsleyInstance = $('#element').parsley();

        window.ParsleyExtend.addAsyncValidator('remote-custom', function (xhr) {
          return xhr.status === 404;
        });

        sinon.stub($, 'ajax').returns($.Deferred().resolve({}, 'success', { status: 200, state: function () { return 'resolved' } }));
        parsleyInstance.asyncIsValid()
          .fail(function () {
            $.ajax.restore();
            sinon.stub($, 'ajax').returns($.Deferred().reject({ status: 400, state: function () { return 'rejected' } }, 'error', 'error'));

            $('#element').val('foobaz');
            parsleyInstance.asyncIsValid()
              .fail(function () {
                $.ajax.restore();
                sinon.stub($, 'ajax').returns($.Deferred().reject({ status: 404, state: function () { return 'rejected' } }, 'error', 'not found'));

                $('#element').val('fooquux');
                parsleyInstance.asyncIsValid()
                  .done(function () {
                    done();
                  });
              });
          });
      });

      it.skip('should abort successives querries and do not handle their return');
      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();

        if ($('.parsley-errors-list').length)
          $('.parsley-errors-list').remove();
      });
    });

  };
});
