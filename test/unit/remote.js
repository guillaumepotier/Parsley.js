import $ from 'jquery';

import Parsley from '../../src/parsley';

describe('ParsleyRemote', () => {
  var stubbed = false;
  var stubAjax = status => {
    restoreAjax();
    var deferred = $.Deferred();
    var xhr = Object.assign(deferred.promise(), {status: status});
    if (status === 200) {
      deferred.resolve({}, 'success', 'xhr');
    } else {
      deferred.reject(xhr, 'error', 'error');
    }
    sinon.stub($, 'ajax').returns(xhr);
    stubbed = true;
  };
  var restoreAjax = () => {
    if (stubbed)
      $.ajax.restore();
    stubbed = false;
  };

  afterEach(restoreAjax);

  beforeEach(() => {
    delete window.Parsley._remoteCache;
  });
  it('should have window.ParsleyExtend defined', () => {
    expect(window.ParsleyExtend).not.to.be(undefined);
  });
  it('should handle properly validation with remote validator', done => {
    $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" required name="element" value="foo" />');
    var parsleyInstance = $('#element').parsley();

    stubAjax(400);

    parsleyInstance.whenValid()
      .fail(() => {
        stubAjax(200);

        $('#element').val('bar');
        parsleyInstance.whenValid()
          .done(() => { done(); });
      });
  });
  it('should handle remote reverse option', done => {
    $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" data-parsley-remote-reverse="true" required name="element" value="baz" />');
    var parsleyInstance = $('#element').parsley();

    stubAjax(200);
    parsleyInstance.whenValid()
      .fail(() => {
        stubAjax(400);

        $('#element').val('bux');
        parsleyInstance.whenValid()
          .done(() => { done(); });
      });
  });
  it('should handle remote options', done => {
    $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" data-parsley-remote-options=\'{ "type": "POST", "data": {"foo": "bar"} }\' required name="element" value="baz" />');
    var parsleyInstance = $('#element').parsley();

    stubAjax(200);
    parsleyInstance.whenValid()
      .done(() => {
        expect($.ajax.calledWithMatch({type: 'POST'})).to.be(true);
        expect($.ajax.calledWithMatch({url: 'http://foo.bar'})).to.be(true);
        expect($.ajax.calledWithMatch({data: {foo: 'bar', element: 'baz'}})).to.be(true);
        done();
      });
  });
  it('should save some calls for queries already done', done => {
    $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" required name="element" value="foo" />');
    var parsleyInstance = $('#element').parsley();

    stubAjax(200);
    parsleyInstance.whenValid()
      .done(() => {
        expect($.ajax.calledOnce).to.be(true);
        expect($.ajax.calledWithMatch({data: {element: 'foo'}})).to.be(true);
        stubAjax(400);

        $('#element').val('bar');
        parsleyInstance.whenValid()
          .fail(() => {
            expect($.ajax.calledOnce).to.be(true);
            expect($.ajax.calledWithMatch({data: {element: 'bar'}})).to.be(true);

            stubAjax(200);
            $('#element').val('foo');

            parsleyInstance.whenValid()
              .done(() => {
                expect($.ajax.callCount).to.be(0);
                expect($.ajax.calledOnce).to.be(false);
                done();
              });
          });
      });
  });

  it('should handle remote validator option', done => {
    window.Parsley.addAsyncValidator('custom', xhr => {
      return xhr.status === 404;
    });

    $('body').append('<input type="text" data-parsley-remote="http://foo.bar" id="element" data-parsley-remote-validator="custom" required name="element" value="foobar" />');
    var parsleyInstance = $('#element').parsley();

    stubAjax(200);
    parsleyInstance.whenValid()
      .fail(() => {
        stubAjax(400);

        $('#element').val('foobaz');
        parsleyInstance.whenValid()
          .fail(() => {
            stubAjax(404);

            $('#element').val('fooquux');
            parsleyInstance.whenValid()
              .done(() => { done(); });
          });
      });
  });
  it('should handle remote validator option with custom url', done => {
    $('body').append('<input type="text" data-parsley-remote id="element" data-parsley-remote-validator="mycustom" required name="element" value="foobar" />');
    var parsleyInstance = $('#element').parsley();

    window.Parsley.addAsyncValidator('mycustom', xhr => {
      return xhr.status === 404;
    }, 'http://foobar.baz');

    stubAjax(200);
    parsleyInstance.whenValid()
      .fail(() => {
        expect($.ajax.calledWithMatch({url: 'http://foobar.baz'})).to.be(true);
        done();
      });
  });
  it('should have PluginField as the `this` context of the AJAX callback', done => {
    $('body').append('<input type="text" data-parsley-remote id="element" data-parsley-remote-validator="mycustom" required name="element" value="foobar" />');
    var parsleyInstance = $('#element').parsley();

    window.Parsley.addAsyncValidator('mycustom', function (xhr) {
      expect(this.__class__).to.be('Field');
    }, 'http://foobar.baz');

    stubAjax(200);
    parsleyInstance.whenValid()
      .fail(() => {
        expect($.ajax.calledWithMatch({url: 'http://foobar.baz'})).to.be(true);
        done();
      });
  });

  it('should handle deprecated call to addAsyncValidator using an instance', () => {
    $('body').append('<input type="text" data-parsley-remote id="element" data-parsley-remote-validator="mycustom" required name="element" value="foobar" />');

    expectWarning(() => {
      $('input').parsley().addAsyncValidator('instancetest', $.noop, '');
    });
    expect(Parsley.asyncValidators.instancetest).not.to.be(undefined);
  });

  it('should clear the cache before and after submitting a form', () => {
    var parsleyInstance =
      $('<form id="element"><input type="text" required></form>')
      .appendTo('body')
      .on('submit', evt => { evt.preventDefault(); })
      .parsley();
    window.Parsley._remoteCache = {dummy: 42};
    $('#element').submit();
    expect(window.Parsley._remoteCache.dummy).to.be(undefined);
    window.Parsley._remoteCache = {dummy: 42};
    $('#element input').val('hello');
    parsleyInstance.validate();
    expect(window.Parsley._remoteCache.dummy).to.be(42);
    $('#element').submit();
    expect(window.Parsley._remoteCache.dummy).to.be(undefined);
  });

  it('should allow the change of XHR options', done => {
    var parsleyInstance =
      $('<input id="element" data-parsley-remote="http://parsleyjs.org" name="element" value="foobar"/>')
      .appendTo('body')
      .parsley()
      .on('field:ajaxoptions', (field, options) => {
        options.url = options.url + '/test/' + options.data.element;
      });

    stubAjax(200);
    parsleyInstance.whenValid()
      .done(() => {
        expect($.ajax.calledWithMatch({url: 'http://parsleyjs.org/test/foobar'})).to.be(true);
        expect($.ajax.calledWithMatch({data: {element: 'foobar'}})).to.be(true);
        done();
      });
  });

  it('should allow RESTful URLs', done => {
    var parsleyInstance =
      $('<input id="element" data-parsley-remote="http://parsleyjs.org/thisisrest/{value}" name="element" value="foo bar"/>')
      .appendTo('body')
      .parsley();

    stubAjax(200);
    parsleyInstance.whenValid()
      .done(() => {
        expect($.ajax.calledWithMatch({url: 'http://parsleyjs.org/thisisrest/foo%20bar'})).to.be(true);
        expect($.ajax.calledWithMatch({data: {element: 'foo bar'}})).to.be(false);
        done();
      });
  });

  it.skip('should abort successives querries and do not handle their return');
  afterEach(() => {
    $('#element, .parsley-errors-list').remove();
  });
});
