import $ from 'jquery';

import Parsley from '../../src/parsley';

    describe('ParsleyRemote', function () {
      var stubbed = false;
      var stubAjax = function(status) {
        restoreAjax();
        var deferred = $.Deferred();
        var xhr = $.extend(deferred.promise(), { status: status });
        if(status === 200)
          deferred.resolve({}, 'success', 'xhr');
        else
          deferred.reject(xhr, 'error', 'error');
        sinon.stub($, 'ajax').returns(xhr);
        stubbed = true;
      }
      var restoreAjax = function() {
        if (stubbed)
          $.ajax.restore();
        stubbed = false;
      }

      afterEach(restoreAjax);

      beforeEach(function() {
        delete window.Parsley._remoteCache;
      });
      it('should have window.ParsleyExtend defined', function () {
        expect(window.ParsleyExtend).not.to.be(undefined);
      });
      it('should handle properly validation with remote validator', function (done) {
        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" required name="element" value="foo" />');
        var parsleyInstance = $('#element').parsley();

        stubAjax(400);

        parsleyInstance.whenValid()
          .fail(function () {
            stubAjax(200);

            $('#element').val('bar');
            parsleyInstance.whenValid()
              .done(function () { done() });
          });
      });
      it('should handle remote reverse option', function (done) {
        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" data-parsley-remote-reverse="true" required name="element" value="baz" />');
        var parsleyInstance = $('#element').parsley();

        stubAjax(200);
        parsleyInstance.whenValid()
          .fail(function () {
            stubAjax(400);

            $('#element').val('bux');
            parsleyInstance.whenValid()
              .done(function () { done() });
          });
      });
      it('should handle remote options', function (done) {
        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" data-parsley-remote-options=\'{ "type": "POST", "data": {"foo": "bar"} }\' required name="element" value="baz" />');
        var parsleyInstance = $('#element').parsley();

        stubAjax(200);
        parsleyInstance.whenValid()
          .done(function () {
            expect($.ajax.calledWithMatch({ type: "POST" })).to.be(true);
            expect($.ajax.calledWithMatch({ url: "http://foo.bar" })).to.be(true);
            expect($.ajax.calledWithMatch({ data: { "foo": "bar", "element": "baz" } })).to.be(true);
            done();
          });
      });
      it('should save some calls for queries already done', function (done) {
        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" required name="element" value="foo" />');
        var parsleyInstance = $('#element').parsley();

        stubAjax(200);
        parsleyInstance.whenValid()
          .done(function () {
            expect($.ajax.calledOnce).to.be(true);
            expect($.ajax.calledWithMatch({ data: { "element": "foo" } })).to.be(true);
            stubAjax(400);

            $('#element').val('bar');
            parsleyInstance.whenValid()
              .fail(function () {
                expect($.ajax.calledOnce).to.be(true);
                expect($.ajax.calledWithMatch({ data: { "element": "bar" } })).to.be(true);

                stubAjax(200);
                $('#element').val('foo');

                parsleyInstance.whenValid()
                  .done(function () {
                    expect($.ajax.callCount).to.be(0);
                    expect($.ajax.calledOnce).to.be(false);
                    done();
                  });
              });
          });
      });

      it('should handle remote validator option', function (done) {
        window.Parsley.addAsyncValidator('custom', function(xhr) {
          return xhr.status === 404;
        });

        $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" data-parsley-remote-validator="custom" required name="element" value="foobar" />');
        var parsleyInstance = $('#element').parsley();

        stubAjax(200);
        parsleyInstance.whenValid()
          .fail(function () {
            stubAjax(400);

            $('#element').val('foobaz');
            parsleyInstance.whenValid()
              .fail(function () {
                stubAjax(404);

                $('#element').val('fooquux');
                parsleyInstance.whenValid()
                  .done(function () { done() });
              });
          });
      });
      it('should handle remote validator option with custom url', function (done) {
        $('body').append('<input type="text" data-parsley-remote id="element" data-parsley-remote-validator="mycustom" required name="element" value="foobar" />');
        var parsleyInstance = $('#element').parsley();

        window.Parsley.addAsyncValidator('mycustom', function (xhr) {
          return xhr.status === 404;
        }, 'http://foobar.baz');

        stubAjax(200);
        parsleyInstance.whenValid()
          .fail(function () {
            expect($.ajax.calledWithMatch({ url: "http://foobar.baz" })).to.be(true);
            done();
          });
      });
      it('should have PluginField as the `this` context of the AJAX callback', function(done) {
        $('body').append('<input type="text" data-parsley-remote id="element" data-parsley-remote-validator="mycustom" required name="element" value="foobar" />');
        var parsleyInstance = $('#element').parsley();

        window.Parsley.addAsyncValidator('mycustom', function (xhr) {
          expect(this.__class__).to.be('ParsleyField');
        }, 'http://foobar.baz');

        stubAjax(200);
        parsleyInstance.whenValid()
          .fail(function () {
            expect($.ajax.calledWithMatch({ url: "http://foobar.baz" })).to.be(true);
            done();
          });
      });

      it('should clear the cache when submitting a form', function () {
        var parsleyInstance =
          $('<form id="element"><input type="text" required></form>')
          .appendTo('body')
          .on('submit', function(evt) { evt.preventDefault(); } )
          .parsley();
        window.Parsley._remoteCache = {dummy: 42};
        $('#element').submit();
        $('#element input').val('hello');
        parsleyInstance.validate();
        expect(window.Parsley._remoteCache.dummy).to.be(42);
        $('#element').submit();
        expect(window.Parsley._remoteCache.dummy).to.be(undefined);
      });

      it('should allow the change of XHR options', function (done) {
        var parsleyInstance =
          $('<input id="element" data-parsley-remote="http://parsleyjs.org" name="element" value="foobar"/>')
          .appendTo('body')
          .parsley()
          .on('field:ajaxoptions', function (field, options) {
            options.url = options.url + '/test/' + options.data.element;
          });

        stubAjax(200);
        parsleyInstance.whenValid()
          .done(function () {
            expect($.ajax.calledWithMatch({ url: "http://parsleyjs.org/test/foobar" })).to.be(true);
            expect($.ajax.calledWithMatch({ data: {element: 'foobar'} })).to.be(true);
            done();
          });
      });

      it('should allow RESTful URLs', function (done) {
        var parsleyInstance =
          $('<input id="element" data-parsley-remote="http://parsleyjs.org/thisisrest/{value}" name="element" value="foo bar"/>')
          .appendTo('body')
          .parsley();

        stubAjax(200);
        parsleyInstance.whenValid()
          .done(function () {
            expect($.ajax.calledWithMatch({ url: "http://parsleyjs.org/thisisrest/foo%20bar" })).to.be(true);
            expect($.ajax.calledWithMatch({ data: {element: 'foo bar'} })).to.be(false);
            done();
          });
      });

      it.skip('should abort successives querries and do not handle their return');
      afterEach(function () {
        $('#element, .parsley-errors-list').remove();
      });
    });
